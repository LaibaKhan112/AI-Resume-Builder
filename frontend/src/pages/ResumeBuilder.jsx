import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User
} from 'lucide-react'
import PersonalInfo from '../components/PersonalInfo'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummary from '../components/ProfessionalSummary'
import ProfessionalExperience from '../components/ProfessionalExperience'
import Education from '../components/Education'
import ProjectsForm from '../components/ProjectsForm'
import SkillsForm from '../components/SkillsForm'
import { useReactToPrint } from 'react-to-print'
import { fetchResumeById, updateResumeApi } from '../services/resumeService.jsx'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const navigate = useNavigate()
  const resumeRef = useRef(null)
  const [saving, setSaving] = useState(false)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {
      image: '',
      full_name: '',
      profession: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    professional_summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false
  })

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Sparkles }
  ]

  const activeSection = sections[activeSectionIndex]

  const handleSave = async () => {
    if (!resumeId) return

    try {
      setSaving(true)
      await updateResumeApi(resumeId, resumeData, removeBackground)
    } catch (error) {
      console.error('Error saving resume:', error)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) return

      try {
        const resume = await fetchResumeById(resumeId)
        setResumeData(prev => ({
          ...prev,
          ...resume,
          projects: resume.projects || [],
          personal_info: {
            ...prev.personal_info,
            ...resume.personal_info
          }
        }))
        document.title = resume.title || 'My Resume'
      } catch (err) {
        console.error('Error fetching resume:', err)
      }
    }

    loadResume()
  }, [resumeId])

  const changeResumeVisibility = async () => {
    const newValue = !resumeData.public
    setResumeData(prev => ({ ...prev, public: newValue }))

    if (!resumeId) return

    try {
      await updateResumeApi(resumeId, { ...resumeData, public: newValue }, removeBackground)
    } catch (err) {
      console.error('Error updating visibility:', err)
    }
  }

  const handleShare = () => {
    if (!resumeId) return

    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = `${frontendUrl}/view/${resumeId}`

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: resumeData.title || 'My Resume'
  })

  const handleDownloadClick = () => {
    downloadResume()
  }

  return (
    <div className="px-4 py-4 md:py-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center text-sm md:text-base gap-2 text-gray-500 py-1 md:py-2 cursor-pointer"
          >
            <ArrowLeftIcon className="size-4 md:size-5" />
            Back to dashboard
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {resumeData.public && (
              <button
                onClick={handleShare}
                className="flex items-center p-2 px-3 md:px-4 gap-2 text-xs
                 bg-linear-to-br from-blue-100 to-blue-200 text-blue-600
                 rounded-lg ring-blue-300 hover:ring transition-colors"
              >
                <Share2Icon className="size-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            <button
              onClick={changeResumeVisibility}
              className="flex items-center p-2 px-3 md:px-4 gap-2 text-xs
               bg-linear-to-br from-purple-100 to-purple-200 text-purple-600
               ring-purple-300 rounded-lg hover:ring transition-colors"
            >
              {resumeData.public ? (
                <EyeIcon className="size-4" />
              ) : (
                <EyeOffIcon className="size-4" />
              )}
              <span className="hidden sm:inline">
                {resumeData.public ? 'Public' : 'Private'}
              </span>
            </button>

            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-2 px-4 md:px-6 py-2 text-xs 
               bg-linear-to-br from-green-100 to-green-200 text-green-600
               rounded-lg ring-green-300 hover:ring transition-colors"
            >
              <DownloadIcon className="size-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row w-full gap-6">
          {/* Left Side (Form) */}
          <div className="w-full lg:w-2/5">
            <div className="relative shadow-lg bg-white rounded-md p-4 sm:p-5">
              {/* Progress bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600 border-none transition-all duration-500"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`
                }}
              />

              {/* Template + color + nav */}
              <div className=" flex flex-col gap-3 pt-2 pb-3 bg-white  sm:flex-row sm:items-center sm:justify-between sm:mr-2">
                <div className="flex gap-2 absolute z-10">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={template =>
                      setResumeData(prev => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={color =>
                      setResumeData(prev => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                <div className="flex gap-4 justify-end w-full ">
                  <div className='flex justify-end  gap-4'>
                    {activeSectionIndex > 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(prevIndex =>
                          Math.max(prevIndex - 1, 0)
                        )
                      }
                      disabled={activeSectionIndex === 0}
                      className="flex items-center text-gray-800 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex(prevIndex =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center text-gray-800 text-xs sm:text-sm cursor-pointer ${
                      activeSectionIndex === sections.length - 1 && 'opacity-50'
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>

                  </div>
                  
                </div>
              </div>

              {/* Section content */}
              <div className="mt-2">
                {activeSection.id === 'personal' && (
                  <PersonalInfo
                    data={resumeData.personal_info}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, personal_info: data }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === 'summary' && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        professional_summary: data
                      }))
                    }
                    setResumeData={setResumeData}
                    activeSectionIndex={activeSectionIndex}
                    setActiveSectionIndex={setActiveSectionIndex}
                  />
                )}

                {activeSection.id === 'experience' && (
                  <ProfessionalExperience
                    data={resumeData.experience}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, experience: data }))
                    }
                  />
                )}

                {activeSection.id === 'education' && (
                  <Education
                    data={resumeData.education}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, education: data }))
                    }
                  />
                )}

                {activeSection.id === 'projects' && (
                  <ProjectsForm
                    data={resumeData.projects}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, projects: data }))
                    }
                  />
                )}

                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={data =>
                      setResumeData(prev => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side (Preview) */}
          <div className="w-full lg:w-3/5 shadow-lg border border-gray-300 rounded-md flex flex-col">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <button
                onClick={handleSave}
                className="w-full px-6 py-2 text-xs sm:text-sm
                  bg-linear-to-br from-sky-100 to-sky-200 text-sky-600
                  rounded-lg text-center ring-sky-300 hover:ring transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-auto">
              <div ref={resumeRef}>
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder

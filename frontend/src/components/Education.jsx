import { GraduationCap, Plus, Trash, Trash2 } from 'lucide-react'
import React from 'react'

const Education = ({ data, onChange }) => {

    const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: "",

        }
    
    const addEducation = () => {
        
        onChange([...data, {...newEducation}])
    }


    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='relative'>
            <div className='flex items-center justify-between pt-5 pb-8'>
                <div className=''>
                    <h3 className='font-semibold'>Education</h3>
                    <p className='text-sm text-gray-600'>Add your education details

                    </p>
                </div>

                <div className=''>
                    <button onClick={addEducation} className='text-purple-700 text-sm bg-purple-100 flex justify-center items-center rounded-lg p-1 px-2 gap-2 cursor-pointer'><Plus size={16} /> Add Education</button>

                </div>

                
            </div>
            {
                    data.length === 0 ? (
                        <div className='text-center py-8 text-gray-500 flex flex-col items-center'>
                            <GraduationCap size={40} className='text-gray-300' />
                            <p>No education added yet</p>
                            <p className="text-sm">Click "Add Education" to get started.</p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {data.map((education, index) => (
                                <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>

                                    <div className='flex justify-between items-start'>
                                        <h4>Education #{index + 1}</h4>
                                        <button
                                            onClick={() => removeEducation(index)}
                                            className='text-red-500 hover:text-red-700 transition-colors'
                                        >
                                            <Trash2 className='size-4' />
                                        </button>
                                    </div>

                                    <div className='grid md:grid-cols-2 gap-3'>
                                        <input
                                            type="text"
                                            value={education.institution || ''}
                                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                            placeholder="Institution Name"
                                            className='px-3 py-2 text-sm rounded-lg border border-gray-300'
                                        />

                                        <input
                                            type="text"
                                            value={education.degree || ''}
                                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                            placeholder="Degree (e.g., Bachelor's, Master's)"
                                            className='px-3 py-2 text-sm rounded-lg border border-gray-300'
                                        />

                                        <input
                                            type="text"
                                            value={education.field || ''}
                                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                                            className='px-3 py-2 text-sm rounded-lg border border-gray-300'
                                            placeholder='Field of Study'
                                        />

                                        <input
                                            type="month"
                                            value={education.graduation_date || ''}
                                            onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                                            className='px-3 py-2 text-sm rounded-lg  border border-gray-300'
                                            
                                        />
                                    </div>

                                    <input
                                            type="text"
                                            value={education.gpa || ''}
                                            onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                                            className='px-3 py-2 text-sm rounded-lg border border-gray-300'
                                            placeholder='GPA (optional)'
                                        />

                


                                </div>
                            ))}
                        </div>

                    )
                }

            

            

            

        </div>
    )
}

export default Education
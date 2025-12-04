import React, { useEffect, useState } from 'react';
import { FilePenLineIcon, Pencil, Plus, TrashIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  createResumeApi,
  getUserResumesApi,
  updateResumeTitleApi,
  deleteResumeApi,
} from '../services/resumeService.jsx';

const Dashboard = () => {
  const colors = [
    "#FF6B6B", "#F94144", "#F3722C", "#F8961E", "#F9C74F",
    "#90BE6D", "#43AA8B", "#577590", "#277DA1", "#4CC9F0",
    "#7209B7", "#B5179E", "#FF0080", "#FFAA00", "#00C49A",
    "#0088FE", "#FFBB28", "#FF4444",
  ];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showEditResume, setShowEditResume] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState(null);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const resumes = await getUserResumesApi();
      setAllResumes(resumes);
    } catch (err) {
      console.error("Error loading resumes:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadAllResumes();
  }, []);

  const createResume = async (e) => {
    e.preventDefault();
    try {
      const resume = await createResumeApi(title || "Untitled resume");

      setShowCreateResume(false);
      setTitle("");

      setAllResumes((prev) => [...prev, resume]);
      navigate(`/app/builder/${resume._id}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      alert("Failed to create resume");
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    if (!editingResumeId) return;

    try {
      const updatedResume = await updateResumeTitleApi(editingResumeId, title);

      setAllResumes((prev) =>
        prev.map((r) => (r._id === updatedResume._id ? updatedResume : r))
      );

      setShowEditResume(false);
      setEditingResumeId(null);
      setTitle("");
    } catch (err) {
      console.error("Error updating title:", err);
      alert("Failed to update title");
    }
  };

  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;

    try {
      await deleteResumeApi(resumeId);
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("Failed to delete resume");
    }
  };

  return (
    <>
      {/* Top section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
        <p className="text-2xl sm:text-3xl font-bold py-4 text-blue-600">
          Welcome, {user?.name}
        </p>

        <div className="mb-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="border h-32 w-full sm:w-48 flex flex-col justify-center items-center 
                       bg-linear-to-br from-blue-300 to-pink-200 border-gray-300 rounded 
                       hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <Plus />
            <p className="mt-1 text-sm sm:text-base">Create resume</p>
          </button>
        </div>
      </div>

      <hr className="bg-gray-300 max-w-5xl mx-auto my-5 border" />

      {/* Cards grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];

            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative border cursor-pointer h-32 sm:h-40 w-full 
                           flex flex-col justify-center items-center rounded-lg shadow-md 
                           transition hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + '40',
                }}
              >
                <FilePenLineIcon style={{ color: baseColor }} />
                <p
                  className="mt-1 text-sm text-center px-2 line-clamp-2"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p className="absolute bottom-1 text-[10px] sm:text-xs text-slate-600">
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 flex gap-2 text-slate-500 cursor-pointer"
                >
                  <Pencil
                    size={16}
                    className="hover:text-black"
                    onClick={() => {
                      setShowEditResume(true);
                      setEditingResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                  />
                  <TrashIcon
                    size={16}
                    className="hover:text-black"
                    onClick={() => deleteResume(resume._id)}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          className="fixed inset-0 z-10 bg-black/70 flex items-center justify-center px-4 cursor-pointer"
          onClick={() => { setShowCreateResume(false); setTitle(''); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-50 w-full max-w-sm p-5 rounded-lg relative"
          >
            <h2 className="text-center font-bold text-xl sm:text-2xl mb-6">
              Create Resume
            </h2>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="px-2 py-2 ring-1 rounded-lg w-full mb-5 text-sm sm:text-base"
              placeholder="Enter resume title"
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 px-6 py-2 rounded-full text-white text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => { setShowCreateResume(false); setTitle(''); }}
              size={18}
            />
          </div>
        </form>
      )}

      {/* Edit Resume Modal */}
      {showEditResume && (
        <form
          onSubmit={editTitle}
          className="fixed inset-0 z-10 bg-black/70 flex items-center justify-center px-4 cursor-pointer"
          onClick={() => { setShowEditResume(false); setEditingResumeId(null); setTitle(''); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-50 w-full max-w-sm p-5 rounded-lg relative"
          >
            <h2 className="text-center font-bold text-xl sm:text-2xl mb-6">
              Edit Resume Title
            </h2>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="px-2 py-2 ring-1 rounded-lg w-full mb-5 text-sm sm:text-base"
              placeholder="Enter resume title"
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 px-6 py-2 rounded-full text-white text-sm sm:text-base cursor-pointer"
              >
                Update
              </button>
            </div>
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => { setShowEditResume(false); setEditingResumeId(null); setTitle(''); }}
              size={18}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default Dashboard;

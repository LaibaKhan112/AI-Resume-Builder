import React, { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { enhanceJobDescriptionApi } from '../services/aiService'; // reuse job desc AI

const ProjectsForm = ({ data, onChange }) => {
  const [loadingIndex, setLoadingIndex] = useState(null); // which project is being enhanced

  const newProject = {
    name: "",
    type: "",
    description: "",
  };

  const addProject = () => {
    onChange([...(data || []), { ...newProject }]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleEnhanceDescription = async (index) => {
    const currentDescription = data[index]?.description || "";

    if (!currentDescription.trim()) return; // don’t send empty

    try {
      setLoadingIndex(index);
      const improved = await enhanceJobDescriptionApi(currentDescription);
      updateProject(index, "description", improved);
    } catch (error) {
      console.error("Error enhancing project description:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between pt-5 pb-8">
        <div>
          <h3 className="font-semibold">Projects</h3>
          <p className="text-sm text-gray-600">Add your projects</p>
        </div>

        <button
          onClick={addProject}
          className="text-purple-700 text-sm bg-purple-100 flex justify-center items-center rounded-lg p-1 px-2 gap-2 cursor-pointer"
          type="button"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {(data || []).map((project, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project #{index + 1}</h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                value={project.name || ''}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                placeholder="Project Name"
                className="px-3 py-2 text-sm rounded-lg border border-gray-300"
              />

              <input
                type="text"
                value={project.type || ''}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                placeholder="Project type (e.g., Web App)"
                className="px-3 py-2 text-sm rounded-lg border border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pt-1">
                <label className="text-sm font-medium text-gray-700">
                  Project Description
                </label>

                <button
                  type="button"
                  onClick={() => handleEnhanceDescription(index)}
                  disabled={loadingIndex === index}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  {loadingIndex === index ? "Enhancing..." : "Enhance with AI"}
                </button>
              </div>

              <textarea
                type="text"
                value={project.description || ''}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                rows={4}
                placeholder="Describe your project goals, tech stack, and impact..."
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsForm;

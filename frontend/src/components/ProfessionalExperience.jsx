import { Briefcase, Plus, Sparkles, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { enhanceJobDescriptionApi } from '../services/aiService';

const ProfessionalExperience = ({ data, onChange }) => {
  const [loadingIndex, setLoadingIndex] = useState(null); // which experience is being enhanced

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...(data || []), newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleEnhanceDescription = async (index) => {
    const currentDescription = data[index]?.description || "";

    if (!currentDescription.trim()) return; // don't send empty text

    try {
      setLoadingIndex(index);
      const improved = await enhanceJobDescriptionApi(currentDescription);
      updateExperience(index, "description", improved);
    } catch (error) {
      console.error("Error enhancing job description:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between pt-5 pb-8">
        <div>
          <h3 className="font-semibold">Professional Experience</h3>
          <p className="text-sm text-gray-600">Add your job experience</p>
        </div>

        <button
          onClick={addExperience}
          className="text-purple-700 text-sm bg-purple-100 flex justify-center items-center rounded-lg p-1 px-2 gap-2 cursor-pointer"
          type="button"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {(!data || data.length === 0) ? (
        <div className="text-center py-8 text-gray-500 flex flex-col items-center">
          <Briefcase size={40} className="text-gray-300" />
          <p>No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={experience.company || ''}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300"
                />

                <input
                  type="text"
                  value={experience.position || ''}
                  onChange={(e) => updateExperience(index, "position", e.target.value)}
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300"
                />

                <input
                  type="month"
                  value={experience.start_date || ''}
                  onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300"
                />

                <input
                  type="month"
                  value={experience.end_date || ''}
                  onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100 border border-gray-300"
                  disabled={experience.is_current}
                />
              </div>

              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) =>
                    updateExperience(index, "is_current", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Currently working here</span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between pt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description
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
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none border border-gray-300"
                  rows={4}
                  value={experience.description || ''}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalExperience;

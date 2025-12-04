import { Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import { enhanceProfessionalSummaryApi } from '../services/aiService.jsx';

const ProfessionalSummary = ({ data, onChange, activeSectionIndex, setActiveSectionIndex }) => {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    if (!data || !data.trim()) return; // optional: avoid sending empty text

    try {
      setLoading(true);
      const improved = await enhanceProfessionalSummaryApi(data);
      onChange(improved);
      console.log(improved);
      
    } catch (error) {
      console.error("Error enhancing summary:", error);
      // optional: show toast / error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between pt-5 pb-8'>
        <div>
          <h3 className='font-semibold'>Professional Summary</h3>
          <p className='text-sm text-gray-600'>Add summary for your resume here</p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleEnhance}
            disabled={loading}
            className='text-purple-700 text-sm bg-purple-100 flex justify-center items-center rounded-lg p-1 px-2 gap-2 disabled:opacity-60 cursor-pointer'
          >
            <Sparkle size={16} />
            {loading ? "Enhancing..." : "AI Enhance"}
          </button>
        </div>
      </div>

      <div>
        <textarea
          value={data || ''}
          onChange={(e) => onChange(e.target.value)}
          className='border border-gray-300 w-full p-2 text-sm rounded-lg'
          rows={7}
          placeholder='Write a compelling professional summary that highlights your key skills and career objectives...'
        />
        <p className='text-xs text-gray-600 text-center'>
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
        className='ring ring-blue-700 bg-blue-100 text-blue-600 p-2 px-3 rounded-lg mt-4 text-sm cursor-pointer'
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfessionalSummary;

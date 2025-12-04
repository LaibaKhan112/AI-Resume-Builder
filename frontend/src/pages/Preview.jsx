import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import { getPublicResumeApi } from "../services/resumeService.jsx";

const Preview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await getPublicResumeApi(resumeId);

        if (!resume) {
          setNotFound(true);
        } else {
          setResumeData(resume);
        }
      } catch (err) {
        console.error("Error loading public resume:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [resumeId]);

  if (isLoading) {
    return <Loader />;
  }

  if (notFound || !resumeData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-center text-6xl text-slate-400 font-medium">
          Resume not Found
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" /> Go to home page
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 p-7 flex justify-center">
      <div className="w-4/6 bg-white shadow">
        <ResumePreview
          data={resumeData}
          template={resumeData.template || "classic"}
          accentColor={resumeData.accent_color || "#3B82F6"}
        />
      </div>
    </div>
  );
};

export default Preview;

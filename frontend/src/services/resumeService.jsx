// src/services/resumeService.js
import api from '../api/api.js'

export const fetchResumeById = async (resumeId) => {
  const res = await api.get(`/api/resume/get/${resumeId}`);
  return res.data.resume;
};

export const updateResumeApi = async (resumeId, resumeData, removeBackground = false, imageFile) => {
  const formData = new FormData();
  formData.append("resumeId", resumeId);
  formData.append("resumeData", JSON.stringify(resumeData));
  formData.append("removeBackground", removeBackground);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await api.put("/api/resume/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.resume;
};

export const createResumeApi = async (title = "Untitled resume") => {
  const res = await api.post("/api/resume/create", { title });
  return res.data.resume;
};

export const deleteResumeApi = async (resumeId) => {
  const res = await api.delete(`/api/resume/delete/${resumeId}`);
  return res.data;
};

export const getUserResumesApi = async () => {
  const res = await api.get("/api/resume/user");
  return res.data.resumes; // [ ... ]
};

export const updateResumeTitleApi = async (resumeId, title) => {
  const formData = new FormData();
  formData.append("resumeId", resumeId);
  formData.append("resumeData", JSON.stringify({ title }));
  formData.append("removeBackground", "false");

  const res = await api.put("/api/resume/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.resume;
};

export const getPublicResumeApi = async (resumeId) => {
  const res = await api.get(`/api/resume/public/${resumeId}`);
  return res.data.resume;
}
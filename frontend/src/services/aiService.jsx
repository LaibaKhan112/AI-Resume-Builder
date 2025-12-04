import api from "../api/api.js";

export const enhanceProfessionalSummaryApi = async (text) => {
  const res = await api.post("/api/ai/enhance-pro-sum", { userContent: text });
  return res.data.enhancedContent;
};

export const enhanceJobDescriptionApi = async (text) => {
  const res = await api.post("/api/ai/enhance-job-desc", { userContent: text });
  return res.data.enhancedContent;
};
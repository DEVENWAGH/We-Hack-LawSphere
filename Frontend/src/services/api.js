import axios from "axios";

const API_URL = import.meta.env.PROD
  ? "https://api.lawsphere.org/api" // Change to your production API URL
  : "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const { token } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User API services
export const userService = {
  register: (userData) => api.post("/users/register", userData),
  login: (email, password) => api.post("/users/login", { email, password }),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  uploadProfileImage: (formData) =>
    api.post("/users/profile/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Lawyer API services
export const lawyerService = {
  getLawyers: (filters) => api.get("/lawyers", { params: filters }),
  getLawyerById: (id) => api.get(`/lawyers/${id}`),
  scheduleConsultation: (lawyerId, consultationData) =>
    api.post(`/lawyers/${lawyerId}/consultations`, consultationData),
  addReview: (lawyerId, reviewData) =>
    api.post(`/lawyers/${lawyerId}/reviews`, reviewData),
};

// Resource API services
export const resourceService = {
  getResources: (filters) => api.get("/resources", { params: filters }),
  getResourceById: (id) => api.get(`/resources/${id}`),
  getResourceCategories: () => api.get("/resources/categories"),
  incrementDownload: (id) => api.put(`/resources/${id}/download`),
};

// Community API services
export const communityService = {
  getTopics: (filters) => api.get("/community/topics", { params: filters }),
  getTopicById: (id) => api.get(`/community/topics/${id}`),
  createTopic: (topicData) => api.post("/community/topics", topicData),
  addReply: (topicId, replyData) =>
    api.post(`/community/topics/${topicId}/replies`, replyData),
  upvoteTopic: (topicId) => api.put(`/community/topics/${topicId}/upvote`),
  downvoteTopic: (topicId) => api.put(`/community/topics/${topicId}/downvote`),
  getCategories: () => api.get("/community/categories"),
};

// AI Assistant API services
export const aiService = {
  askQuestion: (question) => api.post("/ai/ask", { question }),
  getFAQs: () => api.get("/ai/faq"),
};

export default api;

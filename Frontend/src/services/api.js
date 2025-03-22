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
      try {
        const { token } = JSON.parse(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("user");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.status, error.response?.data);

    // Check for auth errors (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      console.error("Authentication error:", error.response.data);

      // If token verification failed, clear localStorage and redirect
      if (
        error.response.data.message &&
        (error.response.data.message.includes("token") ||
          error.response.data.message.includes("signature") ||
          error.response.data.message.includes("authorized"))
      ) {
        console.log("Clearing invalid authentication data");
        localStorage.removeItem("user");

        // Check if we're already on the home page to avoid infinite redirect
        if (
          window.location.pathname !== "/" &&
          !window.location.search.includes("auth=error")
        ) {
          // Add auth=error parameter to signal authentication error
          window.location.href = "/?auth=error";
        }
      }
    }
    return Promise.reject(error);
  }
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
  createLawyer: (lawyerData) => {
    console.log("Creating lawyer profile with data:", lawyerData);
    return api.post("/lawyers", lawyerData);
  },
  uploadProfileImage: (formData) => {
    console.log("Uploading profile image...");

    // Log form data for debugging
    if (formData instanceof FormData) {
      for (let pair of formData.entries()) {
        const fileInfo =
          pair[1] instanceof File
            ? `File: ${pair[1].name}, Size: ${pair[1].size}, Type: ${pair[1].type}`
            : pair[1];
        console.log(`Form data: ${pair[0]} = ${fileInfo}`);
      }
    }

    // Set the correct content type and headers for file uploads
    return api.post("/lawyers/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [
        (data, headers) => {
          // Don't convert FormData to JSON
          return data;
        },
      ],
    });
  },
  updateLawyer: (lawyerId, lawyerData) => {
    console.log("Updating lawyer profile with data:", lawyerData);
    return api.put(`/lawyers/${lawyerId}`, lawyerData);
  },
  scheduleConsultation: (lawyerId, consultationData) =>
    api.post(`/lawyers/${lawyerId}/consultations`, consultationData),
  getLawyerReviews: (lawyerId) => api.get(`/lawyers/${lawyerId}/reviews`),
  addReview: (lawyerId, reviewData) =>
    api.post(`/lawyers/${lawyerId}/reviews`, reviewData),
  // New consultation management endpoints
  getConsultations: (lawyerId) => api.get(`/lawyers/${lawyerId}/consultations`),
  updateConsultation: (consultationId, updateData) =>
    api.put(`/consultations/${consultationId}`, updateData),
  rescheduleConsultation: (consultationId, rescheduleData) =>
    api.put(`/consultations/${consultationId}/reschedule`, rescheduleData),
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

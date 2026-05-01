import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken = null;

// Interceptor to always use the latest token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log(`DEBUG: Requesting ${config.url} with token: ${authToken.slice(0, 10)}...`);
    } else {
      console.log(`DEBUG: Requesting ${config.url} WITHOUT token`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("DEBUG: 401 Unauthorized detected on", error.config.url);
      // Optional: Clear token if it's invalid
      // setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;

/**
 * Axios API client configuration.
 *
 * - Base URL is loaded from environment variables.
 * - Automatically attaches authentication headers.
 * - Handles API responses and errors globally.
 */

import axios from "axios";
import { API_URL } from "../config";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include Authorization token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

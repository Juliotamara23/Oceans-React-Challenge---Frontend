import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("Environment variable NEXT_PUBLIC_API_BASE_URL is not defined.");
  // Considera lanzar un error aquí si quieres que falle en desarrollo si la URL no está
  // throw new Error("API Base URL (NEXT_PUBLIC_API_BASE_URL) is not defined.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// HARDCODEAR TOKEN TEMPORALMENTE (1 hora de vida)
const HARDCODED_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMzY0MGUwLTZlNWItNDlmOC05MTQwLThiMmQwYzNkOWY0OCIsInVzZXJuYW1lIjoiYWRtaW51c2VyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUyMjA3NDIwLCJleHAiOjE3NTIyMjE4MjB9.AeZVLrEoyBXg1bw09Ju0ruj1IqVMGbHxmWNNbWuatxA";

api.interceptors.request.use((config) => {
  // En un entorno real, el token se obtendría del localStorage, de un Context/Redux, etc.
  // const token = localStorage.getItem('authToken');
  const token = HARDCODED_AUTH_TOKEN; // Usando token hardcodeado temporalmente

  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
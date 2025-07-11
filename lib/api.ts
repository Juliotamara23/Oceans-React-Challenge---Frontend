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

export default api;
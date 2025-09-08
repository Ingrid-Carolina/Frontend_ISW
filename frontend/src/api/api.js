import axios from "axios";

// Usa Vite env. 
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

// Si tu backend autentica con cookies/sesión, deja true.
const DEFAULT_WITH_CREDENTIALS = true;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: DEFAULT_WITH_CREDENTIALS,
  headers: { "Accept": "application/json", "Content-Type": "application/json" },
});

// Normaliza errores
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401) {
      // Evitar bucle si ya estamos en login
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("usuario"); // o lo que uses
        window.location.href = "/login";
      }
    }

    const msg =
      err?.response?.data?.mensaje ||
      err?.response?.data?.error ||
      err?.message ||
      "Request error";
    const e = new Error(msg);
    e.status = status;
    e.data = err?.response?.data;
    return Promise.reject(e);
  }
);
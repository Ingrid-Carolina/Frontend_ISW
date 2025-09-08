// src/api/api.js
import axios from "axios";

// Usa Vite env.
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

// Si tu backend autentica con cookies/sesión, deja true.
const DEFAULT_WITH_CREDENTIALS = true;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: DEFAULT_WITH_CREDENTIALS,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// --- Redirección controlada a /login en 401 (respeta skipAuthRedirect) ---
let unauthorizedInFlight = false;
function handleUnauthorizedOnce() {
  if (unauthorizedInFlight) return;
  unauthorizedInFlight = true;
  try {
    // Notifica a la app por si algún efecto escucha este evento
    window.dispatchEvent(new Event("auth:refresh"));

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  } finally {
    setTimeout(() => { unauthorizedInFlight = false; }, 1000);
  }
}

// Normaliza errores
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

   // NO redirije si la request trae skipAuthRedirect
    if (status === 401 && !err?.config?.skipAuthRedirect) {
      handleUnauthorizedOnce();
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

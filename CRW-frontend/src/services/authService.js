import api from "./api";

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("activeWorkspaceId");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("accessToken"));
}

function decodeToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return null;
  }
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getCurrentUsername() {
  return decodeToken()?.sub ?? null;
}

export function getCurrentRole() {
  return decodeToken()?.role ?? null;
}

export function isAdmin() {
  return getCurrentRole() === "ADMIN";
}

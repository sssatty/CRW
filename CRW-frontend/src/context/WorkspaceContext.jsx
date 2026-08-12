import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { isAuthenticated } from "../services/authService";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    () => localStorage.getItem("activeWorkspaceId") || null
  );
  const [loading, setLoading] = useState(true);

  const refreshWorkspaces = useCallback(async () => {
    if (!isAuthenticated()) {
      setWorkspaces([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/workspaces");
      setWorkspaces(data);
      setActiveWorkspaceId((current) => {
        const stillValid = data.some((ws) => String(ws.id) === String(current));
        const next = stillValid ? current : data[0]?.id ?? null;
        if (next) {
          localStorage.setItem("activeWorkspaceId", next);
        } else {
          localStorage.removeItem("activeWorkspaceId");
        }
        return next;
      });
    } catch (err) {
      console.error("Failed to fetch workspaces:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  const selectWorkspace = (id) => {
    setActiveWorkspaceId(id);
    localStorage.setItem("activeWorkspaceId", id);
  };

  const activeWorkspace = workspaces.find((ws) => String(ws.id) === String(activeWorkspaceId)) ?? null;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        selectWorkspace,
        refreshWorkspaces,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

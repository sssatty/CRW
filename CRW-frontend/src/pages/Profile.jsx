import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";
import { getCurrentUsername, getCurrentRole } from "../services/authService";

function Profile() {
  const { workspaces, activeWorkspace } = useWorkspace();
  const [profile, setProfile] = useState(null);
  const [taskStats, setTaskStats] = useState({ assigned: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let userData = null;
      try {
        const { data } = await api.get("/users/me");
        userData = data;
      } catch (err) {
        console.warn("Could not fetch /users/me from backend, using token fallback:", err);
        const tokenUsername = getCurrentUsername();
        const tokenRole = getCurrentRole();
        if (tokenUsername) {
          userData = {
            id: "-",
            username: tokenUsername,
            email: tokenUsername.includes("@") ? tokenUsername : `${tokenUsername}@crw.local`,
            role: tokenRole || "RESEARCHER",
          };
        } else {
          throw err;
        }
      }

      setProfile(userData);

      if (activeWorkspace?.id) {
        try {
          const { data: tasks } = await api.get(`/tasks/workspace/${activeWorkspace.id}`);
          const assignedTasks = tasks.filter(
            (t) =>
              (userData.id && t.assigneeId === userData.id) ||
              (userData.username && t.assigneeUsername === userData.username)
          );
          const completed = assignedTasks.filter((t) => t.status === "COMPLETED").length;
          setTaskStats({
            assigned: assignedTasks.length,
            completed,
            pending: assignedTasks.length - completed,
          });
        } catch (taskErr) {
          console.error("Failed to load task statistics:", taskErr);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user profile. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <div className="page-loading">Loading profile...</div>;
  }

  const initials = profile?.username
    ? profile.username.substring(0, 2).toUpperCase()
    : "U";

  const completionRate =
    taskStats.assigned > 0
      ? Math.round((taskStats.completed / taskStats.assigned) * 100)
      : 0;

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="workspace-header">
          <div>
            <h1>User Profile & Identity</h1>
            <p className="muted">Manage your identity, role permissions, and workspace contributions.</p>
          </div>
          {error && (
            <button type="button" className="btn btn-ghost" onClick={loadData}>
              🔄 Retry Connection
            </button>
          )}
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {profile && (
          <div className="profile-container">
            <section className="panel profile-header-card">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-info">
                <h2>{profile.username}</h2>
                <p className="muted">{profile.email}</p>
                <div className="profile-meta-tags">
                  <span className={`badge badge-role-${profile.role?.toLowerCase()}`}>
                    {profile.role}
                  </span>
                  <span className="muted small">User ID: #{profile.id}</span>
                  <span className="chip">Status: Active</span>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{workspaces.length}</span>
                <span className="stat-label">Joined Workspaces</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{activeWorkspace ? activeWorkspace.name : "None"}</span>
                <span className="stat-label">Active Workspace</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{taskStats.assigned}</span>
                <span className="stat-label">Assigned Tasks</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{taskStats.completed}</span>
                <span className="stat-label">Completed Tasks ({completionRate}%)</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{taskStats.pending}</span>
                <span className="stat-label">Pending Tasks</span>
              </div>
            </section>

            <section className="panel">
              <h2>Account & Security Information</h2>
              <div className="profile-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Authentication Method</span>
                  <span className="detail-value">Stateless JWT Bearer Token</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Authority Level</span>
                  <span className="detail-value">
                    {profile.role === "ADMIN"
                      ? "Administrator (Full Workspace & Member Control)"
                      : "Researcher (Standard Workspace Access)"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Active Session</span>
                  <span className="detail-value">Authenticated</span>
                </div>
              </div>
            </section>

            <section className="panel">
              <h2>My Workspaces ({workspaces.length})</h2>
              {workspaces.length === 0 ? (
                <p className="muted small">You are not a member of any workspace yet.</p>
              ) : (
                <ul className="list">
                  {workspaces.map((ws) => {
                    const isActive = ws.id === activeWorkspace?.id;
                    return (
                      <li key={ws.id} className="list-row">
                        <div>
                          <div className="list-title">
                            {ws.name}{" "}
                            {isActive && (
                              <span className="badge badge-completed ml-2">Active Workspace</span>
                            )}
                          </div>
                          {ws.description && (
                            <div className="muted small">{ws.description}</div>
                          )}
                        </div>
                        <div className="flex-center gap-2">
                          <span className="chip">
                            {ws.members ? ws.members.length : 0} Members
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}

export default Profile;

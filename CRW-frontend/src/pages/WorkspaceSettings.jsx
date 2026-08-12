import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { isAdmin } from "../services/authService";
import { useWorkspace } from "../context/WorkspaceContext";

function WorkspaceSettings() {
  const { activeWorkspace, activeWorkspaceId, refreshWorkspaces, loading } = useWorkspace();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const admin = isAdmin();

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/workspaces/${activeWorkspaceId}/members`, { userId: Number(userId) });
      setUserId("");
      await refreshWorkspaces();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setError("");
    try {
      await api.delete(`/workspaces/${activeWorkspaceId}/members/${memberId}`);
      await refreshWorkspaces();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member.");
    }
  };

  if (loading) {
    return <div className="page-loading">Loading workspace settings...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Workspace Settings</h1>

        {!activeWorkspace ? (
          <p className="muted">No active workspace selected.</p>
        ) : (
          <>
            <p className="muted">Managing members for: {activeWorkspace.name}</p>

            <section className="panel">
              <h2>Members</h2>
              <ul className="list">
                {activeWorkspace.members?.map((member) => (
                  <li key={member.id} className="list-row">
                    <span className="list-title">{member.username}</span>
                    {admin && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-danger small"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h2>Add Member</h2>
              {admin ? (
                <>
                  {error && <div className="alert alert-error">{error}</div>}
                  <form className="inline-form" onSubmit={handleAddMember}>
                    <input
                      type="number"
                      placeholder="User ID"
                      value={userId}
                      onChange={(event) => setUserId(event.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Adding..." : "Add Member"}
                    </button>
                  </form>
                </>
              ) : (
                <p className="muted small">Only workspace admins can add members.</p>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default WorkspaceSettings;

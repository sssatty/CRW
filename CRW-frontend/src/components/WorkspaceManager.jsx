import { useState } from "react";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";

function WorkspaceManager() {
  const { workspaces, activeWorkspaceId, selectWorkspace, refreshWorkspaces, loading } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setCreating(true);
    try {
      const { data } = await api.post("/workspaces", { name, description });
      setName("");
      setDescription("");
      await refreshWorkspaces();
      selectWorkspace(data.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create workspace.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="panel workspace-manager">
      <h2>Workspaces</h2>

      {loading ? (
        <p className="muted small">Loading workspaces...</p>
      ) : workspaces.length === 0 ? (
        <p className="muted small">You are not a member of any workspace yet.</p>
      ) : (
        <label className="workspace-select">
          Active workspace
          <select
            value={activeWorkspaceId ?? ""}
            onChange={(event) => selectWorkspace(event.target.value)}
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <form className="inline-form" onSubmit={handleCreate}>
        {error && <div className="alert alert-error">{error}</div>}
        <input
          type="text"
          placeholder="New workspace name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </section>
  );
}

export default WorkspaceManager;

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";

function ManuscriptForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [targetJournal, setTargetJournal] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onCreate({ title, targetJournal });
      setTitle("");
      setTargetJournal("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create manuscript.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="entry-form-grid">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Target Journal
          <input
            type="text"
            value={targetJournal}
            onChange={(event) => setTargetJournal(event.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Creating..." : "Create Manuscript"}
      </button>
    </form>
  );
}

function VersionForm({ onAdd }) {
  const [content, setContent] = useState("");
  const [versionTag, setVersionTag] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onAdd({ content, versionTag, commitMessage });
      setContent("");
      setVersionTag("");
      setCommitMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save version.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="entry-form version-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="entry-form-grid">
        <label>
          Version Tag
          <input
            type="text"
            placeholder="v1.0"
            value={versionTag}
            onChange={(event) => setVersionTag(event.target.value)}
            required
          />
        </label>
        <label>
          Commit Message
          <input
            type="text"
            value={commitMessage}
            onChange={(event) => setCommitMessage(event.target.value)}
          />
        </label>
      </div>
      <label>
        Content (Markdown)
        <textarea
          rows={6}
          className="markdown-input"
          placeholder="# Section title&#10;&#10;Write your draft here using Markdown..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : "Save New Version"}
      </button>
    </form>
  );
}

function VersionItem({ version }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="version-item">
      <div className="list-row">
        <div>
          <div className="list-title">
            {version.versionTag} &mdash; {version.commitMessage}
          </div>
          <div className="muted small">
            {version.authorUsername} &middot; {new Date(version.createdAt).toLocaleString()}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-ghost accordion-toggle"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Hide" : "View"} Content
        </button>
      </div>
      {expanded && (
        <div className="markdown-preview">
          <ReactMarkdown>{version.content}</ReactMarkdown>
        </div>
      )}
    </li>
  );
}

function Manuscript() {
  const { activeWorkspaceId, loading: workspaceLoading } = useWorkspace();
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadManuscripts() {
      if (!activeWorkspaceId) {
        setManuscripts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await api.get(`/manuscripts/workspace/${activeWorkspaceId}`);
      setManuscripts(data);
      setLoading(false);
    }
    loadManuscripts();
  }, [activeWorkspaceId]);

  const handleCreate = async (payload) => {
    const { data } = await api.post("/manuscripts", {
      ...payload,
      workspaceId: activeWorkspaceId,
    });
    setManuscripts((prev) => [...prev, data]);
  };

  const handleAddVersion = async (manuscriptId, payload) => {
    const { data } = await api.post(`/manuscripts/${manuscriptId}/versions`, payload);
    setManuscripts((prev) => prev.map((m) => (m.id === manuscriptId ? data : m)));
  };

  if (workspaceLoading || loading) {
    return <div className="page-loading">Loading manuscripts...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Manuscript Development</h1>
        <p className="muted">Draft, version, and track academic manuscripts in progress.</p>

        {!activeWorkspaceId ? (
          <p className="muted small">Select a workspace on the Dashboard to see its manuscripts.</p>
        ) : (
          <>
            <section className="panel">
              <h2>New Manuscript</h2>
              <ManuscriptForm onCreate={handleCreate} />
            </section>

            <div className="manuscript-list">
              {manuscripts.map((manuscript) => (
                <article key={manuscript.id} className="panel">
                  <div className="manuscript-header">
                    <div>
                      <h2>{manuscript.title}</h2>
                      <p className="muted small">Target: {manuscript.targetJournal}</p>
                    </div>
                    <span className={`badge badge-${manuscript.status.toLowerCase()}`}>
                      {manuscript.status}
                    </span>
                  </div>

                  <h4>Version History</h4>
                  {manuscript.versions.length === 0 ? (
                    <p className="muted small">No versions yet.</p>
                  ) : (
                    <ul className="list">
                      {manuscript.versions.map((version) => (
                        <VersionItem key={version.id} version={version} />
                      ))}
                    </ul>
                  )}

                  <h4>Draft New Version</h4>
                  <VersionForm onAdd={(payload) => handleAddVersion(manuscript.id, payload)} />
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Manuscript;

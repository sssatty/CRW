import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";

function LiteratureForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onCreate({
        title,
        authors,
        publicationYear: publicationYear ? Number(publicationYear) : null,
        doi,
        url,
        summary,
      });
      setTitle("");
      setAuthors("");
      setPublicationYear("");
      setDoi("");
      setUrl("");
      setSummary("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add literature entry.");
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
          Authors
          <input
            type="text"
            value={authors}
            onChange={(event) => setAuthors(event.target.value)}
          />
        </label>
        <label>
          Publication Year
          <input
            type="number"
            value={publicationYear}
            onChange={(event) => setPublicationYear(event.target.value)}
          />
        </label>
        <label>
          DOI
          <input type="text" value={doi} onChange={(event) => setDoi(event.target.value)} />
        </label>
        <label>
          URL
          <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
      </div>
      <label>
        Summary
        <textarea
          rows={2}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Adding..." : "Add Literature"}
      </button>
    </form>
  );
}

function AnnotationForm({ onAdd }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onAdd(content);
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add annotation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inline-form annotation-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <input
        type="text"
        placeholder="Add an annotation..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

function Literature() {
  const { activeWorkspaceId, loading: workspaceLoading } = useWorkspace();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  useEffect(() => {
    async function loadLiterature() {
      if (!activeWorkspaceId) {
        setEntries([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await api.get(`/literature/workspace/${activeWorkspaceId}`);
      setEntries(data);
      setLoading(false);
    }
    loadLiterature();
  }, [activeWorkspaceId]);

  const handleCreate = async (payload) => {
    const { data } = await api.post("/literature", { ...payload, workspaceId: activeWorkspaceId });
    setEntries((prev) => [...prev, data]);
  };

  const handleAddAnnotation = async (paperId, content) => {
    const { data } = await api.post(`/literature/${paperId}/annotations`, { content });
    setEntries((prev) => prev.map((paper) => (paper.id === paperId ? data : paper)));
  };

  const toggleExpanded = (paperId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(paperId)) {
        next.delete(paperId);
      } else {
        next.add(paperId);
      }
      return next;
    });
  };

  if (workspaceLoading || loading) {
    return <div className="page-loading">Loading literature...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Literature Repository</h1>
        <p className="muted">
          Collaborative annotations on papers relevant to this research workspace.
        </p>

        {!activeWorkspaceId ? (
          <p className="muted small">Select a workspace on the Dashboard to see its literature.</p>
        ) : (
          <>
            <section className="panel">
              <h2>New Literature Entry</h2>
              <LiteratureForm onCreate={handleCreate} />
            </section>

            <div className="lit-grid">
              {entries.map((paper) => {
                const expanded = expandedIds.has(paper.id);
                return (
                  <article key={paper.id} className="lit-card">
                    <h3>{paper.title}</h3>
                    <p className="muted small">
                      {paper.authors} &middot; {paper.publicationYear}
                    </p>
                    <p>{paper.summary}</p>
                    <a className="link" href={paper.url} target="_blank" rel="noreferrer">
                      {paper.doi}
                    </a>

                    <button
                      type="button"
                      className="btn btn-ghost accordion-toggle"
                      onClick={() => toggleExpanded(paper.id)}
                    >
                      {expanded ? "Hide" : "Show"} Annotations ({paper.annotations.length})
                    </button>

                    {expanded && (
                      <div className="annotations">
                        <ul className="list">
                          {paper.annotations.map((annotation) => (
                            <li key={annotation.id} className="annotation">
                              <span className="annotation-author">
                                {annotation.authorUsername}
                              </span>
                              <p>{annotation.content}</p>
                            </li>
                          ))}
                        </ul>
                        <AnnotationForm
                          onAdd={(content) => handleAddAnnotation(paper.id, content)}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Literature;

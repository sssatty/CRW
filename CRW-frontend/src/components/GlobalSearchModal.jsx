import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";

function GlobalSearchModal({ isOpen, onClose }) {
  const { activeWorkspaceId, activeWorkspace } = useWorkspace();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || !activeWorkspaceId) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [tasksRes, litRes, manuRes, meetRes] = await Promise.all([
          api.get(`/tasks/workspace/${activeWorkspaceId}`),
          api.get(`/literature/workspace/${activeWorkspaceId}`),
          api.get(`/manuscripts/workspace/${activeWorkspaceId}`),
          api.get(`/meetings/workspace/${activeWorkspaceId}`),
        ]);

        const q = query.toLowerCase();
        const matches = [];

        // Tasks
        tasksRes.data.forEach((t) => {
          if (
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
          ) {
            matches.push({
              type: "Task",
              title: t.title,
              snippet: t.description || `Status: ${t.status}`,
              link: "/tasks",
            });
          }
        });

        // Literature
        litRes.data.forEach((l) => {
          if (
            l.title?.toLowerCase().includes(q) ||
            l.authors?.toLowerCase().includes(q) ||
            l.summary?.toLowerCase().includes(q)
          ) {
            matches.push({
              type: "Literature",
              title: l.title,
              snippet: l.authors ? `Authors: ${l.authors}` : l.summary,
              link: "/literature",
            });
          }
        });

        // Manuscripts
        manuRes.data.forEach((m) => {
          if (
            m.title?.toLowerCase().includes(q) ||
            m.targetJournal?.toLowerCase().includes(q)
          ) {
            matches.push({
              type: "Manuscript",
              title: m.title,
              snippet: m.targetJournal ? `Journal: ${m.targetJournal}` : `Status: ${m.status}`,
              link: "/manuscripts",
            });
          }
        });

        // Meetings
        meetRes.data.forEach((mt) => {
          if (
            mt.title?.toLowerCase().includes(q) ||
            mt.minutes?.toLowerCase().includes(q) ||
            mt.keyDecisions?.toLowerCase().includes(q)
          ) {
            matches.push({
              type: "Meeting",
              title: mt.title,
              snippet: mt.keyDecisions || mt.minutes,
              link: "/meetings",
            });
          }
        });

        setResults(matches);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, activeWorkspaceId]);

  if (!isOpen) return null;

  const handleSelectResult = (link) => {
    onClose();
    navigate(link);
  };

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder={`Search ${activeWorkspace ? activeWorkspace.name : "workspace"}... (e.g. paper, task, meeting)`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="search-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="search-modal-body">
          {!query.trim() ? (
            <p className="muted small text-center p-4">Type to search tasks, literature, manuscripts, and meetings.</p>
          ) : loading ? (
            <p className="muted small text-center p-4">Searching workspace...</p>
          ) : results.length === 0 ? (
            <p className="muted small text-center p-4">No results found for "{query}".</p>
          ) : (
            <ul className="search-results-list">
              {results.map((res, idx) => (
                <li
                  key={idx}
                  className="search-result-item"
                  onClick={() => handleSelectResult(res.link)}
                >
                  <div className="search-result-content">
                    <span className={`badge badge-search-${res.type.toLowerCase()}`}>
                      {res.type}
                    </span>
                    <span className="search-result-title">{res.title}</span>
                  </div>
                  {res.snippet && (
                    <p className="muted small search-result-snippet">{res.snippet}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchModal;

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";

function MeetingForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [minutes, setMinutes] = useState("");
  const [keyDecisions, setKeyDecisions] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onCreate({
        title,
        meetingDate: meetingDate ? `${meetingDate}:00` : null,
        minutes,
        keyDecisions,
      });
      setTitle("");
      setMeetingDate("");
      setMinutes("");
      setKeyDecisions("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log meeting.");
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
          Date
          <input
            type="datetime-local"
            value={meetingDate}
            onChange={(event) => setMeetingDate(event.target.value)}
          />
        </label>
      </div>
      <label>
        Minutes (Markdown)
        <textarea
          rows={6}
          className="markdown-input"
          placeholder="## Agenda&#10;&#10;- Discuss..."
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
        />
      </label>
      <label>
        Key Decisions
        <textarea
          rows={2}
          value={keyDecisions}
          onChange={(event) => setKeyDecisions(event.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Logging..." : "Log Meeting"}
      </button>
    </form>
  );
}

function Meetings() {
  const { activeWorkspaceId, loading: workspaceLoading } = useWorkspace();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetings() {
      if (!activeWorkspaceId) {
        setMeetings([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await api.get(`/meetings/workspace/${activeWorkspaceId}`);
      setMeetings(data);
      setLoading(false);
    }
    loadMeetings();
  }, [activeWorkspaceId]);

  const handleCreate = async (payload) => {
    const { data } = await api.post("/meetings", { ...payload, workspaceId: activeWorkspaceId });
    setMeetings((prev) => [...prev, data]);
  };

  if (workspaceLoading || loading) {
    return <div className="page-loading">Loading meetings...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Meeting Coordination</h1>
        <p className="muted">Log minutes, key decisions, and action items from team meetings.</p>

        {!activeWorkspaceId ? (
          <p className="muted small">Select a workspace on the Dashboard to see its meetings.</p>
        ) : (
          <>
            <section className="panel">
              <h2>Log New Meeting</h2>
              <MeetingForm onCreate={handleCreate} />
            </section>

            {meetings.length === 0 ? (
              <p className="muted small">No meetings logged yet.</p>
            ) : (
              <div className="meeting-list">
                {meetings.map((meeting) => (
                  <article key={meeting.id} className="panel">
                    <div className="manuscript-header">
                      <div>
                        <h2>{meeting.title}</h2>
                        {meeting.meetingDate && (
                          <p className="muted small">
                            {new Date(meeting.meetingDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {meeting.minutes && (
                      <>
                        <h4>Minutes</h4>
                        <div className="markdown-preview">
                          <ReactMarkdown>{meeting.minutes}</ReactMarkdown>
                        </div>
                      </>
                    )}

                    {meeting.keyDecisions && (
                      <>
                        <h4>Key Decisions</h4>
                        <p>{meeting.keyDecisions}</p>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Meetings;

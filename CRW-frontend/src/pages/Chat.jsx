import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";
import { getCurrentUsername, isAdmin } from "../services/authService";

function Chat() {
  const { activeWorkspace, activeWorkspaceId, loading: workspaceLoading } = useWorkspace();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const currentUsername = getCurrentUsername();
  const userIsAdmin = isAdmin();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = useCallback(
    async (isInitial = false) => {
      if (!activeWorkspaceId) {
        setMessages([]);
        setLoading(false);
        return;
      }
      if (isInitial) setLoading(true);
      try {
        const { data } = await api.get(`/chat/workspace/${activeWorkspaceId}`);
        setMessages(data);
        setError("");
      } catch (err) {
        if (isInitial) {
          setError(err.response?.data?.message || "Failed to load chat messages.");
        }
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [activeWorkspaceId]
  );

  useEffect(() => {
    loadMessages(true);
    const interval = setInterval(() => {
      loadMessages(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending || !activeWorkspaceId) return;

    setSending(true);
    setError("");
    try {
      const { data } = await api.post("/chat/messages", {
        workspaceId: activeWorkspaceId,
        content: content.trim(),
      });
      setMessages((prev) => [...prev, data]);
      setContent("");
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await api.delete(`/chat/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete message.");
    }
  };

  if (workspaceLoading) {
    return <div className="page-loading">Loading workspace chat...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="workspace-header">
          <div>
            <h1>Workspace Discussion</h1>
            <p className="muted">
              Secure, workspace-isolated chat channel for {activeWorkspace ? activeWorkspace.name : "your workspace"}.
            </p>
          </div>
          {activeWorkspace && (
            <div className="chip">
              🔒 Private Channel ({activeWorkspace.members?.length || 0} Members)
            </div>
          )}
        </div>

        {!activeWorkspaceId ? (
          <div className="panel text-center">
            <p className="muted">Please select a workspace on the Dashboard to access its chat room.</p>
          </div>
        ) : (
          <div className="panel chat-panel">
            {error && <div className="alert alert-error mb-4">{error}</div>}

            <div className="chat-messages-box">
              {loading ? (
                <p className="muted small text-center p-4">Loading conversation...</p>
              ) : messages.length === 0 ? (
                <div className="chat-empty-state">
                  <span className="chat-empty-icon">💬</span>
                  <p className="muted">No messages yet in <strong>{activeWorkspace.name}</strong>.</p>
                  <p className="muted small">Start the conversation with your team!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelf = msg.senderUsername === currentUsername;
                  const initials = msg.senderUsername
                    ? msg.senderUsername.substring(0, 2).toUpperCase()
                    : "U";
                  const formattedTime = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  const canDelete = isSelf || userIsAdmin;

                  return (
                    <div
                      key={msg.id}
                      className={`chat-message-row ${isSelf ? "chat-message-self" : ""}`}
                    >
                      <div className="chat-avatar">{initials}</div>
                      <div className="chat-bubble-container">
                        <div className="chat-sender-header">
                          <span className="chat-sender-name">{msg.senderUsername}</span>
                          {msg.senderRole && (
                            <span className={`badge badge-role-${msg.senderRole.toLowerCase()} small`}>
                              {msg.senderRole}
                            </span>
                          )}
                          <span className="chat-timestamp">{formattedTime}</span>
                        </div>
                        <div className="chat-bubble">
                          <p>{msg.content}</p>
                        </div>
                        {canDelete && (
                          <button
                            type="button"
                            className="chat-delete-btn"
                            onClick={() => handleDelete(msg.id)}
                            title="Delete Message"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
              <textarea
                className="chat-textarea"
                rows={1}
                placeholder={`Message ${activeWorkspace ? activeWorkspace.name : "channel"}... (Enter to send, Shift+Enter for new line)`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className="btn btn-primary chat-send-btn"
                disabled={sending || !content.trim()}
              >
                {sending ? "Sending..." : "Send ➔"}
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}

export default Chat;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import WorkspaceManager from "../components/WorkspaceManager";
import api from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";

function Dashboard() {
  const { activeWorkspace, activeWorkspaceId, loading: workspaceLoading } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const [literatureCount, setLiteratureCount] = useState(0);
  const [manuscriptCount, setManuscriptCount] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      if (!activeWorkspaceId) {
        setTasks([]);
        setLiteratureCount(0);
        setManuscriptCount(0);
        setMeetings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [tasksRes, literatureRes, manuscriptsRes, meetingsRes] = await Promise.all([
          api.get(`/tasks/workspace/${activeWorkspaceId}`),
          api.get(`/literature/workspace/${activeWorkspaceId}`),
          api.get(`/manuscripts/workspace/${activeWorkspaceId}`),
          api.get(`/meetings/workspace/${activeWorkspaceId}`),
        ]);
        setTasks(tasksRes.data || []);
        setLiteratureCount(literatureRes.data?.length || 0);
        setManuscriptCount(manuscriptsRes.data?.length || 0);
        setMeetings(meetingsRes.data || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load some workspace data. Please check connection.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [activeWorkspaceId]);

  if (workspaceLoading) {
    return <div className="page-loading">Opening research workspace...</div>;
  }

  if (!activeWorkspace) {
    return (
      <>
        <Navbar />
        <main className="page">
          <WorkspaceManager />
          <div className="panel text-center mt-4">
            <h2>Select or Create a Research Workspace</h2>
            <p className="muted">Use the workspace manager above to select an active workspace.</p>
          </div>
        </main>
      </>
    );
  }

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "COMPLETED") return false;
    return new Date(t.dueDate) < now;
  });

  const dueSoonTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "COMPLETED") return false;
    const due = new Date(t.dueDate);
    return due >= now && due <= threeDaysFromNow;
  });

  return (
    <>
      <Navbar />
      <main className="page">
        <WorkspaceManager />

        <section className="workspace-header">
          <div>
            <h1>{activeWorkspace.name}</h1>
            <p className="muted">{activeWorkspace.description || "Centralized Research Workspace"}</p>
          </div>
          <div className="flex-center gap-2">
            <Link to="/tasks" className="btn btn-ghost">
              📝 Tasks ({tasks.length})
            </Link>
            <Link to="/chat" className="btn btn-primary">
              💬 Team Chat
            </Link>
          </div>
        </section>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {loading ? (
          <div className="page-loading">Reading workspace archives...</div>
        ) : (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{tasks.length}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{statusCounts.IN_PROGRESS || 0}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{literatureCount}</span>
                <span className="stat-label">Literature Papers</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{manuscriptCount}</span>
                <span className="stat-label">Draft Manuscripts</span>
              </div>
            </section>

            <div className="dashboard-grid">
              {/* Left Column (2/3 width) — Priority Deadlines & Active Tasks */}
              <div className="dashboard-main-col">
                <section className="panel">
                  <h2>Priority Deadlines & Overdue Items</h2>
                  {overdueTasks.length === 0 && dueSoonTasks.length === 0 ? (
                    <p className="muted small">No items due in the next 3 days. All tasks on schedule.</p>
                  ) : (
                    <ul className="list">
                      {overdueTasks.map((task) => (
                        <li key={task.id} className="list-row">
                          <div>
                            <div className="list-title">{task.title}</div>
                            <div className="muted small">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="badge badge-overdue">Overdue</span>
                        </li>
                      ))}
                      {dueSoonTasks.map((task) => (
                        <li key={task.id} className="list-row">
                          <div>
                            <div className="list-title">{task.title}</div>
                            <div className="muted small">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="badge badge-due_soon">Due Soon</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="panel">
                  <div className="flex-between flex-center mb-4">
                    <h2>Active Workspace Tasks</h2>
                    <Link to="/tasks" className="muted small">
                      View Kanban Board ➔
                    </Link>
                  </div>
                  {tasks.length === 0 ? (
                    <p className="muted small">No tasks created yet. Click Tasks above to add one.</p>
                  ) : (
                    <ul className="list">
                      {tasks.slice(0, 5).map((task) => (
                        <li key={task.id} className="list-row">
                          <div>
                            <div className="list-title">{task.title}</div>
                            {task.dueDate && (
                              <div className="muted small">
                                Due {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <span className={`badge badge-${task.status.toLowerCase()}`}>
                            {task.status.replace("_", " ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              {/* Right Column (1/3 width) — Workspace Members & Recent Meetings */}
              <div className="dashboard-sidebar-col">
                <section className="panel">
                  <h2>Team Members</h2>
                  {activeWorkspace.members?.length === 0 ? (
                    <p className="muted small">No members listed.</p>
                  ) : (
                    <ul className="list">
                      {activeWorkspace.members?.map((member) => (
                        <li key={member.id} className="list-row">
                          <div className="flex-center gap-2">
                            <span className="chat-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                              {member.username.substring(0, 2).toUpperCase()}
                            </span>
                            <span className="list-title" style={{ fontSize: 14 }}>
                              {member.username}
                            </span>
                          </div>
                          <span className="chip" style={{ padding: "2px 8px", fontSize: 11 }}>
                            Member
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="panel">
                  <div className="flex-between flex-center mb-4">
                    <h2>Recent Meetings</h2>
                    <Link to="/meetings" className="muted small">
                      All Meetings ➔
                    </Link>
                  </div>
                  {meetings.length === 0 ? (
                    <p className="muted small">No meetings logged yet.</p>
                  ) : (
                    <ul className="list">
                      {meetings.slice(0, 4).map((meeting) => (
                        <li key={meeting.id} className="list-row">
                          <div>
                            <div className="list-title" style={{ fontSize: 14 }}>
                              {meeting.title}
                            </div>
                            <div className="muted small">
                              {new Date(meeting.meetingDate).toLocaleDateString()}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Dashboard;

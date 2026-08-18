import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useWorkspace } from "../context/WorkspaceContext";
import GlobalSearchModal from "./GlobalSearchModal";

function Navbar() {
  const navigate = useNavigate();
  const { activeWorkspace, refreshWorkspaces } = useWorkspace();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    refreshWorkspaces();
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="navbar-brand">
          CRW
        </NavLink>
        {activeWorkspace && (
          <div className="navbar-workspace" title={activeWorkspace.name}>
            {activeWorkspace.name}
          </div>
        )}
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
            Tasks
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => (isActive ? "active" : "")}>
            Chat
          </NavLink>
          <NavLink to="/literature" className={({ isActive }) => (isActive ? "active" : "")}>
            Literature
          </NavLink>
          <NavLink to="/manuscripts" className={({ isActive }) => (isActive ? "active" : "")}>
            Manuscripts
          </NavLink>
          <NavLink to="/meetings" className={({ isActive }) => (isActive ? "active" : "")}>
            Meetings
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            Settings
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
            Profile
          </NavLink>
        </nav>
        <button
          type="button"
          className="btn btn-ghost search-trigger-btn"
          onClick={() => setSearchOpen(true)}
          title="Global Search (Cmd/Ctrl+K)"
        >
          🔍 Search <kbd className="shortcut-kbd">⌘K</kbd>
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Navbar;

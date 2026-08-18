import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Literature from "./pages/Literature";
import Manuscript from "./pages/Manuscript";
import Meetings from "./pages/Meetings";
import WorkspaceSettings from "./pages/WorkspaceSettings";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/literature"
            element={
              <ProtectedRoute>
                <Literature />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manuscripts"
            element={
              <ProtectedRoute>
                <Manuscript />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <WorkspaceSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </WorkspaceProvider>
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useWorkspace } from "../context/WorkspaceContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshWorkspaces } = useWorkspace();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      await refreshWorkspaces();
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <h1>Centralized Research Workspace</h1>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn-primary">
          Sign In
        </button>

        <p className="auth-subtitle">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

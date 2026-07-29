import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RESEARCHER");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    try {
      await api.post("/auth/register", { username, email, password, role });
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data?.fieldErrors) {
        setFieldErrors(data.fieldErrors);
      }
      setError(data?.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join the Centralized Research Workspace</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </label>

        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="RESEARCHER">RESEARCHER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {fieldErrors.role && <span className="field-error">{fieldErrors.role}</span>}
        </label>

        <button type="submit" className="btn btn-primary">
          Register
        </button>

        <p className="auth-subtitle">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

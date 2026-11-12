import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      if (loggedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setForm({ email: "admin@elecstore.com", password: "admin123" });
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow--1" />
      <div className="auth-glow auth-glow--2" />

      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo"><MdElectricBolt /> ElecStore</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue shopping</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <FaEnvelope className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <FaLock className="auth-input-icon" />
              <input
                type={showPass ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`auth-submit ${loading ? "auth-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : <><FaArrowRight /> Sign In</>}
          </button>
        </form>

        <div style={{ marginTop: "16px", padding: "12px", background: "rgba(124, 58, 237, 0.08)", border: "1px dashed rgba(168, 85, 247, 0.3)", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "var(--nv-muted, #94a3b8)", marginBottom: "6px" }}>
            🔑 Administrator Demo Access
          </div>
          <button
            type="button"
            onClick={fillAdmin}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)"
            }}
          >
            ⚡ Auto-Fill Admin Credentials
          </button>
          <div style={{ fontSize: "11px", color: "var(--nv-muted, #94a3b8)", marginTop: "4px" }}>
            admin@elecstore.com • admin123
          </div>
        </div>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}

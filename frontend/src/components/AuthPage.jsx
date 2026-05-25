import { BarChart3, CheckCircle2, FolderKanban, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react";

function AuthPage({ error, loading, onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (mode === "login") {
      await onLogin(email, password);
      return;
    }
    await onRegister(name, email, password);
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <div className="brand auth-brand">
            <div className="brand-mark">
              <FolderKanban size={22} />
            </div>
            <div>
              <strong>TaskFlow PM</strong>
              <span>Assessment frontend</span>
            </div>
          </div>
          <h1>Manage projects, tasks, ownership, and delivery health in one workspace.</h1>
          <div className="auth-metrics">
            <span><CheckCircle2 size={16} /> Protected routes</span>
            <span><BarChart3 size={16} /> Dashboard stats</span>
            <span><UsersRound size={16} /> Assignment filters</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="segmented-control" role="tablist" aria-label="Authentication mode">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
          </div>
          {mode === "register" && (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            <ShieldCheck size={18} />
            {loading ? "Please wait" : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthPage;

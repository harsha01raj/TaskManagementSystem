import { ClipboardList, FolderKanban, LayoutDashboard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import NavButton from "./NavButton.jsx";

const titles = {
  dashboard: "Dashboard",
  projects: "Project Management",
  tasks: "Task Management"
};

function AppShell({ currentUser, screen, children, onScreenChange, onLogout }) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark">
            <FolderKanban size={22} />
          </div>
          <div>
            <strong>TaskFlow PM</strong>
            <span>PERN management UI</span>
          </div>
        </div>

        <nav className="nav-stack">
          <NavButton icon={<LayoutDashboard size={18} />} label="Dashboard" active={screen === "dashboard"} onClick={() => onScreenChange("dashboard")} />
          <NavButton icon={<FolderKanban size={18} />} label="Projects" active={screen === "projects"} onClick={() => onScreenChange("projects")} />
          <NavButton icon={<ClipboardList size={18} />} label="Tasks" active={screen === "tasks"} onClick={() => onScreenChange("tasks")} />
        </nav>

        <div className="profile-card">
          <div className="avatar">
            <UserRound size={18} />
          </div>
          <div>
            <strong>{currentUser.name}</strong>
            <span>{currentUser.email}</span>
          </div>
          <button className="icon-button" aria-label="Log out" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Protected workspace</p>
            <h1>{titles[screen]}</h1>
          </div>
          <div className="secure-pill">
            <ShieldCheck size={16} />
            Authenticated
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default AppShell;

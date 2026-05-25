import { BarChart3, CheckCircle2, ClipboardList, FolderKanban } from "lucide-react";
import StatCard from "../components/StatCard.jsx";

function Dashboard({ projects, tasks, users }) {
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.length - completedTasks;
  const activeProjects = projects.length;
  const statusCounts = ["To-Do", "In Progress", "Completed"].map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length
  }));
  const maxCount = Math.max(...statusCounts.map((item) => item.count), 1);

  return (
    <section className="content-grid">
      <div className="stats-grid">
        <StatCard icon={<FolderKanban />} label="Total Projects" value={projects.length} />
        <StatCard icon={<ClipboardList />} label="Total Tasks" value={tasks.length} />
        <StatCard icon={<CheckCircle2 />} label="Completed Tasks" value={completedTasks} />
        <StatCard icon={<BarChart3 />} label="Pending Tasks" value={pendingTasks} />
      </div>

      <section className="panel span-2">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Workload</p>
            <h2>Task Status Overview</h2>
          </div>
          <span className="metric-chip">{activeProjects} active projects</span>
        </div>
        <div className="bar-chart">
          {statusCounts.map((item) => (
            <div className="bar-row" key={item.status}>
              <span>{item.status}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(item.count / maxCount) * 100}%` }} />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Team</p>
            <h2>Assignments</h2>
          </div>
        </div>
        <div className="assignment-list">
          {users.map((user) => (
            <div className="assignment-row" key={user.id}>
              <span>{user.name}</span>
              <strong>{tasks.filter((task) => task.assigneeId === user.id).length}</strong>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Dashboard;

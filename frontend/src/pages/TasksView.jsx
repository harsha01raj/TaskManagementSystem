import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import FilterBar from "../components/FilterBar.jsx";
import { emptyTask } from "../constants.js";

function TasksView({
  tasks,
  projects,
  users,
  loading,
  onSave,
  onDelete,
  onStatusChange,
  onFiltersChange,
}) {
  const [draft, setDraft] = useState({
    ...emptyTask,
    projectId: projects[0]?.id || "",
    assignedTo: users[0]?.id || "",
  });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [assignee, setAssignee] = useState("All");

  useEffect(() => {
    onFiltersChange({
      search: query,
      status: status === "All" ? undefined : status,
      priority: priority === "All" ? undefined : priority,
      assignedUser: assignee === "All" ? undefined : assignee,
    });
  }, [assignee, onFiltersChange, priority, query, status]);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      projectId: current.projectId || projects[0]?.id || "",
      assignedTo: current.assignedTo || users[0]?.id || "",
    }));
  }, [projects, users]);

  async function submitTask(event) {
    event.preventDefault();
    await onSave(draft);
    setDraft({
      ...emptyTask,
      projectId: projects[0]?.id || "",
      assignedTo: users[0]?.id || "",
    });
  }

  return (
    <section className="management-layout">
      <form className="panel editor-panel" onSubmit={submitTask}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Task CRUD</p>
            <h2>{draft.id ? "Edit Task" : "Create Task"}</h2>
          </div>
        </div>
        <label>
          Title
          <input
            value={draft.title}
            onChange={(event) =>
              setDraft({ ...draft, title: event.target.value })
            }
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
            required
          />
        </label>
        <div className="field-grid">
          <label>
            Project
            <select
              value={draft.projectId}
              onChange={(event) =>
                setDraft({ ...draft, projectId: event.target.value })
              }
              required
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assignee
            <select
              value={draft.assignedTo}
              onChange={(event) =>
                setDraft({ ...draft, assignedTo: event.target.value })
              }
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="field-grid">
          <label>
            Priority
            <select
              value={draft.priority}
              onChange={(event) =>
                setDraft({ ...draft, priority: event.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label>
            Status
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft({ ...draft, status: event.target.value })
              }
            >
              <option>To-Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </label>
        </div>
        <label>
          Due Date
          <input
            type="date"
            value={draft.dueDate}
            onChange={(event) =>
              setDraft({ ...draft, dueDate: event.target.value })
            }
            required
          />
        </label>
        <div className="button-row">
          <button
            className="primary-button"
            type="submit"
            disabled={loading || projects.length === 0}
          >
            <Plus size={18} />
            {draft.id ? "Save Task" : "Add Task"}
          </button>
          {draft.id && (
            <button
              className="ghost-button"
              type="button"
              onClick={() =>
                setDraft({
                  ...emptyTask,
                  projectId: projects[0]?.id || "",
                  assigneeTo: users[0]?.id || "",
                })
              }
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="panel list-panel">
        <FilterBar query={query} onQuery={setQuery}>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>To-Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
          >
            <option value="All">All Assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </FilterBar>

        {loading && <p className="muted-text">Loading tasks...</p>}
        {!loading && tasks.length === 0 && (
          <p className="muted-text">No tasks found.</p>
        )}

        <div className="item-list">
          {/* {console.log(tasks)} */}
          {tasks.map((task) => (
            <article className="work-card task-card" key={task.id}>
              <div>
                <div className="card-title-row">
                  <h3>{task.title}</h3>
                  <span
                    className={`priority-badge ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p>{task.description}</p>
                <div className="meta-row">
                  <span>
                    {projects.find((project) => project.id === task.projectId)
                      ?.name || "No project"}
                  </span>
                  {/* {console.log(task, users)}; */}
                  <span>
                    {users.find((user) => user.id === task.assignedTo)?.name ||
                      "Unassigned"}
                  </span>
                  <span>Due: {task.dueDate || "Not set"}</span>
                </div>
              </div>
              <div className="task-controls">
                <select
                  value={task.status}
                  onChange={(event) => onStatusChange(task, event.target.value)}
                  aria-label={`Update ${task.title} status`}
                >
                  <option>To-Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setDraft(task)}
                >
                  Edit
                </button>
                <button
                  className="danger-button"
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default TasksView;

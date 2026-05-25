import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import FilterBar from "../components/FilterBar.jsx";
import { emptyProject } from "../constants.js";

function ProjectsView({ projects, users, loading, onSave, onDelete, onFiltersChange }) {
  const [draft, setDraft] = useState(emptyProject);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    onFiltersChange({
      search: query,
      status: status === "All" ? undefined : status
    });
  }, [onFiltersChange, query, status]);

  async function submitProject(event) {
    event.preventDefault();
    await onSave(draft);
    setDraft(emptyProject);
  }

  return (
    <section className="management-layout">
      <form className="panel editor-panel" onSubmit={submitProject}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Project CRUD</p>
            <h2>{draft.id ? "Edit Project" : "Create Project"}</h2>
          </div>
        </div>
        <label>
          Name
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
        </label>
        <label>
          Description
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} required />
        </label>
        <div className="button-row">
          <button className="primary-button" type="submit" disabled={loading}>
            <Plus size={18} />
            {draft.id ? "Save Project" : "Add Project"}
          </button>
          {draft.id && <button className="ghost-button" type="button" onClick={() => setDraft(emptyProject)}>Cancel</button>}
        </div>
      </form>

      <section className="panel list-panel">
        <FilterBar query={query} onQuery={setQuery}>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>To-Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </FilterBar>

        {loading && <p className="muted-text">Loading projects...</p>}
        {!loading && projects.length === 0 && <p className="muted-text">No projects found.</p>}

        <div className="item-list">
          {projects.map((project) => (
            <article className="work-card" key={project.id}>
              <div>
                <div className="card-title-row">
                  <h3>{project.name}</h3>
                </div>
                <p>{project.description}</p>
                <div className="meta-row">
                  <span>Owner: {users.find((user) => user.id === project.ownerId)?.name || "Current user"}</span>
                  {/* <span>Due: {project.dueDate || "Not set"}</span> */}
                </div>
              </div>
              <div className="card-actions">
                <button className="ghost-button" type="button" onClick={() => setDraft(project)}>Edit</button>
                <button className="danger-button" type="button" aria-label={`Delete ${project.name}`} onClick={() => onDelete(project.id)}>
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

export default ProjectsView;

import { useCallback, useEffect, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectsView from "./pages/ProjectsView.jsx";
import TasksView from "./pages/TasksView.jsx";
import { clearSession, readSession, saveSession } from "./services/sessionStorage.js";
import { createUser, getUsers, loginUser } from "./services/userService.js";
import {
  createProject,
  deleteProject as deleteProjectRequest,
  getAllProjects,
  updateProject
} from "./services/projectService.js";
import {
  createTask,
  deleteTask as deleteTaskRequest,
  getAllTasks,
  updateTask
} from "./services/taskService.js";

function App() {
  const [session, setSession] = useState(() => readSession());
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [screen, setScreen] = useState("dashboard");
  const [projectFilters, setProjectFilters] = useState({});
  const [taskFilters, setTaskFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [appError, setAppError] = useState("");
  const [toasts, setToasts] = useState([]);

  function validateSession(nextSession) {
    if (!nextSession.user?.id) {
      throw new Error("Login response received, but user id is missing. Backend should return user data.");
    }
  }

  function showToast(message, type = "success") {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }

  function closeToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  const loadUsers = useCallback(async () => {
    if (!session) return;
    const backendUsers = await getUsers();
    setUsers(backendUsers.length ? backendUsers : session ? [session.user] : []);
  }, [session]);

  const loadProjects = useCallback(async () => {
    if (!session) return;
    const backendProjects = await getAllProjects(projectFilters);
    setProjects(backendProjects);
  }, [projectFilters, session]);

  const loadTasks = useCallback(async () => {
    if (!session) return;
    const backendTasks = await getAllTasks(taskFilters);
    setTasks(backendTasks);
  }, [session, taskFilters]);

  const loadWorkspace = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setAppError("");
    try {
      await Promise.all([loadUsers(), loadProjects(), loadTasks()]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load backend data";
      setAppError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [loadProjects, loadTasks, loadUsers, session]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  async function handleLogin(email, password) {
    setLoading(true);
    setAuthError("");
    try {
      const nextSession = await loginUser({ email, password });
      validateSession(nextSession);
      saveSession(nextSession);
      setSession(nextSession);
      setUsers([nextSession.user]);
      showToast("Login successful");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setAuthError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(name, email, password) {
    setLoading(true);
    setAuthError("");
    try {
      const nextSession = await createUser({ name, email, password });
      validateSession(nextSession);
      saveSession(nextSession);
      setSession(nextSession);
      setUsers([nextSession.user]);
      showToast("Account created successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setAuthError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearSession();
    setSession(null);
    setUsers([]);
    setProjects([]);
    setTasks([]);
    showToast("Logged out");
  }

  async function saveProject(project) {
    setLoading(true);
    setAppError("");
    try {
      if (project.id) {
        await updateProject(project);
      } else {
        const { id, ...newProject } = project;
        await createProject(newProject);
      }
      await loadProjects();
      showToast(project.id ? "Project updated successfully" : "Project created successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save project";
      setAppError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function removeProject(projectId) {
    setLoading(true);
    setAppError("");
    try {
      await deleteProjectRequest(projectId);
      await Promise.all([loadProjects(), loadTasks()]);
      showToast("Project deleted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete project";
      setAppError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveTask(task) {
    setLoading(true);
    setAppError("");
    try {
      if (task.id) {
        await updateTask(task);
      } else {
        const { id, ...newTask } = task;
        await createTask(newTask);
      }
      await loadTasks();
      showToast(task.id ? "Task updated successfully" : "Task created successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save task";
      setAppError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function removeTask(taskId) {
    setLoading(true);
    setAppError("");
    try {
      await deleteTaskRequest(taskId);
      await loadTasks();
      showToast("Task deleted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete task";
      setAppError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(task, status) {
    await saveTask({ ...task, status });
  }

  if (!session) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={closeToast} />
        <AuthPage error={authError} loading={loading} onLogin={handleLogin} onRegister={handleRegister} />
      </>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <AppShell currentUser={session.user} screen={screen} onScreenChange={setScreen} onLogout={logout}>
        {appError && <p className="error-text">{appError}</p>}
        {screen === "dashboard" && <Dashboard projects={projects} tasks={tasks} users={users} />}
        {screen === "projects" && (
          <ProjectsView
            projects={projects}
            users={users}
            loading={loading}
            onSave={saveProject}
            onDelete={removeProject}
            onFiltersChange={setProjectFilters}
          />
        )}
        {screen === "tasks" && (
          <TasksView
            tasks={tasks}
            projects={projects}
            users={users}
            loading={loading}
            onSave={saveTask}
            onDelete={removeTask}
            onStatusChange={updateTaskStatus}
            onFiltersChange={setTaskFilters}
          />
        )}
      </AppShell>
    </>
  );
}

export default App;

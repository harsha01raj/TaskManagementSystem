export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const SESSION_KEY = "taskflow.session";

export const emptyProject = {
  id: "",
  name: "",
  description: ""
};

export const emptyTask = {
  id: "",
  title: "",
  description: "",
  projectId: "",
  assigneeId: "",
  priority: "Medium",
  status: "To-Do",
  dueDate: ""
};

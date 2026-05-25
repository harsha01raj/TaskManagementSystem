import { apiRequest } from "./apiClient.js";
import { normalizeTask, normalizeTasks } from "../utils/normalizers.js";

export async function createTask(task) {
  const response = await apiRequest("/task", "POST", { body: task });
  return normalizeTask(response);
}

export async function getAllTasks(filters = {}) {
  const response = await apiRequest("/task/getAllTasks", "POST", { body: filters });
  // console.log('response from getAllTasks', response);
  return normalizeTasks(response);
}

export async function updateTask(task) {
  const response = await apiRequest(`/task/updateTask/${task.id}`, "PUT", { body: task });
  return normalizeTask(response);
}

export async function deleteTask(id) {
  await apiRequest(`/task/deleteTaskById/${id}`, "DELETE");
}

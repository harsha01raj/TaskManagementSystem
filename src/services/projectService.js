import { apiRequest } from "./apiClient.js";
import { normalizeProject, normalizeProjects } from "../utils/normalizers.js";

export async function createProject(project) {
  const response = await apiRequest("/project", "POST", {
    body: {
      title: project.name,
      description: project.description
    }
  });
  return normalizeProject(response);
}

export async function getAllProjects(filters = {}) {
  const response = await apiRequest("/project/getAllProjects", "POST", { body: filters });
  return normalizeProjects(response);
}

export async function getProjectById(id) {
  const response = await apiRequest(`/project/getProjectById/${id}`, "GET");
  return normalizeProject(response);
}

export async function updateProject(project) {
  const response = await apiRequest(`/project/updateProject/${project.id}`, "PUT", {
    body: {
      title: project.name,
      description: project.description
    }
  });
  return normalizeProject(response);
}

export async function deleteProject(id) {
  await apiRequest(`/project/deleteProjectById/${id}`, "DELETE");
}

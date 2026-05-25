import { apiRequest } from "./apiClient.js";
import { normalizeAuthSession, normalizeUsers } from "../utils/normalizers.js";

export async function loginUser(payload) {
  const response = await apiRequest("/user/login", "POST", { body: payload });
  return normalizeAuthSession(response, payload.email);
}

export async function createUser(payload) {
  const response = await apiRequest("/user", "POST", { body: payload });
  return normalizeAuthSession(response, payload.email);
}

export async function getUsers() {
  const response = await apiRequest("/user/getAllUser", "GET");
  return normalizeUsers(response);
}

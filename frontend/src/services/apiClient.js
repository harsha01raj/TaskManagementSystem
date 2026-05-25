import { API_BASE_URL } from "../constants.js";

export async function apiRequest(path, method, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeout || 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "include",
      signal: controller.signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload && typeof payload === "object" && "message" in payload ? String(payload.message) : "Request failed";
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`No response from backend for ${method} ${path}. Check that the route sends res.json(...) or res.status(...).json(...).`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

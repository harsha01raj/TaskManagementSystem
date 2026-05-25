function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function pickArray(payload, keys) {
  if (Array.isArray(payload)) return payload;
  const record = asRecord(payload);
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key];
  }
  return [];
}

function pickObject(payload, keys) {
  const record = asRecord(payload);
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object") return value;
  }
  return payload;
}

export function getId(value) {
  const record = asRecord(value);
  return asString(record.id || record._id);
}

export function normalizeUser(value) {
  const record = asRecord(value);
  return {
    id: getId(record),
    name: asString(record.name || record.username || record.fullName || record.email, "User"),
    email: asString(record.email)
  };
}

export function normalizeUsers(payload) {
  return pickArray(payload, ["users", "data", "result"]).map(normalizeUser).filter((user) => user.id);
}

export function normalizeProject(value) {
  const record = asRecord(value);
  const owner = asRecord(record.owner || record.user || record.createdBy);
  return {
    id: getId(record),
    name: asString(record.name || record.projectName || record.title),
    description: asString(record.description),
    ownerId: asString(record.ownerId || record.userId || record.createdBy || getId(owner)),
    dueDate: asString(record.dueDate || record.deadline).slice(0, 10),
    status: asString(record.status, "Planning")
  };
}

export function normalizeProjects(payload) {
  return pickArray(payload, ["projects", "data", "result"]).map(normalizeProject).filter((project) => project.id);
}

export function normalizeTask(value) {
  const record = asRecord(value);
  const project = asRecord(record.project || record.projectId);
  const assignee = asRecord(record.assignee || record.assignedUser || record.user);
  return {
    id: getId(record),
    title: asString(record.title || record.name),
    description: asString(record.description),
    projectId: asString(record.projectId || record.project || getId(project)),
    assignedTo: asString(record.assignedTo || record.assignedUser || record.userId || getId(assignee)),
    priority: asString(record.priority, "Medium"),
    status: asString(record.status, "To-Do"),
    dueDate: asString(record.dueDate || record.deadline).slice(0, 10)
  };
}

export function normalizeTasks(payload) {
  return pickArray(payload, ["tasks", "data", "result"]).map(normalizeTask).filter((task) => task.id);
}

export function normalizeAuthSession(payload, fallbackEmail) {
  const record = asRecord(payload);
  const data = asRecord(record.data);
  const token = asString(record.token || record.accessToken || record.jwt || data.token || data.accessToken || data.jwt);
  const userPayload = data.user || record.user || data || payload;
  const user = normalizeUser(userPayload);

  return {
    token,
    user: {
      ...user,
      email: user.email || fallbackEmail
    }
  };
}

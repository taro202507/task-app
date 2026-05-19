export const STORAGE_KEY = "taskApp.tasks.v1";

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
export const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };

export function normalizePriority(value) {
  return value === "high" || value === "low" ? value : "medium";
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map((t) => ({
      ...t,
      priority: normalizePriority(t.priority),
    }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function matchesSearch(task, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  const hay = `${task.title} ${task.description || ""}`.toLowerCase();
  return hay.includes(q);
}

export function matchesPriorityFilter(task, filter) {
  if (filter === "all") return true;
  return normalizePriority(task.priority) === filter;
}

export function compareTasks(a, b) {
  const pa = PRIORITY_ORDER[normalizePriority(a.priority)] ?? 1;
  const pb = PRIORITY_ORDER[normalizePriority(b.priority)] ?? 1;
  if (pa !== pb) return pa - pb;
  return new Date(b.updatedAt) - new Date(a.updatedAt);
}

export function buildStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const todo = total - done;
  const high = tasks.filter((t) => normalizePriority(t.priority) === "high").length;
  return `全 ${total} 件（未完了 ${todo} / 完了 ${done} / 高優先 ${high}）`;
}

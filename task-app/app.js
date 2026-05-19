const STORAGE_KEY = "taskApp.tasks.v1";

const $form = document.getElementById("task-form");
const $taskId = document.getElementById("task-id");
const $title = document.getElementById("title");
const $description = document.getElementById("description");
const $status = document.getElementById("status");
const $submitBtn = document.getElementById("submit-btn");
const $cancelBtn = document.getElementById("cancel-btn");
const $search = document.getElementById("search");
const $taskList = document.getElementById("task-list");
const $emptyMessage = document.getElementById("empty-message");
const $stats = document.getElementById("stats");

/** @returns {Array<{id:string,title:string,description:string,status:'todo'|'done',createdAt:string,updatedAt:string}>} */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** @param {ReturnType<typeof loadTasks>} tasks */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(iso) {
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

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resetForm() {
  $form.reset();
  $taskId.value = "";
  $submitBtn.textContent = "追加";
  $cancelBtn.hidden = true;
}

function startEdit(task) {
  $taskId.value = task.id;
  $title.value = task.title;
  $description.value = task.description || "";
  $status.value = task.status;
  $submitBtn.textContent = "更新";
  $cancelBtn.hidden = false;
  $title.focus();
}

function matchesSearch(task, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  const hay = `${task.title} ${task.description || ""}`.toLowerCase();
  return hay.includes(q);
}

function updateStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const todo = total - done;
  $stats.textContent = `全 ${total} 件（未完了 ${todo} / 完了 ${done}）`;
}

function render() {
  const allTasks = loadTasks();
  const query = $search.value;
  const tasks = allTasks
    .filter((t) => matchesSearch(t, query))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  updateStats(allTasks);
  $taskList.innerHTML = "";

  if (tasks.length === 0) {
    $emptyMessage.hidden = allTasks.length > 0;
    $emptyMessage.textContent =
      allTasks.length > 0
        ? "検索条件に一致するタスクがありません。"
        : "タスクがありません。上のフォームから追加してください。";
    return;
  }

  $emptyMessage.hidden = true;

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = `task-item${task.status === "done" ? " task-item--done" : ""}`;
    li.dataset.id = task.id;

    const statusLabel = task.status === "done" ? "完了" : "未完了";
    const badgeClass = task.status === "done" ? "badge--done" : "badge--todo";

    li.innerHTML = `
      <div class="task-item__body">
        <h3 class="task-item__title">${escapeHtml(task.title)}</h3>
        ${task.description ? `<p class="task-item__desc">${escapeHtml(task.description)}</p>` : ""}
        <p class="task-item__meta">
          <span class="badge ${badgeClass}">${statusLabel}</span>
          更新: ${escapeHtml(formatDate(task.updatedAt))}
        </p>
      </div>
      <div class="task-item__actions">
        <button type="button" class="btn btn--small" data-action="edit">編集</button>
        <button type="button" class="btn btn--small btn--danger" data-action="delete">削除</button>
      </div>
    `;

    $taskList.appendChild(li);
  }
}

$form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const title = $title.value.trim();
  if (!title) {
    $title.focus();
    return;
  }

  const now = new Date().toISOString();
  const tasks = loadTasks();
  const editingId = $taskId.value;

  if (editingId) {
    const idx = tasks.findIndex((t) => t.id === editingId);
    if (idx === -1) {
      resetForm();
      render();
      return;
    }
    tasks[idx] = {
      ...tasks[idx],
      title,
      description: $description.value.trim(),
      status: $status.value,
      updatedAt: now,
    };
  } else {
    tasks.push({
      id: createId(),
      title,
      description: $description.value.trim(),
      status: $status.value,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveTasks(tasks);
  resetForm();
  render();
});

$cancelBtn.addEventListener("click", () => {
  resetForm();
});

$search.addEventListener("input", () => {
  render();
});

$taskList.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-action]");
  if (!btn) return;

  const li = btn.closest(".task-item");
  if (!li) return;

  const id = li.dataset.id;
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    render();
    return;
  }

  const action = btn.dataset.action;

  if (action === "edit") {
    startEdit(task);
    return;
  }

  if (action === "delete") {
    const ok = window.confirm(`「${task.title}」を削除しますか？`);
    if (!ok) return;

    const next = tasks.filter((t) => t.id !== id);
    saveTasks(next);

    if ($taskId.value === id) {
      resetForm();
    }
    render();
  }
});

render();

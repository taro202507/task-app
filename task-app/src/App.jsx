import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PANEL_BG,
  getPanelBorder,
  loadSavedPanelColor,
  savePanelColor,
} from "./utils/colors.js";
import {
  buildStats,
  compareTasks,
  createId,
  loadTasks,
  matchesPriorityFilter,
  matchesSearch,
  normalizePriority,
  saveTasks,
} from "./utils/tasks.js";
import { Header } from "./components/Header.jsx";
import { TaskForm } from "./components/TaskForm.jsx";
import { TaskList } from "./components/TaskList.jsx";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
};

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [panelColor, setPanelColor] = useState(() => loadSavedPanelColor());

  useEffect(() => {
    const border = getPanelBorder(panelColor);
    document.documentElement.style.setProperty("--panel-bg", panelColor);
    document.documentElement.style.setProperty("--panel-border", border);
    savePanelColor(panelColor);
  }, [panelColor]);

  const visibleTasks = useMemo(
    () =>
      tasks
        .filter((t) => matchesSearch(t, search) && matchesPriorityFilter(t, priorityFilter))
        .sort(compareTasks),
    [tasks, search, priorityFilter],
  );

  const statsText = useMemo(() => buildStats(tasks), [tasks]);

  const emptyMessage =
    tasks.length > 0
      ? "条件に一致するタスクがありません。"
      : "タスクがありません。上のフォームから追加してください。";

  function persist(nextTasks) {
    setTasks(nextTasks);
    saveTasks(nextTasks);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const title = form.title.trim();
    if (!title) return;

    const now = new Date().toISOString();
    const priority = normalizePriority(form.priority);

    if (form.id) {
      const idx = tasks.findIndex((t) => t.id === form.id);
      if (idx === -1) {
        setForm(emptyForm);
        return;
      }
      const next = [...tasks];
      next[idx] = {
        ...next[idx],
        title,
        description: form.description.trim(),
        status: form.status,
        priority,
        updatedAt: now,
      };
      persist(next);
    } else {
      persist([
        ...tasks,
        {
          id: createId(),
          title,
          description: form.description.trim(),
          status: form.status,
          priority,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }
    setForm(emptyForm);
  }

  function handleEdit(task) {
    setForm({
      id: task.id,
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: normalizePriority(task.priority),
    });
  }

  function handleDelete(task) {
    const ok = window.confirm(`「${task.title}」を削除しますか？`);
    if (!ok) return;
    persist(tasks.filter((t) => t.id !== task.id));
    if (form.id === task.id) setForm(emptyForm);
  }

  function handleCancel() {
    setForm(emptyForm);
  }

  function handlePanelReset() {
    setPanelColor(DEFAULT_PANEL_BG);
  }

  return (
    <main className="app" aria-label="タスク管理アプリ">
      <Header
        statsText={statsText}
        panelColor={panelColor}
        onPanelColorChange={setPanelColor}
        onPanelColorReset={handlePanelReset}
      />

      <section className="panel" aria-labelledby="form-title">
        <h2 id="form-title" className="panel__title">
          タスク登録・編集
        </h2>
        <TaskForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </section>

      <section className="panel" aria-labelledby="list-title">
        <TaskList
          tasks={visibleTasks}
          search={search}
          priorityFilter={priorityFilter}
          emptyMessage={emptyMessage}
          showEmpty={visibleTasks.length === 0}
          onSearchChange={setSearch}
          onPriorityFilterChange={setPriorityFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}

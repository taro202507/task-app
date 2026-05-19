import { formatDate, normalizePriority, PRIORITY_LABEL } from "../utils/tasks.js";

export function TaskItem({ task, onEdit, onDelete }) {
  const priority = normalizePriority(task.priority);
  const statusLabel = task.status === "done" ? "完了" : "未完了";
  const statusClass = task.status === "done" ? "badge--done" : "badge--todo";

  return (
    <li className={`task-item${task.status === "done" ? " task-item--done" : ""}`}>
      <div className="task-item__body">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description ? <p className="task-item__desc">{task.description}</p> : null}
        <p className="task-item__meta">
          <span className={`badge badge--priority-${priority}`}>優先: {PRIORITY_LABEL[priority]}</span>
          <span className={`badge ${statusClass}`}>{statusLabel}</span>
          更新: {formatDate(task.updatedAt)}
        </p>
      </div>
      <div className="task-item__actions">
        <button type="button" className="btn btn--small" onClick={() => onEdit(task)}>
          編集
        </button>
        <button type="button" className="btn btn--small btn--danger" onClick={() => onDelete(task)}>
          削除
        </button>
      </div>
    </li>
  );
}

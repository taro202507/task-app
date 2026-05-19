import { TaskItem } from "./TaskItem.jsx";

export function TaskList({
  tasks,
  search,
  priorityFilter,
  emptyMessage,
  showEmpty,
  onSearchChange,
  onPriorityFilterChange,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <div className="panel__head">
        <h2 id="list-title" className="panel__title">
          タスク一覧
        </h2>
        <div className="panel__filters">
          <label className="filter">
            <span className="filter__label">優先度</span>
            <select value={priorityFilter} onChange={(e) => onPriorityFilterChange(e.target.value)}>
              <option value="all">すべて</option>
              <option value="high">高のみ</option>
              <option value="medium">中のみ</option>
              <option value="low">低のみ</option>
            </select>
          </label>
          <label className="search">
            <span className="sr-only">検索</span>
            <input
              type="search"
              placeholder="タイトル・詳細で検索…"
              autoComplete="off"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </label>
        </div>
      </div>

      <ul className="task-list" aria-live="polite">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>

      {showEmpty && <p className="empty">{emptyMessage}</p>}
    </>
  );
}

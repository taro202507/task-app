export function TaskForm({ form, onChange, onSubmit, onCancel }) {
  const isEditing = Boolean(form.id);

  function updateField(name, value) {
    onChange({ ...form, [name]: value });
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label className="field">
        <span className="field__label">
          タイトル <span className="req">必須</span>
        </span>
        <input
          type="text"
          maxLength={100}
          required
          placeholder="例: 設計書をレビューする"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field__label">詳細</span>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="任意のメモ"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </label>

      <div className="form__row">
        <label className="field field--inline">
          <span className="field__label">状態</span>
          <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
            <option value="todo">未完了</option>
            <option value="done">完了</option>
          </select>
        </label>

        <label className="field field--inline">
          <span className="field__label">優先度</span>
          <select value={form.priority} onChange={(e) => updateField("priority", e.target.value)}>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </label>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? "更新" : "追加"}
        </button>
        {isEditing && (
          <button type="button" className="btn" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}

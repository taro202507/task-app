const MAX_ITEMS = 10;

export function RankedItemFields({ label, maxLen, items, onChange, disabled }) {
  function updateItem(index, field, value) {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  }

  function addItem() {
    if (items.length >= MAX_ITEMS) return;
    onChange([...items, { text: "", priority: "" }]);
  }

  function removeItem(index) {
    if (items.length <= 1) {
      onChange([{ text: "", priority: "" }]);
      return;
    }
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <fieldset className="ranked-fieldset">
      <legend>{label}（最大10件・優先順位1～10・重複不可）</legend>
      {items.map((item, index) => (
        <div className="ranked-row" key={`${label}-${index}`}>
          <input
            type="text"
            maxLength={maxLen}
            placeholder={`${label}（全角${maxLen}文字まで）`}
            value={item.text}
            disabled={disabled}
            onChange={(e) => updateItem(index, "text", e.target.value)}
          />
          <select
            value={item.priority}
            disabled={disabled}
            onChange={(e) => updateItem(index, "priority", e.target.value)}
          >
            <option value="">優先順位</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--small"
            disabled={disabled}
            onClick={() => removeItem(index)}
          >
            削除
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn--small"
        disabled={disabled || items.length >= MAX_ITEMS}
        onClick={addItem}
      >
        行を追加（{items.length}/{MAX_ITEMS}）
      </button>
    </fieldset>
  );
}

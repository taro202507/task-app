export function Header({ statsText, panelColor, onPanelColorChange, onPanelColorReset }) {
  return (
    <header className="header">
      <div className="header__text">
        <h1>タスク管理</h1>
        <p className="header__sub">React版（localStorage 保存）</p>
      </div>
      <div className="header__tools">
        <p className="stats" aria-live="polite">
          {statsText}
        </p>
        <label className="color-picker">
          <span className="color-picker__label">パネル背景色</span>
          <input
            type="color"
            value={panelColor}
            onChange={(e) => onPanelColorChange(e.target.value)}
            title="タスク登録・一覧の背景色"
          />
        </label>
        <button type="button" className="btn btn--small" onClick={onPanelColorReset}>
          初期色
        </button>
      </div>
    </header>
  );
}

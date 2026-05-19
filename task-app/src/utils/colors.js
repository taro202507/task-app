export const DEFAULT_PANEL_BG = "#fff9c4";
export const DEFAULT_PANEL_BORDER = "#facc15";
export const PANEL_COLOR_KEY = "taskApp.panelBg.v1";

export function normalizeHexColor(value) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : null;
}

export function darkenHex(hex, amount = 0.12) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amount)) | 0;
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amount)) | 0;
  const b = Math.max(0, (n & 255) * (1 - amount)) | 0;
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function getPanelBorder(hex) {
  const color = normalizeHexColor(hex) || DEFAULT_PANEL_BG;
  return color === DEFAULT_PANEL_BG ? DEFAULT_PANEL_BORDER : darkenHex(color);
}

export function loadSavedPanelColor() {
  return normalizeHexColor(localStorage.getItem(PANEL_COLOR_KEY)) || DEFAULT_PANEL_BG;
}

export function savePanelColor(hex) {
  const color = normalizeHexColor(hex) || DEFAULT_PANEL_BG;
  localStorage.setItem(PANEL_COLOR_KEY, color);
  return color;
}

const FONT_POOL = [
  '"Segoe UI", sans-serif',
  '"Yu Gothic UI", "Meiryo", sans-serif',
  '"Hiragino Sans", "Meiryo", sans-serif',
  '"MS PGothic", "MS Gothic", sans-serif',
  "Georgia, serif",
  '"Times New Roman", serif',
  "Arial, sans-serif",
  '"Trebuchet MS", sans-serif',
  "Verdana, sans-serif",
  '"Comic Sans MS", cursive',
  "Impact, sans-serif",
  '"Courier New", monospace',
  "Tahoma, sans-serif",
  '"Arial Black", sans-serif',
];

export const GRID_COLS = 5;
export const GRID_ROWS = 20;
const COLS = GRID_COLS;
const ROWS = GRID_ROWS;
const BLOCK_COUNT = COLS * ROWS;

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 50 + Math.random() * 40;
  const l = 28 + Math.random() * 28;
  return `hsl(${h} ${s}% ${l}%)`;
}

export function pickRandomBackground() {
  const h = Math.floor(Math.random() * 360);
  const s = 35 + Math.random() * 45;
  const l = 72 + Math.random() * 18;
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, #ffffff, hsl(${h} ${s}% ${l}%))`;
}

function pickFont() {
  return FONT_POOL[Math.floor(Math.random() * FONT_POOL.length)];
}

function fontSizeForIndex(index, total) {
  const orderWeight = 1 - index / Math.max(total, 1);
  const base = 12 + orderWeight * 24;
  const jitter = (Math.random() - 0.5) * 8;
  const crowded = total > 30 ? 0.85 : 1;
  return Math.round(Math.max(10, Math.min(36, (base + jitter) * crowded)));
}

function pickRotation() {
  return (Math.random() - 0.5) * 70;
}

/** 透過率 0%〜50% → opacity 0.5〜1.0 */
function pickOpacity() {
  const transparency = Math.random() * 0.5;
  return 1 - transparency;
}

export function createBlockCells(area) {
  const cellW = area.width / COLS;
  const cellH = area.height / ROWS;
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      cells.push({
        key: `${row},${col}`,
        row,
        col,
        left: col * cellW,
        top: row * cellH,
        width: cellW,
        height: cellH,
      });
    }
  }
  return cells;
}

function createBlockOrder() {
  const blocks = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      blocks.push({ row, col });
    }
  }
  return shuffle(blocks);
}

/**
 * ブロック中央の座標（translate(-50%, -50%) の基準点）を返す
 */
function blockCenterPosition(row, col, area) {
  const cellW = area.width / COLS;
  const cellH = area.height / ROWS;

  return {
    left: col * cellW + cellW / 2,
    top: row * cellH + cellH / 2,
  };
}

/**
 * @param {string[]} words
 * @param {{ width: number, height: number }} area
 */
export function layoutWordCloud(words, area) {
  const blockOrder = createBlockOrder();
  const placed = [];

  words.forEach((text, index) => {
    if (index >= BLOCK_COUNT) return;

    const { row, col } = blockOrder[index];
    const fontSize = fontSizeForIndex(index, words.length);
    const { left, top } = blockCenterPosition(row, col, area);

    placed.push({
      id: `${index}-${text}-${row}-${col}`,
      text,
      fontSize,
      color: pickColor(),
      fontFamily: pickFont(),
      rotation: pickRotation(),
      opacity: pickOpacity(),
      row,
      col,
      left,
      top,
    });
  });

  return placed;
}

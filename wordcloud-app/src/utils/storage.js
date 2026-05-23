const STORAGE_KEY = "wordcloud-app.slots.v1";
const SHOW_FRAMES_KEY = "wordcloud-app.showFrames.v1";
export const SLOT_COUNT = 50;
export const REQUIRED_COUNT = 3;
export const MAX_WORD_LEN = 30;

export function emptySlots() {
  return Array.from({ length: SLOT_COUNT }, () => "");
}

export function loadSlots() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySlots();
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return emptySlots();
    const slots = emptySlots();
    for (let i = 0; i < Math.min(SLOT_COUNT, data.length); i++) {
      slots[i] = typeof data[i] === "string" ? data[i] : "";
    }
    return slots;
  } catch {
    return emptySlots();
  }
}

export function saveSlots(slots) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export function loadShowFrames() {
  try {
    return sessionStorage.getItem(SHOW_FRAMES_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveShowFrames(value) {
  sessionStorage.setItem(SHOW_FRAMES_KEY, value ? "1" : "0");
}

/** 空欄を除いたワード一覧（重複はそのまま複数件） */
export function collectWords(slots) {
  return slots.map((s) => s.trim()).filter(Boolean);
}

export function validateSlots(slots) {
  for (let i = 0; i < REQUIRED_COUNT; i++) {
    if (!slots[i]?.trim()) {
      return `1～${REQUIRED_COUNT}番目は必須入力です。`;
    }
    if (slots[i].trim().length > MAX_WORD_LEN) {
      return `${i + 1}番目は${MAX_WORD_LEN}文字までです。`;
    }
  }

  for (let i = REQUIRED_COUNT; i < SLOT_COUNT; i++) {
    const v = slots[i]?.trim();
    if (!v) continue;
    if (v.length > MAX_WORD_LEN) {
      return `${i + 1}番目は${MAX_WORD_LEN}文字までです。`;
    }
  }

  if (collectWords(slots).length < REQUIRED_COUNT) {
    return `${REQUIRED_COUNT}件以上入力してください。`;
  }

  return "";
}

const STORAGE_KEY = "staffApp.members.v1";

export function loadMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function findMember(employeeId) {
  return loadMembers().find((m) => m.employeeId === employeeId) ?? null;
}

export function deleteMember(employeeId) {
  const next = loadMembers().filter((m) => m.employeeId !== employeeId);
  saveMembers(next);
}

export function upsertMember(member) {
  const members = loadMembers();
  const idx = members.findIndex((m) => m.employeeId === member.employeeId);
  if (idx === -1) {
    saveMembers([...members, member]);
    return;
  }
  const next = [...members];
  next[idx] = member;
  saveMembers(next);
}

/** 優先順位 1～3 の項目だけを表示用文字列にする */
export function formatRankedPreview(items) {
  if (!items?.length) return "—";
  const top = items
    .filter((item) => item.priority >= 1 && item.priority <= 3 && item.text.trim())
    .sort((a, b) => a.priority - b.priority)
    .map((item) => `${item.priority}:${item.text.trim()}`);
  return top.length ? top.join(" / ") : "—";
}

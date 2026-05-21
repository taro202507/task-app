/** 半角英数字のみ許可（全角文字は許可） */
export function hasInvalidHalfWidthChars(value) {
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    const isHalfWidth =
      (code >= 0x20 && code <= 0x7e) || code === 0x0a || code === 0x0d || code === 0x09;
    if (isHalfWidth && !/[0-9A-Za-z]/.test(ch)) return true;
  }
  return false;
}

export function validateEmployeeId(value) {
  if (!value) return "社員番号を入力してください。";
  if (value.length > 5) return "社員番号は半角5文字までです。";
  if (!/^[0-9A-Za-z]+$/.test(value)) return "社員番号は半角英数字のみ入力できます。";
  return "";
}

export function validateMaxLength(value, max, label, allowEmpty = false) {
  if (!value) return allowEmpty ? "" : `${label}を入力してください。`;
  if (value.length > max) return `${label}は${max}文字までです。`;
  if (hasInvalidHalfWidthChars(value)) return `${label}の半角入力は英数字のみ可能です。`;
  return "";
}

export function validateRankedItems(items, label, maxLen) {
  const filled = items.filter((item) => item.text.trim() || item.priority);
  if (filled.length === 0) return "";

  const priorities = [];
  for (const item of filled) {
    if (!item.text.trim()) return `${label}の文言を入力してください。`;
    if (item.text.length > maxLen) return `${label}は${maxLen}文字までです。`;
    if (hasInvalidHalfWidthChars(item.text)) return `${label}の半角入力は英数字のみ可能です。`;
    if (!item.priority) return `${label}の優先順位を選択してください。`;
    priorities.push(Number(item.priority));
  }

  const unique = new Set(priorities);
  if (unique.size !== priorities.length) {
    return `${label}の優先順位が重複しています。同じ数字は設定できません。`;
  }

  return "";
}

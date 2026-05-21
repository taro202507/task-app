export function emptyRankedItem() {
  return { text: "", priority: "" };
}

export function emptyMemberForm() {
  return {
    employeeId: "",
    position: "",
    name: "",
    skills: [emptyRankedItem()],
    desiredTasks: [emptyRankedItem()],
    qualifications: [emptyRankedItem()],
    comment: "",
    registeredAt: "",
  };
}

export function memberToForm(member) {
  const mapItems = (items) =>
    items?.length
      ? items.map((item) => ({ text: item.text, priority: String(item.priority) }))
      : [emptyRankedItem()];

  return {
    employeeId: member.employeeId,
    position: member.position,
    name: member.name,
    skills: mapItems(member.skills),
    desiredTasks: mapItems(member.desiredTasks),
    qualifications: mapItems(member.qualifications),
    comment: member.comment || "",
    registeredAt: member.registeredAt,
  };
}

export function normalizeRankedItems(items) {
  return items
    .filter((item) => item.text.trim() && item.priority)
    .map((item) => ({
      text: item.text.trim(),
      priority: Number(item.priority),
    }))
    .sort((a, b) => a.priority - b.priority);
}

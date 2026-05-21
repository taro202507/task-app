import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components/PageTitle.jsx";
import { RankedItemFields } from "../components/RankedItemFields.jsx";
import {
  emptyMemberForm,
  memberToForm,
  normalizeRankedItems,
} from "../utils/formDefaults.js";
import { findMember, loadMembers, upsertMember } from "../utils/storage.js";
import {
  validateEmployeeId,
  validateMaxLength,
  validateRankedItems,
} from "../utils/validation.js";

export function StaffFormPage() {
  const navigate = useNavigate();
  const { employeeId: routeEmployeeId } = useParams();
  const isEdit = Boolean(routeEmployeeId);

  const existing = useMemo(() => {
    if (!routeEmployeeId) return null;
    return findMember(decodeURIComponent(routeEmployeeId));
  }, [routeEmployeeId]);

  const [form, setForm] = useState(() => {
    if (isEdit && existing) return memberToForm(existing);
    if (isEdit && !existing) return emptyMemberForm();
    return emptyMemberForm();
  });
  const [error, setError] = useState("");

  if (isEdit && !existing) {
    return (
      <div className="page form-page">
        <p className="error-banner">指定された社員番号は存在しません。</p>
        <button type="button" className="btn" onClick={() => navigate("/")}>
          一覧へ戻る
        </button>
      </div>
    );
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const idError = validateEmployeeId(form.employeeId);
    if (idError) return idError;

    const posError = validateMaxLength(form.position, 10, "役職名");
    if (posError) return posError;

    const nameError = validateMaxLength(form.name, 20, "名前");
    if (nameError) return nameError;

    const commentError = validateMaxLength(form.comment, 20, "コメント", true);
    if (commentError) return commentError;

    const skillsError = validateRankedItems(form.skills, "技術", 15);
    if (skillsError) return skillsError;

    const tasksError = validateRankedItems(form.desiredTasks, "希望タスク", 15);
    if (tasksError) return tasksError;

    const qualsError = validateRankedItems(form.qualifications, "資格", 15);
    if (qualsError) return qualsError;

    if (!isEdit) {
      const duplicate = loadMembers().some((m) => m.employeeId === form.employeeId);
      if (duplicate) return "同じ社員番号が既に登録されています。";
    }

    return "";
  }

  function handleRegister(ev) {
    ev.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const ok = window.confirm("入力内容を登録しますか？");
    if (!ok) return;

    const now = new Date().toISOString();
    upsertMember({
      employeeId: form.employeeId,
      position: form.position.trim(),
      name: form.name.trim(),
      skills: normalizeRankedItems(form.skills),
      desiredTasks: normalizeRankedItems(form.desiredTasks),
      qualifications: normalizeRankedItems(form.qualifications),
      comment: form.comment.trim(),
      registeredAt: isEdit && existing?.registeredAt ? existing.registeredAt : now,
    });

    navigate("/");
  }

  function handleCancel() {
    const ok = window.confirm("入力内容を破棄して一覧に戻りますか？");
    if (!ok) return;
    navigate("/");
  }

  return (
    <div className="page form-page">
      <header className="page-header">
        <PageTitle>担当者登録</PageTitle>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <form className="staff-form" onSubmit={handleRegister} noValidate>
        <label className="field">
          <span className="field__label">社員番号（半角英数字5文字まで）</span>
          <input
            type="text"
            maxLength={5}
            value={form.employeeId}
            disabled={isEdit}
            onChange={(e) => updateField("employeeId", e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">役職名（全角10文字まで）</span>
          <input
            type="text"
            maxLength={10}
            value={form.position}
            onChange={(e) => updateField("position", e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">名前（全角20文字まで）</span>
          <input
            type="text"
            maxLength={20}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </label>

        <RankedItemFields
          label="技術"
          maxLen={15}
          items={form.skills}
          onChange={(skills) => updateField("skills", skills)}
        />

        <RankedItemFields
          label="希望タスク"
          maxLen={15}
          items={form.desiredTasks}
          onChange={(desiredTasks) => updateField("desiredTasks", desiredTasks)}
        />

        <RankedItemFields
          label="資格"
          maxLen={15}
          items={form.qualifications}
          onChange={(qualifications) => updateField("qualifications", qualifications)}
        />

        <label className="field">
          <span className="field__label">コメント（全角20文字まで）</span>
          <input
            type="text"
            maxLength={20}
            value={form.comment}
            onChange={(e) => updateField("comment", e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">登録日時</span>
          <span className="readonly-value">
            {form.registeredAt
              ? new Date(form.registeredAt).toLocaleString("ja-JP")
              : "（登録時に自動設定）"}
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            登録
          </button>
          <button type="button" className="btn" onClick={handleCancel}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

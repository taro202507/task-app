import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle.jsx";
import { deleteMember, formatRankedPreview, loadMembers } from "../utils/storage.js";

const PAGE_SIZE = 20;

export function StaffListPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(() => loadMembers());
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageMembers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return members.slice(start, start + PAGE_SIZE);
  }, [members, safePage]);

  const rangeStart = members.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, members.length);

  function refresh() {
    setMembers(loadMembers());
  }

  function handleDelete(employeeId, name) {
    const ok = window.confirm(`社員番号 ${employeeId}（${name || "名前未設定"}）を削除しますか？`);
    if (!ok) return;
    deleteMember(employeeId);
    refresh();
    setPage((p) => Math.min(p, Math.max(1, Math.ceil((members.length - 1) / PAGE_SIZE))));
  }

  return (
    <div className="page list-page">
      <header className="page-header">
        <PageTitle>担当者一覧</PageTitle>
        <button type="button" className="btn btn--primary" onClick={() => navigate("/register")}>
          新規追加
        </button>
      </header>

      <p className="list-meta">
        全 {members.length} 件 / {rangeStart}～{rangeEnd} 件目を表示（{safePage} / {totalPages} ページ）
      </p>

      <div className="table-wrap">
        <table className="staff-table">
          <thead>
            <tr>
              <th>社員番号</th>
              <th>役職名</th>
              <th>名前</th>
              <th>技術</th>
              <th>希望タスク</th>
              <th>資格</th>
              <th>コメント</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {pageMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-cell">
                  担当者が登録されていません。「新規追加」から登録してください。
                </td>
              </tr>
            ) : (
              pageMembers.map((member) => (
                <tr key={member.employeeId}>
                  <td>
                    <Link to={`/register/${encodeURIComponent(member.employeeId)}`}>
                      {member.employeeId}
                    </Link>
                  </td>
                  <td>{member.position}</td>
                  <td>{member.name}</td>
                  <td className="cell-multi">{formatRankedPreview(member.skills)}</td>
                  <td className="cell-multi">{formatRankedPreview(member.desiredTasks)}</td>
                  <td className="cell-multi">{formatRankedPreview(member.qualifications)}</td>
                  <td className="cell-comment">{member.comment || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(member.employeeId, member.name)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button
          type="button"
          className="btn"
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          前ページへ
        </button>
        <span className="pager__info">
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className="btn"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          次ページへ
        </button>
      </div>
    </div>
  );
}

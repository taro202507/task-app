import { Navigate, Route, Routes } from "react-router-dom";
import { StaffFormPage } from "./pages/StaffFormPage.jsx";
import { StaffListPage } from "./pages/StaffListPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StaffListPage />} />
      <Route path="/register" element={<StaffFormPage />} />
      <Route path="/register/:employeeId" element={<StaffFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";
import { WordCloudPage } from "./pages/WordCloudPage.jsx";
import { WordRegisterPage } from "./pages/WordRegisterPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WordRegisterPage />} />
      <Route path="/cloud" element={<WordCloudPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

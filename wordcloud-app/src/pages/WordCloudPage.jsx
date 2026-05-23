import { useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { WordCloudCanvas } from "../components/WordCloudCanvas.jsx";
import { collectWords, loadShowFrames, loadSlots } from "../utils/storage.js";

export function WordCloudPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const words = useMemo(() => {
    if (location.state?.words?.length) {
      return location.state.words;
    }
    return collectWords(loadSlots());
  }, [location.state]);

  const showFrames = location.state?.showFrames ?? loadShowFrames();

  if (words.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page cloud-page">
      <header className="page-header page-header--cloud">
        <div>
          <h1>ワードクラウド</h1>
          <p className="page-header__sub">{words.length} 件のワードを表示中</p>
        </div>
        <button type="button" className="btn" onClick={() => navigate("/")}>
          戻る
        </button>
      </header>

      <WordCloudCanvas words={words} showFrames={showFrames} />
    </div>
  );
}

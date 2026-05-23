import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EXAMPLE_FOOD,
  EXAMPLE_MUSIC,
  EXAMPLE_SOCCER,
  shuffleArray,
  shuffleWords,
} from "../utils/examples.js";
import {
  MAX_WORD_LEN,
  REQUIRED_COUNT,
  SLOT_COUNT,
  collectWords,
  emptySlots,
  loadShowFrames,
  loadSlots,
  saveShowFrames,
  saveSlots,
  validateSlots,
} from "../utils/storage.js";

export function WordRegisterPage() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState(() => loadSlots());
  const [showFrames, setShowFrames] = useState(() => loadShowFrames());
  const [error, setError] = useState("");

  function updateSlot(index, value) {
    if (value.length > MAX_WORD_LEN) return;
    setSlots((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function goToCloud(wordList) {
    const words = shuffleWords(wordList);
    navigate("/cloud", { state: { words, showFrames } });
  }

  function handleClear() {
    setError("");
    const cleared = emptySlots();
    setSlots(cleared);
    saveSlots(cleared);
  }

  function handleExample(exampleList) {
    setError("");
    const manualWords = collectWords(slots);
    const exampleWords = shuffleArray(exampleList);
    goToCloud([...manualWords, ...exampleWords]);
  }

  function handleExecute(ev) {
    ev.preventDefault();
    setError("");

    const message = validateSlots(slots);
    if (message) {
      setError(message);
      return;
    }

    const words = collectWords(slots);
    saveSlots(slots);
    navigate("/cloud", { state: { words, showFrames } });
  }

  return (
    <div className="page register-page">
      <header className="page-header">
        <h1>ワード登録</h1>
        <p className="page-header__sub">
          最大{SLOT_COUNT}件（1～{REQUIRED_COUNT}番は必須・各{MAX_WORD_LEN}文字まで）
        </p>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <div className="example-actions">
        <button type="button" className="btn btn--example" onClick={() => handleExample(EXAMPLE_MUSIC)}>
          例(音楽)
        </button>
        <button type="button" className="btn btn--example" onClick={() => handleExample(EXAMPLE_SOCCER)}>
          例(サッカー)
        </button>
        <button type="button" className="btn btn--example" onClick={() => handleExample(EXAMPLE_FOOD)}>
          例(食事)
        </button>
      </div>

      <form className="register-form" onSubmit={handleExecute}>
        <div className="register-form__scroll">
          <ol className="word-slots">
            {slots.map((value, index) => (
              <li key={index} className="word-slot">
                <label htmlFor={`word-${index}`}>
                  <span className="word-slot__num">{index + 1}</span>
                  {index < REQUIRED_COUNT && <span className="req">必須</span>}
                </label>
                <input
                  id={`word-${index}`}
                  type="text"
                  maxLength={MAX_WORD_LEN}
                  placeholder={index < REQUIRED_COUNT ? "入力してください" : "任意"}
                  value={value}
                  onChange={(e) => updateSlot(index, e.target.value)}
                />
              </li>
            ))}
          </ol>

          <label className="frames-option">
            <input
              type="checkbox"
              checked={showFrames}
              onChange={(e) => {
                const next = e.target.checked;
                setShowFrames(next);
                saveShowFrames(next);
              }}
            />
            枠あり
          </label>
        </div>

        <div className="register-form__footer form-actions">
          <button type="button" className="btn" onClick={handleClear}>
            クリア
          </button>
          <button type="submit" className="btn btn--primary">
            実行
          </button>
        </div>
      </form>
    </div>
  );
}

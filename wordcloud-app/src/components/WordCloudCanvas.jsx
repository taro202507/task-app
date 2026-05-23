import { useEffect, useMemo, useRef, useState } from "react";
import {
  createBlockCells,
  layoutWordCloud,
  pickRandomBackground,
} from "../utils/wordCloudLayout.js";

export function WordCloudCanvas({ words, showFrames = false }) {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const background = useMemo(() => pickRandomBackground(), [words]);

  const occupiedKeys = useMemo(
    () => new Set(items.map((item) => `${item.row},${item.col}`)),
    [items],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || words.length === 0) {
      setItems([]);
      setBlocks([]);
      return;
    }

    function update() {
      const { width, height } = el.getBoundingClientRect();
      const area = { width, height };
      setItems(layoutWordCloud(words, area));
      setBlocks(showFrames ? createBlockCells(area) : []);
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [words, showFrames]);

  return (
    <div
      ref={containerRef}
      className={`wordcloud-canvas${showFrames ? " wordcloud-canvas--frames" : ""}`}
      style={{ background }}
      aria-label="ワードクラウド"
    >
      {showFrames &&
        blocks.map((block) => (
          <div
            key={block.key}
            className="wordcloud-block"
            style={{
              left: `${block.left}px`,
              top: `${block.top}px`,
              width: `${block.width}px`,
              height: `${block.height}px`,
              backgroundColor: occupiedKeys.has(block.key) ? "#00a0e9" : "#ffffff",
            }}
          />
        ))}
      {items.map((item) => (
        <span
          key={item.id}
          className="wordcloud-word"
          style={{
            left: `${item.left}px`,
            top: `${item.top}px`,
            fontSize: `${item.fontSize}px`,
            fontFamily: item.fontFamily,
            color: item.color,
            opacity: item.opacity,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

/** 横向きのシンプルな犬イラスト（フロンターレブルー #00A0E9） */
export function DogIllustration() {
  const blue = "#00a0e9";
  const blueLight = "#cceffb";
  const bluePale = "#e8f6fd";

  return (
    <svg
      className="dog-illust"
      viewBox="0 0 96 48"
      width="80"
      height="40"
      aria-hidden="true"
      role="img"
      aria-label="犬"
    >
      <line x1="4" y1="44" x2="92" y2="44" stroke="#111" strokeWidth="2" strokeLinecap="round" />

      <path
        d="M8 28c-6-4-8 2-4 8 2 4 6 2 8-2"
        fill={blueLight}
        stroke="#111"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <rect x="22" y="32" width="8" height="12" rx="2" fill="#fff" stroke="#111" strokeWidth="2" />

      <ellipse cx="48" cy="30" rx="28" ry="14" fill={bluePale} stroke="#111" strokeWidth="2" />
      <ellipse cx="52" cy="30" rx="18" ry="8" fill="#fff" opacity="0.85" />

      <rect x="68" y="32" width="8" height="12" rx="2" fill="#fff" stroke="#111" strokeWidth="2" />

      <path d="M68 24c8-6 14-4 16 2" fill="none" stroke="#111" strokeWidth="2" />

      <ellipse cx="76" cy="22" rx="14" ry="12" fill="#fff" stroke="#111" strokeWidth="2" />

      <path
        d="M68 14c-4-6-2-10 2-8 2 4 0 6-2 4"
        fill={blue}
        stroke="#111"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <ellipse cx="90" cy="24" rx="5" ry="4" fill="#fff" stroke="#111" strokeWidth="2" />
      <circle cx="92" cy="23" r="2" fill="#111" />

      <circle cx="80" cy="20" r="2.5" fill="#111" />
      <circle cx="81" cy="19" r="0.8" fill="#fff" />

      <path
        d="M86 26c2 2 4 1 4-1"
        fill="none"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M66 26c4 4 8 4 10 2"
        fill="none"
        stroke={blue}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

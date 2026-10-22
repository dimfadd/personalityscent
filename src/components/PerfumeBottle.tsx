"use client";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

/**
 * Illustrated perfume bottle (our own SVG, not a product photo).
 * The liquid is three layers, bottom to top: base, heart, top notes, so the bottle
 * doubles as the brand's note-pyramid motif. Colours come from accord colours.
 */
export type BottleShape = "classic" | "round" | "tall" | "facet";

type ShapeDef = {
  body: string;
  clip: string;
  top: number; // y of inner top
  bottom: number; // y of inner bottom
  cap: React.ReactNode;
  highlight: string;
};

const GOLD = ["#f6e3b4", "#cfa968", "#8a6a31"];

const SHAPES: Record<BottleShape, ShapeDef> = {
  classic: {
    body: "M52 118 H148 Q168 118 168 140 V282 Q168 302 148 302 H52 Q32 302 32 282 V140 Q32 118 52 118 Z",
    clip: "M56 124 H144 Q162 124 162 142 V280 Q162 296 144 296 H56 Q38 296 38 280 V142 Q38 124 56 124 Z",
    top: 124,
    bottom: 296,
    cap: <rect x="70" y="34" width="60" height="62" rx="6" />,
    highlight: "M47 146 Q43 210 47 276",
  },
  round: {
    body: "M100 128 C150 128 174 170 174 214 C174 262 142 302 100 302 C58 302 26 262 26 214 C26 170 50 128 100 128 Z",
    clip: "M100 134 C145 134 168 172 168 214 C168 258 139 296 100 296 C61 296 32 258 32 214 C32 172 55 134 100 134 Z",
    top: 134,
    bottom: 296,
    cap: <rect x="72" y="40" width="56" height="56" rx="28" />,
    highlight: "M44 180 Q36 220 50 262",
  },
  tall: {
    body: "M64 112 H136 Q150 112 150 126 V292 Q150 304 136 304 H64 Q50 304 50 292 V126 Q50 112 64 112 Z",
    clip: "M67 117 H133 Q145 117 145 129 V290 Q145 299 133 299 H67 Q55 299 55 290 V129 Q55 117 67 117 Z",
    top: 117,
    bottom: 299,
    cap: <rect x="78" y="22" width="44" height="74" rx="4" />,
    highlight: "M62 138 Q59 210 62 284",
  },
  facet: {
    body: "M60 118 H140 L172 150 V270 L140 302 H60 L28 270 V150 Z",
    clip: "M63 124 H137 L166 153 V267 L137 296 H63 L34 267 V153 Z",
    top: 124,
    bottom: 296,
    cap: <path d="M74 36 H126 L134 60 V96 H66 V60 Z" />,
    highlight: "M42 160 V262",
  },
};

export function shapeFor(key: string): BottleShape {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (["classic", "round", "tall", "facet"] as const)[h % 4];
}

export function PerfumeBottle({
  colors,
  shape = "classic",
  fill = 0.78,
  label,
  sublabel = "SCENT DNA",
  mist = false,
  shine = true,
  delay = 0,
  className = "",
  title,
}: {
  /** [base, heart, top] colours */
  colors: [string, string, string];
  shape?: BottleShape;
  /** 0..1 liquid level */
  fill?: number;
  label?: string;
  sublabel?: string;
  mist?: boolean;
  shine?: boolean;
  delay?: number;
  className?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = SHAPES[shape];
  const levelY = s.bottom - (s.bottom - s.top) * Math.max(0, Math.min(1, fill));
  const [base, heart, top] = colors;
  const fillT = { duration: reduce ? 0 : 1.6, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <svg viewBox="0 0 200 320" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={`gold${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD[0]} />
          <stop offset="50%" stopColor={GOLD[1]} />
          <stop offset="100%" stopColor={GOLD[2]} />
        </linearGradient>
        <linearGradient id={`glass${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`liq${uid}`} x1="0" y1="1" x2="0" y2="0">
          <motion.stop offset="0%" animate={{ stopColor: base }} transition={{ duration: 0.8 }} />
          <motion.stop offset="34%" animate={{ stopColor: base }} transition={{ duration: 0.8 }} />
          <motion.stop offset="50%" animate={{ stopColor: heart }} transition={{ duration: 0.8 }} />
          <motion.stop offset="66%" animate={{ stopColor: heart }} transition={{ duration: 0.8 }} />
          <motion.stop offset="84%" animate={{ stopColor: top }} transition={{ duration: 0.8 }} />
          <motion.stop offset="100%" animate={{ stopColor: top }} transition={{ duration: 0.8 }} />
        </linearGradient>
        <clipPath id={`body${uid}`}>
          <path d={s.clip} />
        </clipPath>
        <clipPath id={`level${uid}`}>
          <motion.rect x="0" width="200" height="320" initial={{ y: reduce ? levelY : s.bottom }} animate={{ y: levelY }} transition={fillT} />
        </clipPath>
        <radialGradient id={`glow${uid}`} cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor={heart} stopOpacity="0.35" />
          <stop offset="100%" stopColor={heart} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft coloured glow behind the glass */}
      <ellipse cx="100" cy="230" rx="96" ry="78" fill={`url(#glow${uid})`} />

      {/* glass body */}
      <path d={s.body} fill="rgba(255,255,255,0.05)" />
      <g clipPath={`url(#body${uid})`}>
        <g clipPath={`url(#level${uid})`}>
          <rect x="0" y={s.top} width="200" height={s.bottom - s.top} fill={`url(#liq${uid})`} opacity="0.92" />
        </g>
        {/* liquid surface */}
        <motion.rect x="20" width="160" height="2.5" rx="1.2" fill="#ffffff" opacity="0.35" initial={{ y: reduce ? levelY : s.bottom }} animate={{ y: levelY }} transition={fillT} />
        {shine && !reduce && (
          <motion.rect
            y="80"
            width="34"
            height="260"
            fill="#ffffff"
            opacity="0.12"
            transform="rotate(18 100 200)"
            initial={{ x: -120 }}
            animate={{ x: 260 }}
            transition={{ duration: 2.2, delay: delay + 1.6, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
          />
        )}
      </g>
      <path d={s.body} fill="none" stroke={`url(#glass${uid})`} strokeWidth="2.5" />
      <path d={s.highlight} fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />

      {/* neck, collar, cap */}
      <rect x="84" y="94" width="32" height="26" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
      <rect x="78" y="92" width="44" height="8" rx="2" fill={`url(#gold${uid})`} />
      <g fill={`url(#gold${uid})`}>{s.cap}</g>

      {label && (
        <g>
          <rect x="58" y="196" width="84" height="50" rx="3" fill="#0a0a0a" fillOpacity="0.62" stroke={`url(#gold${uid})`} strokeWidth="1" />
          <text x="100" y="211" textAnchor="middle" fontSize="6.5" letterSpacing="1.4" fill={GOLD[1]} fontFamily="var(--font-sans)">{sublabel}</text>
          <text x="100" y="233" textAnchor="middle" fontSize={label.length > 10 ? 12 : 16} fill="#ffffff" fontFamily="var(--font-display)">{label}</text>
        </g>
      )}

      {mist && !reduce && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.circle
              key={i}
              r={2 + (i % 3)}
              fill="#ffffff"
              initial={{ cx: 132, cy: 44, opacity: 0 }}
              animate={{ cx: [132, 160 + i * 6], cy: [44, 30 - i * 5 + (i % 2) * 14], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2.4, delay: delay + 1.8 + i * 0.25, repeat: Infinity, repeatDelay: 3.2, ease: "easeOut" }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

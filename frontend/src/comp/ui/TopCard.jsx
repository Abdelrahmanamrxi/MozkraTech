import { useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const T = {
  light: { color: "#f7ece1" }, // cream — for text on dark/purple cards
  muted: { color: "rgba(202,196,206,0.8)", fontSize: 13 }, // soft grey — for subtitles/labels
  dark: { color: "#242038" }, // primary-dark — for text on light cards
};
// ── Shared text style tokens ──────────────────────────────────────────────────
// Reused across all cards to keep typography consistent

// ── Card ─────────────────────────────────────────────────────────────────────
// Base glass card with 3 variants and a staggered entrance animation
// variant: "purple" | "dark" | "light"
// delay: ms before the card fades/slides in
export const Card = ({ children, variant, delay = 0, className }) => {
  const [visible, setVisible] = useState(false);
  // Trigger visibility after `delay` ms — drives the entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const styles = {
    purple: {
      background:
        "linear-gradient(150deg, rgba(98,74,152,0.9), rgba(144,103,198,0.65))",
      border: "1px solid rgba(141,134,201,0.35)",
    },
    dark: {
      background:
        "linear-gradient(165deg, rgba(32,28,48,0.95), rgba(74,62,118,0.75))",
      border: "1px solid rgba(141,134,201,0.3)",
    },
    light: {
      background:
        "linear-gradient(165deg, rgba(44,40,66,0.92), rgba(92,84,130,0.7))",
      border: "1px solid rgba(155,126,222,0.3)",
    },
    progressDark: {
      background: "rgba(36,32,56,0.9)",
      border: "1px solid rgba(155,126,222,0.3)",
    },
    progressSecondDark: {
      background: "rgba(36,32,56,0.9)",
      border: "1px solid rgba(124,95,189,0.3)",
    },
  };
  return (
    <div
      className={`rounded-3xl p-5 flex flex-col gap-2 transition-transform duration-500 ease-out hover:scale-[1.02] group ${className}`}
      style={{
        ...styles[variant],
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        boxShadow:
          "0 8px 32px rgba(36,32,56,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.97)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ border: "1px solid rgba(255,255,255,0.35)" }}
      />
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 55%)",
        }}
      />
      {children}
    </div>
  );
};

// ── TopCard ───────────────────────────────────────────────────────────────────
// Stat card for the top row (Streak, Goals, Achievements)
// Props:
//   icon     — SVG icon element
//   value    — animated number from useCountUp
//   extra    — optional JSX appended to value (e.g. "/10")
//   sub      — small text below value (e.g. "Days")
//   label    — bottom label (e.g. "Current Streak")
//   variant  — passed to Card
//   delay    — passed to Card for staggered entrance

const TopCard = ({ icon, value, sub, label, variant, delay, extra }) => (
  <Card variant={variant} delay={delay}>
    <div className="flex items-start gap-3">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1">
        <div
          className="text-base lg:text-lg font-semibold w-full"
          style={{ ...T.light }}
        >
          {value}
          {extra}
        </div>
        <div className="text-xs font-semibold mt-1" style={{ ...T.muted }}>
          {sub}
        </div>
      </div>
    </div>
    <div style={T.muted} className="mt-2">
      {label}
    </div>
  </Card>
);
export default TopCard;

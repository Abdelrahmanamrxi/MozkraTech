import { useEffect,useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const T = {
  light: { color: "#f7ece1" }, // cream — for text on dark/purple cards
  muted: { color: "rgba(202,196,206,0.8)", fontSize: 13 },// soft grey — for subtitles/labels 
  dark:  { color: "#242038" },  // primary-dark — for text on light cards 
};
// ── Shared text style tokens ──────────────────────────────────────────────────
// Reused across all cards to keep typography consistent



// ── Card ─────────────────────────────────────────────────────────────────────
// Base glass card with 3 variants and a staggered entrance animation
// variant: "purple" | "dark" | "light"
// delay: ms before the card fades/slides in
export const Card = ({ children, variant, delay = 0, className  }) => {
  const [visible, setVisible] = useState(false);
    // Trigger visibility after `delay` ms — drives the entrance animation
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const styles = {
    purple: { background: "rgba(144,103,198,0.45)",                                                  border: "1px solid rgba(141,134,201,0.3)" },
    dark:   { background: "linear-gradient(180deg, rgba(36,32,56,0.9), rgba(144,103,198,0.75))",     border: "1px solid rgba(141,134,201,0.25)" },
    light:  { background: "linear-gradient(135deg, rgba(220,214,230,0.65), rgba(180,170,220,0.45))", border: "1px solid rgba(255,255,255,0.3)" },
    progressDark: { background: "rgba(36,32,56,0.9)", border: "1px solid rgba(155,126,222,0.3)" },
    progressSecondDark: { background: "rgba(36,32,56,0.9)", border: "1px solid rgba(124,95,189,0.3)" }
  };
  return (
    <div className={`rounded-3xl p-5 flex flex-col gap-1 ${className}`} style={{
      ...styles[variant], backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
      boxShadow: "0 8px 32px rgba(36,32,56,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>{children}</div>
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
      <div className="flex lg:flex-row flex-col items-center gap-3">
        {icon}
        <div>
            {/* Main stat number + optional suffix */}
          <div className="text-lg font-semibold w-full text-center lg:text-start"  style={{ ...T.light }}>{value}{extra}</div>
           {/* Sub-label e.g. "Days" / "earned" */}
          <div className=" font-semibold">{sub}</div>
        </div>
      </div>
          {/* Bottom descriptor e.g. "Current Streak" */}
      <div  style={T.muted} className="mt-2">{label}</div>
    </Card>
  );
  export default TopCard
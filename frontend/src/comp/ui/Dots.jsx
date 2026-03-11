import { useState, useEffect } from "react";

const Dots = ({ done, total, delay = 0 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="rounded-full" style={{
          width: 11, height: 11,
          background: i < done ? "rgba(144,103,198,0.9)" : "white",
          boxShadow: i < done ? "0 0 6px rgba(144,103,198,0.5)" : "none",
          transform: mounted ? "scale(1)" : "scale(0)",
          transition: `all 0.3s ease ${i * 55}ms`,
        }} />
      ))}
    </div>
  );
};

export default Dots;
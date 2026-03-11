import { useState,useEffect } from "react";
// ─── useCountUp.js ───────────────────────────────────────────────────────────
// Animates a number from 0 to `target` over ~75 frames (≈1.2s)
// `delay` postpones the start in ms — useful for staggered card entrances

const useCountUp = (target, delay = 0) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const end = parseFloat(target), step = end / 75;
      let cur = 0;
      const i = setInterval(() => { cur = Math.min(cur + step, end); setVal(parseInt(cur.toFixed(1))); if (cur >= end) clearInterval(i); }, 16);
      return () => clearInterval(i);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
};
export default useCountUp
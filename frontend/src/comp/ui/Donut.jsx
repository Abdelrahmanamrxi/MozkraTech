import { useState,useEffect } from "react";



const Donut = ({ pct }) => {
  const [anim, setAnim] = useState(0);
  const r = 36, circ = 2 * Math.PI * r;
  useEffect(() => {
    let n = 0;
    const t = setTimeout(() => { const i = setInterval(() => { n = Math.min(n + 2, pct); setAnim(n); if (n >= pct) clearInterval(i); }, 16); return () => clearInterval(i); }, 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={44} cy={44} r={r} fill="none" stroke="white" strokeWidth={10} />
      <circle cx={44} cy={44} r={r} fill="none" stroke="#9067c6" strokeWidth={10} strokeDasharray={circ} strokeDashoffset={circ - (anim / 100) * circ} strokeLinecap="round" transform="rotate(-90 44 44)" style={{ transition: "stroke-dashoffset 0.05s linear" }} />
      <text x={44} y={40} textAnchor="middle" fill="#242038" fontSize={9} fontFamily="Poppins,sans-serif">Status</text>
      <text x={44} y={52} textAnchor="middle" fill="#242038" fontSize={11} fontWeight="700" fontFamily="Poppins,sans-serif">{anim}%</text>
    </svg>
  );
};
export default Donut
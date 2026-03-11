import { useState, useEffect } from "react";

const ProgressBar = ({ value, max, delay = 700 }) => {
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW((value / max) * 100), delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);

  return (
    <div className="w-full rounded-full mt-3 overflow-hidden" style={{ height: 8, background: 'white' }}>
      <div className="bg-primary" style={{
        width: `${w}%`, height: "100%", borderRadius: 99,
       
        transition: "width 1.4s cubic-bezier(.4,0,.2,1)"
      }} />
    </div>
  );
};

export default ProgressBar;
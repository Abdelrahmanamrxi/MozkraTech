/* eslint-disable no-unused-vars */
/**
 * TransformSection — React Bits components used:
 *  • StarBorder (Components) — CTA button wrapped in animated star-trail border
 *  • ClickSpark (Animations) — sparkles burst on button click
 *  • ScrollReveal (TextAnimations) — description text animates word-by-word on scroll
 */
import { useRef, useState } from "react";
import { Link } from "react-router-dom"; // Added link router integration
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bot } from "lucide-react";
import useTypewriter from "../../../hooks/useTypewriter.jsx";

// ─── React Bits: StarBorder ──────────────────────────────────────────────
function StarBorder({
  children,
  color = "#9067C6",
  speed = "4s",
  className = "",
}) {
  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        borderRadius: 32,
        overflow: "hidden",
        padding: "1.5px",
        background: "transparent",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: "-100%",
          borderRadius: "inherit",
          background: `conic-gradient(from 0deg, transparent 0 300deg, ${color} 360deg)`,
          animation: `starSpin ${speed} linear infinite`,
        }}
      />
      <style>{`@keyframes starSpin { to { transform: rotate(360deg); } }`}</style>
      <span
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 31,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14111f",
          overflow: "hidden",
        }}
      >
        {children}
      </span>
    </span>
  );
}

// ─── React Bits: ClickSpark ──────────────────────────────────────────────
function ClickSpark({
  children,
  sparkColor = "#c4a0e8",
  sparkSize = 12,
  sparkCount = 12,
  duration = 600,
  className = "",
}) {
  const [sparks, setSparks] = useState([]);

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      id: `${id}-${i}`,
      x,
      y,
      angle: (360 / sparkCount) * i,
    }));
    setSparks((s) => [...s, ...newSparks]);
    setTimeout(
      () =>
        setSparks((s) =>
          s.filter((sp) => !newSparks.some((n) => n.id === sp.id)),
        ),
      duration,
    );
  }

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {children}
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          initial={{ x: spark.x, y: spark.y, opacity: 1, scale: 1 }}
          animate={{
            x:
              spark.x + Math.cos((spark.angle * Math.PI) / 180) * sparkSize * 5,
            y:
              spark.y + Math.sin((spark.angle * Math.PI) / 180) * sparkSize * 5,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: duration / 1000, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: sparkSize / 2,
            height: sparkSize / 2,
            borderRadius: "50%",
            background: sparkColor,
            pointerEvents: "none",
            top: 0,
            left: 0,
          }}
        />
      ))}
    </span>
  );
}

// ─── React Bits: ScrollReveal ─────────────────────────────────────────────
function ScrollReveal({
  text,
  className = "",
  revealDistance = 15,
  revealDelay = 0.03,
  duration = 0.45,
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.1, y: revealDistance }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration,
            delay: i * revealDelay,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Minimalist Typography Section ─────────────────
export default function TransformSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { t } = useTranslation();

  const headingText =
    t("transform_section.heading") || "Transform Your Workflow Faster.";
  const { displayed, done } = useTypewriter(headingText, 55, 500);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[60vh] flex items-center bg-[#14111f] overflow-hidden py-24 px-6 lg:px-24"
    >
      {/* 2-Column Grid keeping text element and Bot module totally separated */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        {/* Left Interactive Content Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 lg:gap-8 order-2 lg:order-1">
          {/* Typewriter Title Header */}
          <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.1]">
            {displayed}
            {!done && (
              <motion.span
                className="inline-block w-[4px] h-[0.85em] bg-[#9067C6] align-middle ml-1.5 rounded-sm"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            )}
          </h2>

          {/* Word Reveal Description Copy */}
          <p className="font-blinker text-[#f7ece1]/75 text-lg lg:text-2xl leading-relaxed tracking-wide font-normal max-w-2xl">
            <ScrollReveal
              text={
                t("transform_section.description") ||
                "Engineered for teams seeking absolute speed. Eliminate manual configurations and orchestrate architecture instantly."
              }
              revealDelay={0.03}
              duration={0.5}
            />
          </p>

          {/* Interactive Action Node */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4"
          >
            <ClickSpark
              sparkColor="#c4a0e8"
              sparkSize={12}
              sparkCount={14}
              duration={600}
            >
              <StarBorder color="#9067C6" speed="2.8s">
                {/* Router Link wrapper safely binding button event pipeline */}
                <Link
                  to="/signup"
                  className="no-underline decoration-transparent"
                >
                  <motion.button
                    whileHover="hover"
                    whileTap={{ scale: 0.97 }}
                    initial="rest"
                    animate="rest"
                    className="relative flex items-center gap-4 px-10 py-4.5 cursor-pointer text-white font-sans font-bold text-base tracking-wider rounded-[30px] border-0 bg-[#9067C6]/10 transition-all duration-300 hover:bg-[#9067C6]/20"
                  >
                    <motion.span
                      variants={{ rest: { x: 0 }, hover: { x: -3 } }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      {t("transform_section.button") || "Initialize Engine"}
                    </motion.span>
                    <motion.svg
                      width="22"
                      height="12"
                      viewBox="0 0 22 12"
                      fill="none"
                      variants={{ rest: { x: 0 }, hover: { x: 5 } }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 22,
                      }}
                    >
                      <path
                        d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989593 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75H21V5.25H0V6.75Z"
                        fill="white"
                      />
                    </motion.svg>
                  </motion.button>
                </Link>
              </StarBorder>
            </ClickSpark>
          </motion.div>
        </div>

        {/* Right Isolated Column: Dedicated exclusively to the Lucide Bot Component */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end w-full order-1 lg:order-2">
          <div className="w-full max-w-[240px] sm:max-w-[300px] lg:max-w-full aspect-square text-[#9067C6] opacity-30 select-none pointer-events-none flex items-center justify-center">
            <Bot
              className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(144,103,198,0.15)]"
              strokeWidth={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

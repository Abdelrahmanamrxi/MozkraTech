/* eslint-disable no-unused-vars */
/**
 * Features — React Bits components used:
 *  • DotField (Backgrounds) — interactive dot matrix array with drift and dynamic hover tracking
 *  • AnimatedContent (Animations) — section header fades in smoothly
 *  • GradientText (TextAnimations) — section title gets a moving gradient sweep
 *  • 3D Endless Stack Carousel (Components) — infinite looping perspective layout
 */
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Zap, MessageSquare } from "lucide-react";
import AiImage from "@/assets/ai.svg";
import analytics from "@/assets/analytics.svg";
import group from "@/assets/group.svg";
import schedule from "@/assets/schedule.svg";
import timer from "@/assets/timer.svg";

// ─── React Bits: Animated Dot Field Background Component ─────────────────
function DotField({
  dotRadius = 1.5,
  dotSpacing = 16,
  gradientFrom = "rgba(144, 103, 198, 0.45)",
  gradientTo = "rgba(255, 255, 255, 0.15)",
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("resize", handleResize);

    const parentSection = canvas.closest("section");
    if (parentSection) {
      parentSection.addEventListener("mousemove", handleMouseMove);
    }

    const drawDots = () => {
      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.008;

      const cols = Math.floor(width / dotSpacing) + 1;
      const rows = Math.floor(height / dotSpacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const waveX = Math.sin(timeRef.current + r * 0.3) * 2;
          const waveY = Math.cos(timeRef.current + c * 0.3) * 2;

          const baseX = c * dotSpacing + waveX;
          const baseY = r * dotSpacing + waveY;

          const dx = mouseRef.current.x - baseX;
          const dy = mouseRef.current.y - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let renderX = baseX;
          let renderY = baseY;

          if (dist < 150) {
            const force = ((150 - dist) / 150) * 9;
            renderX -= (dx / dist) * force;
            renderY -= (dy / dist) * force;
          }

          const ratio = (c + r) / (cols + rows);
          ctx.fillStyle = ratio > 0.5 ? gradientTo : gradientFrom;

          ctx.beginPath();
          ctx.arc(renderX, renderY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(drawDots);
    };

    drawDots();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parentSection) {
        parentSection.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotRadius, dotSpacing, gradientFrom, gradientTo]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── React Bits: GradientText ────────────────────────────────────────────
function GradientText({
  children,
  className = "",
  colors = ["#9067C6", "#c4a0e8", "#9067C6"],
  animationSpeed = 5,
}) {
  const gradient = `linear-gradient(to right, ${colors.join(", ")})`;
  return (
    <span
      className={className}
      style={{
        background: gradient,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: `gradientMove ${animationSpeed}s linear infinite`,
        display: "inline-block",
      }}
    >
      {children}
      <style>{`@keyframes gradientMove { 0%{background-position:0% center} 100%{background-position:200% center} }`}</style>
    </span>
  );
}

// ─── React Bits: AnimatedContent ─────────────────────────────────────────
function AnimatedContent({
  children,
  distance = 40,
  direction = "vertical",
  delay = 0,
  duration = 0.6,
  ease = [0.22, 1, 0.36, 1],
  initialOpacity = 0,
  className = "",
}) {
  const from =
    direction === "vertical"
      ? { opacity: initialOpacity, y: distance }
      : { opacity: initialOpacity, x: distance };
  const to =
    direction === "vertical" ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 };

  return (
    <motion.div
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Features Section ────────────────────────────────────────────────────
export default function Features({ featureRef }) {
  const { t } = useTranslation();
  const icons = [
    AiImage,
    analytics,
    Zap,
    group,
    schedule,
    timer,
    MessageSquare,
  ];
  const cards = t("features.cards", { returnObjects: true }) || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Adjusted baseline dimension configurations to support robust layouts
  const baseCardWidth = 380;
  const baseCardHeight = 330;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <section
      ref={featureRef}
      className="relative w-full py-24 px-6 lg:px-16 overflow-hidden bg-[#181524]"
    >
      {/* Background Matrix Element */}
      <div className="absolute inset-0 z-0 opacity-50 transition-opacity duration-500 hover:opacity-75">
        <DotField dotRadius={1.7} dotSpacing={18} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(24,21,36,0.95) 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center gap-12">
        {/* Header Block */}
        <div className="flex flex-col items-center gap-4 text-center">
          <AnimatedContent distance={24} delay={0.05}>
            <h2 className="font-sans font-bold text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              <GradientText
                colors={["#ffffff", "#9067c6", "#cac4ce", "#ffffff"]}
                animationSpeed={6}
              >
                {t("features.title")} !
              </GradientText>
            </h2>
          </AnimatedContent>
          <AnimatedContent distance={20} delay={0.12}>
            <p className="font-blinker text-[#f7ece1]/70 text-base max-w-md leading-relaxed">
              {t("features.description")}
            </p>
          </AnimatedContent>
        </div>

        {/* ─── Endless 3D Stack Carousel Viewport ─── */}
        <div className="relative w-full flex flex-col items-center select-none mt-2">
          <div
            className="relative flex items-center justify-center overflow-visible w-full"
            style={{ height: `${baseCardHeight + 20}px` }}
          >
            <AnimatePresence mode="popLayout">
              {cards.map((card, index) => {
                let offset = index - currentIndex;
                const total = cards.length;

                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const absOffset = Math.abs(offset);

                if (absOffset > 2) return null;

                const isActive = offset === 0;
                const xOffsetPosition = offset * (baseCardWidth * 0.58);
                const layerZIndex = 10 - absOffset;
                const dynamicScale = isActive ? 1 : 0.85 - absOffset * 0.06;
                const perspectiveRotationY = offset * -15;
                const opacityWeight = isActive ? 1 : 0.4 / absOffset;

                const CurrentIcon = icons[index];
                const isComponentIcon = typeof CurrentIcon !== "string";

                return (
                  <motion.div
                    key={index}
                    style={{
                      width: `${baseCardWidth}px`,
                      height: `${baseCardHeight}px`,
                      zIndex: layerZIndex,
                      transformOrigin: "center center",
                    }}
                    className="absolute left-1/2 top-0 flex flex-col justify-between p-8 rounded-3xl cursor-pointer bg-[#221c33] border border-[#352d4e] overflow-hidden"
                    initial={{ opacity: 0, scale: 0.7, x: offset * 220 }}
                    animate={{
                      opacity: opacityWeight,
                      scale: dynamicScale,
                      x: `calc(-50% + ${xOffsetPosition}px)`,
                      rotateY: perspectiveRotationY,
                      borderColor: isActive ? "#9067c6" : "#352d4e",
                      boxShadow: isActive
                        ? "0 25px 50px -12px rgba(144,103,198,0.3), 0 15px 35px -15px rgba(0,0,0,0.8)"
                        : "0 10px 20px -10px rgba(0,0,0,0.6)",
                    }}
                    whileHover={
                      isActive
                        ? {
                            y: -6,
                            borderColor: "#8d86c9",
                            boxShadow:
                              "0 30px 60px -10px rgba(144,103,198,0.4), 0 15px 35px -12px rgba(0,0,0,0.9)",
                          }
                        : {}
                    }
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {/* Giant Low-Opacity Background Icon Watermark */}
                    <div className="absolute right-[-15px] bottom-[-15px] w-48 h-48 pointer-events-none z-0 transition-all duration-300 opacity-[0.1] grayscale brightness-150 group-hover:scale-105">
                      {isComponentIcon ? (
                        <CurrentIcon className="w-full h-full text-white stroke-[1.5]" />
                      ) : (
                        <img
                          className="w-full h-full object-contain invert brightness-200 contrast-200"
                          src={CurrentIcon}
                          alt=""
                        />
                      )}
                    </div>

                    {/* Top perimeter accent line */}
                    {isActive && (
                      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-right from-transparent via-[#9067c6]/50 to-transparent blur-sm pointer-events-none" />
                    )}

                    {/* Foreground Content Stack */}
                    <div className="relative z-10 flex flex-col justify-start h-full w-full gap-5">
                      {/* Scaled Up Header Title */}
                      <h3 className="font-sans font-black text-white text-3xl lg:text-4xl tracking-wide leading-tight">
                        {card.header}
                      </h3>

                      {/* Scaled Text Block perfectly filling space */}
                      <p className="font-blinker text-[#f7ece1]/90 text-xl lg:text-2xl font-normal leading-relaxed tracking-wide">
                        {card.paragraph}
                      </p>
                    </div>

                    {/* Micro position index context node */}
                    <div
                      className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full transition-colors duration-300 z-10"
                      style={{
                        backgroundColor: isActive ? "#9067c6" : "#352d4e",
                      }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Control Node Array */}
          <div className="flex items-center gap-6 mt-6 z-20">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-[#221c33] border border-[#352d4e] text-white hover:bg-[#2d2544] hover:border-[#9067c6] active:scale-95 transition-all duration-200"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-xs text-[#f7ece1]/40 font-mono tracking-widest font-semibold bg-[#221c33]/40 px-4 py-1.5 rounded-full border border-[#352d4e]/30">
              {currentIndex + 1} / {cards.length}
            </div>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-[#221c33] border border-[#352d4e] text-white hover:bg-[#2d2544] hover:border-[#9067c6] active:scale-95 transition-all duration-200"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

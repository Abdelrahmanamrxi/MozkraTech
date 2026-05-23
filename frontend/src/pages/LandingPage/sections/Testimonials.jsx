/* eslint-disable no-unused-vars */
/**
 * Testimonials Section (Student Theme)
 * Eye-Catching React Bits Upgrades:
 *  • Background: Fully dynamic 3D Cosmic Constellation Node Canvas Matrix with magnetic cursor pull.
 *  • Title: Staggered character cascade rendering with an explicit soft glow text shadow.
 *  • Card Panels: Glassmorphism layout with animated border trails.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";

// ─── React Bits: Interactive 3D Cosmic Constellation Matrix ──────────────
function CosmicMatrix({ nodeCount = 70 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: null,
    y: null,
    targetRadius: 160,
    currentRadius: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Generate physical mathematical coordinate vectors for our nodes
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: 0,
      baseY: 0,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      angle: Math.random() * Math.PI * 2,
    }));

    // Intuitively cache initial placement maps on sizing changes
    nodes.forEach((n) => {
      n.baseX = n.x;
      n.baseY = n.y;
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      // Smoothly expand mouse influence radius on native activation
      mouseRef.current.currentRadius = mouseRef.current.targetRadius;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
      mouseRef.current.currentRadius = 0;
    };

    window.addEventListener("resize", handleResize);
    const parentSection = canvas.closest("section");
    if (parentSection) {
      parentSection.addEventListener("mousemove", handleMouseMove);
      parentSection.addEventListener("mouseleave", handleMouseLeave);
    }

    const runEngineLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Loop over nodes to map vectors and tracking filaments
      nodes.forEach((node, idx) => {
        // Drift position increments
        node.x += node.speedX;
        node.y += node.speedY;

        // Mathematical sine pulse for individual node breathing glows
        node.angle += node.pulseSpeed;
        const structuralAlpha = 0.3 + Math.sin(node.angle) * 0.3;

        // Native screen edge protection limits
        if (node.x < 0 || node.x > width) node.speedX *= -1;
        if (node.y < 0 || node.y > height) node.speedY *= -1;

        let drawX = node.x;
        let drawY = node.y;

        // Interactive gravity computations
        if (mouseRef.current.x !== null) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRef.current.currentRadius) {
            const pullForce =
              (mouseRef.current.currentRadius - distance) /
              mouseRef.current.currentRadius;
            // Pull points organically toward the mouse vector
            drawX += (dx / distance) * pullForce * 28;
            drawY += (dy / distance) * pullForce * 28;
          }
        }

        // Draw individual core element node
        ctx.fillStyle = `rgba(144, 103, 198, ${structuralAlpha + 0.3})`;
        ctx.shadowBlur = node.size * 4;
        ctx.shadowColor = "#9067c6";
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Clear shadow cache instantly to optimize pipeline frame drop metrics

        // Draw networking filaments linking local nearby vectors
        for (let j = idx + 1; j < nodes.length; j++) {
          const other = nodes[j];

          // Compute distance profiles dynamically under live warp tracking
          let oX = other.x;
          let oY = other.y;
          if (mouseRef.current.x !== null) {
            const odx = mouseRef.current.x - other.x;
            const ody = mouseRef.current.y - other.y;
            const oDist = Math.sqrt(odx * odx + ody * ody);
            if (oDist < mouseRef.current.currentRadius) {
              const oPull =
                (mouseRef.current.currentRadius - oDist) /
                mouseRef.current.currentRadius;
              oX += (odx / oDist) * oPull * 28;
              oY += (ody / oDist) * oPull * 28;
            }
          }

          const fdx = drawX - oX;
          const fdy = drawY - oY;
          const filamentDist = Math.sqrt(fdx * fdx + fdy * fdy);

          if (filamentDist < 95) {
            const linkAlpha = (1 - filamentDist / 95) * 0.14;
            ctx.strokeStyle = `rgba(144, 103, 198, ${linkAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(oX, oY);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(runEngineLoop);
    };

    runEngineLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parentSection) {
        parentSection.removeEventListener("mousemove", handleMouseMove);
        parentSection.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, [nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ─── React Bits: Glowing Character Cascade Title ────────────────────────
function CascadingTitle({ text, className = "" }) {
  const characters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 180, damping: 12 },
    },
  };

  return (
    <motion.h2
      className={`font-sans font-black text-4xl lg:text-5xl text-white tracking-tight leading-tight flex flex-wrap justify-center drop-shadow-[0_0_20px_rgba(144,103,198,0.35)] ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          className="bg-gradient-to-b from-white via-[#f7ece1] to-[#9067c6] bg-clip-text text-transparent"
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
}

// ─── React Bits: AnimatedContent Wrapper ─────────────────────────────────
function AnimatedContent({ children, distance = 30, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Testimonials Component ──────────────────────────────────────────────
export default function Testimonials({ testimonialRef }) {
  const { t } = useTranslation();
  const reviews = t("testimonials.reviews", { returnObjects: true });
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultReviews = [
    {
      quote:
        "Balancing five subjects and a part-time job used to crush me. This app automatically breaks down my massive assignments into tiny, manageable daily tasks.",
      name: "Sarah Jenkins",
      role: "Sophomore, Biomedical Science",
    },
    {
      quote:
        "I used to waste hours setting up Notion templates. Having an AI that automatically builds a realistic study plan around my exam dates changed everything.",
      name: "Alex Rivera",
      role: "Freshman, Computer Science",
    },
    {
      quote:
        "I am a chronic procrastinator, but the smart adaptivity feature here keeps me accountable. When I missed a deadline, the AI instantly recalculated my week.",
      name: "Elena Rostova",
      role: "Final Year Law Student",
    },
  ];

  const activeReviews =
    Array.isArray(reviews) && reviews.length > 0 ? reviews : defaultReviews;

  const avatarColors = [
    "from-[#9067c6] to-[#352d4e]",
    "from-[#352d4e] to-[#221c33]",
    "from-[#9067c6] to-[#221c33]",
  ];

  return (
    <section
      ref={testimonialRef}
      className="relative w-full py-28 px-6 lg:px-16 overflow-hidden bg-[#181524] border-t border-[#221c33]"
    >
      {/* 3D High-Performance Cosmic Engine Component */}
      <CosmicMatrix nodeCount={65} />

      {/* Layered Color Blurring Ambient Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-30%] left-[-15%] w-[850px] h-[850px] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.24] animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(144, 103, 198, 0.5) 0%, transparent 70%)",
            animationDuration: "12s",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full mix-blend-screen filter blur-[130px] opacity-[0.16]"
          style={{
            background: "radial-gradient(circle, #352d4e 0%, transparent 70%)",
          }}
        />
        {/* Soft edge ambient mask */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 30%, rgba(24,21,36,0.9) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-20">
        {/* Header Block */}
        <div className="flex flex-col items-center gap-5 text-center">
          <CascadingTitle
            text={t("testimonials.title") || "What Our Students Say"}
          />

          <AnimatedContent distance={15} delay={0.3}>
            <p className="font-blinker text-[#f7ece1]/60 text-base lg:text-lg max-w-xl leading-relaxed">
              {t("testimonials.description")}
            </p>
          </AnimatedContent>
        </div>

        {/* Dynamic Display Area Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center min-h-[300px]">
          {/* Left Side: Selected Quote Glassmorphic Canvas Panel */}
          <div className="md:col-span-7 flex flex-col justify-center bg-[#221c33]/70 backdrop-blur-xl border border-[#352d4e] rounded-3xl p-8 lg:p-12 relative min-h-[260px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] group overflow-hidden">
            {/* Soft shifting neon upper border accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9067c6]/60 to-transparent blur-sm transform scale-x-75 group-hover:scale-x-100 transition-transform duration-700 pointer-events-none" />

            <Quote className="absolute top-8 left-8 w-14 h-14 text-[#9067c6]/10 stroke-[2] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -16, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col gap-6 relative z-10"
              >
                <p className="font-sans font-medium text-[#f7ece1] text-lg lg:text-xl leading-relaxed italic">
                  "{activeReviews[activeIndex]?.quote}"
                </p>
                <div>
                  <h4 className="font-sans font-extrabold text-white text-base lg:text-lg tracking-wide">
                    {activeReviews[activeIndex]?.name}
                  </h4>
                  <p className="font-blinker text-[#9067c6] text-sm font-medium tracking-wider uppercase mt-1">
                    {activeReviews[activeIndex]?.role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Selection Array Interactive Click Nodes */}
          <div className="md:col-span-5 flex md:flex-col flex-row justify-center items-center gap-4 md:gap-5 w-full">
            {activeReviews.map((review, idx) => {
              const isSelected = idx === activeIndex;
              const initials = review.name
                ? review.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "S";

              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9067c6] rounded-2xl"
                  aria-label={`View feedback from ${review.name}`}
                >
                  <motion.div
                    animate={{
                      backgroundColor: isSelected
                        ? "rgba(45, 37, 68, 0.8)"
                        : "rgba(34, 28, 51, 0.4)",
                      borderColor: isSelected
                        ? "#9067c6"
                        : "rgba(53, 45, 78, 0.4)",
                      x: isSelected ? 14 : 0,
                      boxShadow: isSelected
                        ? "0 15px 35px -12px rgba(144,103,198,0.35)"
                        : "none",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    whileHover={{ scale: isSelected ? 1.01 : 1.03 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-md cursor-pointer transition-shadow w-full"
                  >
                    {/* User Avatar Circle Node */}
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl shrink-0 font-sans font-black text-white text-sm bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} shadow-inner`}
                    >
                      {initials}
                      {/* Active Ring State Micro Node Overlay */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeAvatarRing"
                          className="absolute inset-[-4px] rounded-xl border-2 border-[#9067c6] pointer-events-none"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 18,
                          }}
                        />
                      )}
                    </div>

                    {/* Meta Identifiers Mini-Text Stack */}
                    <div className="hidden sm:flex flex-col pointer-events-none overflow-hidden">
                      <span
                        className={`font-sans font-black text-sm tracking-wide transition-colors duration-300 ${isSelected ? "text-white" : "text-[#f7ece1]/70"}`}
                      >
                        {review.name}
                      </span>
                      <span className="font-blinker text-xs text-[#f7ece1]/40 truncate max-w-[190px] mt-0.5">
                        {review.role}
                      </span>
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

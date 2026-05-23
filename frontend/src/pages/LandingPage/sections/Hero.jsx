/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router";
import useTypewriter from "../../../hooks/useTypewriter.jsx";
import { useTranslation } from "react-i18next";
import Image from "@/assets/image1.jpeg";

/**
 * HERO — Split diagonal layout
 * Left: full-height text column with large typography stacked vertically
 * Right: image inside a skewed container that bleeds to the edge
 * Background: deep navy with a large faded circle bloom behind the image
 */
export default function Hero() {
  const { t } = useTranslation();
  const word = t("hero.word");
  const { displayed, done } = useTypewriter(word, 45, 700);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
    },
  });

  return (
    <section className="main-background min-h-screen relative overflow-hidden flex items-stretch">
      {/* ── Decorative radial bloom ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          top: "5%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(144,103,198,0.22) 0%, transparent 68%)",
        }}
      />
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── LEFT column ── */}
      <div className="relative z-10 flex flex-col justify-center lg:w-[52%] w-full px-8 lg:px-20 py-28 gap-8">
        {/* Eyebrow badge */}
        <motion.div
          variants={fadeUp(0.05)}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3 w-fit"
        >
          <span className="font-blinker text-xs uppercase tracking-[0.2em] text-white/50 border border-white/10 rounded-full px-4 py-1.5">
            {t("ai_section.title")}
          </span>
          <span className="w-8 h-px bg-primary/60" />
        </motion.div>

        {/* Giant heading — stacked lines */}
        <div className="flex flex-col gap-1">
          <motion.h1
            variants={fadeUp(0.12)}
            initial="hidden"
            animate="show"
            className="font-sans font-bold text-white leading-[1.0] text-[clamp(52px,8vw,96px)] tracking-tight"
          >
            {t("hero.title", { word: "" })}
          </motion.h1>
          <motion.h1
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="show"
            className="font-sans font-bold leading-[1.0] text-[clamp(52px,8vw,96px)] tracking-tight text-primary"
          >
            {displayed}
            {!done && (
              <motion.span
                className="inline-block w-[4px] h-[0.82em] bg-primary align-middle ml-1 rounded-sm"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.65, repeat: Infinity }}
              />
            )}
          </motion.h1>
        </div>

        {/* Description */}
        <motion.p
          variants={fadeUp(0.28)}
          initial="hidden"
          animate="show"
          className="font-blinker text-white/55 text-lg leading-relaxed max-w-md"
        >
          {t("hero.description")}
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={fadeUp(0.36)}
          initial="hidden"
          animate="show"
          className="flex items-center gap-5 flex-wrap"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{
                y: -3,
                boxShadow: "0 12px 36px rgba(144,103,198,0.55)",
              }}
              whileTap={{ scale: 0.96 }}
              className="bg-primary hover:bg-primary-dark transition-colors text-white font-sans font-semibold px-8 py-3.5 rounded-2xl text-base cursor-pointer border border-white/10"
            >
              {t("hero.cta")}
            </motion.button>
          </Link>
          <span className="font-blinker text-white/30 text-sm">
            {t("hero.right")}
          </span>
          <span className="hidden lg:block w-px h-5 bg-white/10" />
          <span className="font-blinker text-white/30 text-sm">
            {t("hero.left")}
          </span>
        </motion.div>

        {/* Horizontal rule accent */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px bg-primary/40"
        />
      </div>

      {/* ── RIGHT — image with skewed clip ── */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="hidden lg:block lg:w-[48%] relative"
        style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      >
        <img
          src={Image}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.55) saturate(0.8)" }}
        />
        {/* Purple tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,27,52,0.7) 0%, rgba(144,103,198,0.18) 100%)",
          }}
        />
      </motion.div>
    </section>
  );
}

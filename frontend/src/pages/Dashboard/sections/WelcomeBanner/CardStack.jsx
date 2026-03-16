// Single CardStack used for both mobile (scaled down) and desktop (full size)
// eslint-disable-next-line no-unused-vars
import {motion} from 'framer-motion'
import { StreakIcon } from '@/comp/ui/Icons';

const Gloss = () => (
  <span aria-hidden className="absolute top-0 left-[8%] w-[84%] h-[35%] rounded-full pointer-events-none"
    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)" }} />
);

const CardStack = ({ scale = 1, className = "" ,mockUserData}) => {

const glassBase = () => ({
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
  backdropFilter: "blur(8px) saturate(1.2)",
  WebkitBackdropFilter: "blur(8px) saturate(1.2)",
});

const cardAnim = (delay = 0) => ({
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring", stiffness: 300, damping: 24, delay },
  whileHover: { scale: 1.03, y: -3, transition: { type: "spring", stiffness: 400, damping: 18 } },
});


  const W = Math.round(310 * scale);
  const H = Math.round(400 * scale);

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: W, height: H }}>
      <div style={{ width: 310, height: 400, transform: `scale(${scale})`, transformOrigin: "top right" }}>

        {/* Card 1 — Weekly Streak */}
        <motion.div
          {...cardAnim(0)}
          className="absolute top-0 left-0 z-10 w-55 overflow-hidden rounded-3xl border border-white/10 p-4"
          style={{ background: "rgba(144, 103, 198, 0.82)", ...glassBase() }}
        >
          <Gloss />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5">
              <StreakIcon />
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: "Blinker, sans-serif" }}>
              Weekly Streak
            </span>
          </div>
          <div className="text-center py-2">
            <p className="text-white text-xl  font-semibold" style={{ fontFamily: "Blinker, sans-serif" }}>
             
            {mockUserData.streak} Days
            </p>
            <p className="text-white/80 text-base mb-3 " style={{ fontFamily: "Blinker, sans-serif" }}>Keep it going! 🔥</p>
          </div>
        </motion.div>

        {/* Card 2 — Next Up */}
        <motion.div
          {...cardAnim(0.14)}
          className="absolute top-34 right-0 z-20 w-48 overflow-hidden rounded-3xl border border-white/10 p-5"
          style={{ background: "rgba(141, 134, 201, 0.82)", ...glassBase() }}
        >
          <Gloss />
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ fontFamily: "Blinker, sans-serif" }}>Next Up</p>
          <p className="text-white text-lg font-bold leading-tight" style={{ fontFamily: "Blinker, sans-serif" }}>
            {mockUserData.upcomingSubject.subject} 
          </p>
          <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Blinker, sans-serif" }}>In {mockUserData.upcomingSubject.time} minutes</p>
        </motion.div>

        {/* Card 3 — Study Time */}
        <motion.div
          {...cardAnim(0.26)}
          className="absolute bottom-9 left-6 z-30 w-52 overflow-hidden rounded-3xl border border-white/10 p-5"
          style={{ background: "rgba(144, 103, 198, 0.82)", ...glassBase() }}
        >
          <Gloss />
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ fontFamily: "Blinker, sans-serif" }}>Study Time Today</p>
          <p className="text-white text-3xl font-bold" style={{ fontFamily: "Blinker, sans-serif" }}>{mockUserData.studyTimeToday} hrs</p>
          <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ delay: 0.7, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.7))" }}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};
export default CardStack
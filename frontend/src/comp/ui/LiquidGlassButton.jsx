// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


const LiquidGlassButton = ({ children, icon: Icon, onClick, className = "" }) => {
{  /**
const sizeClasses = {
  sm: "px-2 py-1 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2.5",
  lg: "px-8 py-4 text-lg gap-3",
};

    
    */}
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96, y: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`
        relative inline-flex items-center rounded-full cursor-pointer overflow-hidden
        font-[Blinker] font-semibold tracking-wide
        border border-white/20
        bg-[rgba(126,85,179,0.9)]
        backdrop-blur-xl
        shadow-[inset_0_1.5px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.15),0_8px_32px_rgba(144,103,198,0.4),0_2px_8px_rgba(0,0,0,0.2)]
        
        ${className}
      `}
    >
      {/* Top gloss */}
      <span
        aria-hidden
        className="absolute top-[1px] left-[12%] w-[76%] h-[44%] rounded-full pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.03) 100%)" }}
      />
      {/* Bottom reflection */}
      <span
        aria-hidden
        className="absolute bottom-[2px] left-[22%] w-[56%] h-[18%] rounded-full bg-white/10 pointer-events-none"
      />

      {/* Icon */}
      {Icon && (
        <motion.span
          className="relative z-10 flex drop-shadow-md"
          whileHover={{ rotate: [0, -8, 6, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon />
        </motion.span>
      )}

      {/* Label */}
      <span className="relative z-10 drop-shadow-sm whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
};
export default LiquidGlassButton
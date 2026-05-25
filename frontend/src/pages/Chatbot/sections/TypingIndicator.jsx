/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { RobotIcon } from "../../../comp/ui/Icons";
import { useTranslation } from "react-i18next";
function TypingIndicator() {
  const { t } = useTranslation("chatbot");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-end gap-2"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-black/30">
        <RobotIcon />
      </div>
      <div className="bg-[#2d2447] border border-violet-900/30 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-3 shadow-lg shadow-black/20">
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-violet-300/30 border-t-violet-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-[11px] text-violet-200/80 tracking-wide">{t("typing.label")}</span>
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-400"
              animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
export default TypingIndicator
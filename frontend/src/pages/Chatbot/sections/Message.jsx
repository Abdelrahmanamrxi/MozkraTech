/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { RobotIcon } from "../../../comp/ui/Icons";
function Message({ msg }) {
  const isAi = msg.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${!isAi ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isAi
            ? "bg-[#52466B] text-white"
            : "bg-[#52466B] text-white"
        }`}
      >
        {isAi ? <RobotIcon /> : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <div className={`flex flex-col ${!isAi ? "items-end" : ""}`}>
        <div
          className={`max-w-lg px-4 py-3 text-sm leading-relaxed ${
            isAi
              ? "bg-[#52466B] rounded-2xl rounded-bl-sm text-[#f1eeff]"
              : "bg-primary rounded-2xl rounded-br-sm text-white"
          }`}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-violet-400/60 mt-1 font-Inter">{msg.time}</span>
      </div>
    </motion.div>
  );
}
export default Message
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { RobotIcon } from "../../../comp/ui/Icons";
import { useTranslation } from "react-i18next";

function formatContent(content, isRTL) {
  const lines = content.split("\n");
  const elements = [];
  let currentParagraph = [];
  const paragraphClass = isRTL ? "mb-3 text-right" : "mb-3";
  const listClass = isRTL ? "flex gap-2 mb-2 mr-1 flex-row-reverse text-right" : "flex gap-2 mb-2 ml-1";

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // Check if line is a bullet point or numbered list
    const isBullet = /^[\*\-\•]\s/.test(trimmed);
    const isNumbered = /^\d+\.\s/.test(trimmed);
    const isListItem = isBullet || isNumbered;

    if (isListItem) {
      // Push current paragraph if exists
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`para-${idx}`} className={paragraphClass}>
            {currentParagraph.join(" ")}
          </p>
        );
        currentParagraph = [];
      }
      
      // Add list item
      const processedLine = trimmed.replace(/^[\*\-\•]\s/, "").replace(/^\d+\.\s/, "");
      elements.push(
        <div key={`item-${idx}`} className={listClass}>
          <span className="text-[#f1eeff] font-semibold flex-shrink-0">•</span>
          <span>{processedLine}</span>
        </div>
      );
    } else if (trimmed === "") {
      // Empty line - paragraph break
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`para-${idx}`} className={paragraphClass}>
            {currentParagraph.join(" ")}
          </p>
        );
        currentParagraph = [];
      }
    } else {
      // Regular text
      currentParagraph.push(trimmed);
    }
  });

  // Push final paragraph
  if (currentParagraph.length > 0) {
    elements.push(
      <p key={`para-end`} className={paragraphClass}>
        {currentParagraph.join(" ")}
      </p>
    );
  }

  return elements.length > 0 ? elements : content;
}

function Message({ msg }) {
  const { i18n } = useTranslation("chatbot");
  const isRTL = i18n.language === "ar";
  const isAi = msg.role === "ai";
  const formattedContent = isAi ? formatContent(msg.content, isRTL) : msg.content;
  const isUser = !isAi;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isAi
            ? "bg-gradient-to-br from-[#6D5AA0] to-[#4A3B74] text-white shadow-lg shadow-black/30"
            : "bg-gradient-to-br from-[#8E6AE6] to-[#5C3DB1] text-white shadow-lg shadow-black/30"
        } ${isUser ? "order-2" : "order-1"}`}
      >
        {isAi ? <RobotIcon /> : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <div className={`flex flex-col ${isUser ? "order-1 items-end" : "order-2 items-start"}`}>
        <div
          className={`max-w-xl px-4 py-3 sm:px-6 sm:py-4 text-[13px] sm:text-sm leading-7 ${
            isAi
              ? "bg-gradient-to-br from-[#4C3D6B] to-[#3A2F54] rounded-2xl rounded-bl-sm text-[#f4f0ff] border border-[#6E5A9D33] shadow-lg shadow-black/20 break-words whitespace-normal"
              : "bg-gradient-to-br from-[#8E6AE6] to-[#6C4AD1] rounded-2xl rounded-br-sm text-white shadow-lg shadow-black/25 break-words whitespace-normal"
          } ${isRTL ? "text-right" : "text-left"}`}
          style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        >
          {formattedContent}
        </div>
        <span className="text-[10px] text-violet-300/60 mt-2 font-Inter tracking-wide">
          {msg.time}
        </span>
      </div>
    </motion.div>
  );
}
export default Message
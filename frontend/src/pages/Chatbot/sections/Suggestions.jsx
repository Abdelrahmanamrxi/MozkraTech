/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
function Suggestions({sendMessage}) {
  const { t } = useTranslation("chatbot");
  const items = t("suggestions.items", { returnObjects: true });
  const suggestions = Array.isArray(items) ? items : [];
  return (
    <>
       {suggestions.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      
                      className="text-xs px-4 py-2 bg-[#52466B] border-t border-[#9B7EDE33]  rounded-full text-white cursor-pointer"
                    >
                      {s}
                    </motion.button>
                  ))}
    </>
  )
}

export default Suggestions

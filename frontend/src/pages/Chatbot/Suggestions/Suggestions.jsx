/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const SUGGESTIONS = [
  "Help me create a study plan",
  "What's the best way to study for exams?",
  "Explain Data Structures concepts",
  "How can I improve my focus?",
  "Suggest a schedule for this week",
  "Tips for time management",
];
function Suggestions({sendMessage}) {
  return (
    <>
       {SUGGESTIONS.map((s) => (
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

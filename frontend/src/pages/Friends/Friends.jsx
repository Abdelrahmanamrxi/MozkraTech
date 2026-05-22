/* eslint-disable no-unused-vars */
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { AnalyticsIcon, SendIcon } from "../../comp/ui/Icons";
import FriendsMessages from "./FriendsMessages/FriendsMessages";
import FriendsProgress from "./FriendsProgress/FriendsProgress";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import SearchFriends from "./SearchFriends/SearchFriends";

function Friends() {
  const [showMessagesSection, setSection] = useState(false);
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState(false);

  const { t } = useTranslation("friends");


  return (
    <>
      <div className="min-h-screen p-8 lg:p-14 pt-12 lg:pt-20">
        {/* Header */}
        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-white font-semibold text-3xl font-Inter">
              {t("title")}
            </h1>
            <p className="text-xs text-[#B8A7E5] font-Inter">{t("subtitle")}</p>
          </div>

          <motion.button
            onClick={() => setIsAddFriendsOpen(true)}
            whileHover={{
              scale: 1.08,
              backgroundColor: "#b59ef7",
              boxShadow: "0 8px 32px rgba(155, 126, 222, 0.5)",
            }}
            whileTap={{
              scale: 0.94,
              y: 3,
              boxShadow: "0 2px 12px rgba(155, 126, 222, 0.3)",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.3,
              type: "spring",
              stiffness: 400,
              damping: 17,
            }}
            className="bg-[#9B7EDE] w-fit mt-3 lg:mt-0 text-white flex flex-row gap-2 cursor-pointer items-center px-6 py-2 rounded-full text-sm"
          >
            <PlusIcon />
            {t("addFriends")}
          </motion.button>
        </div>

   

  <FriendsProgress onAddFriends={() => setIsAddFriendsOpen(true)} />
      </div>

      {/* Add Friends Modal */}
      <AnimatePresence>
        {isAddFriendsOpen && (
          <SearchFriends setIsAddFriendsOpen={setIsAddFriendsOpen}/>
        )}
      </AnimatePresence>
 
{/* CSS for scrollbar hide */}
<style>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>

    
    </>
  );
}

export default Friends;
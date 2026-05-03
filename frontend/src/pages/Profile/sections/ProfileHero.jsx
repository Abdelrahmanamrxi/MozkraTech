/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Edit2, Calculator, X, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ ...user });
  const { t } = useTranslation("profile");

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-primary-dark/60 font-Inter backdrop-blur-2xl border border-white/20 rounded-[24px] p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {t("editProfile.title")}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 cursor-pointer rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-[#B8A7E5]" />
          </motion.button>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              labelKey: "editProfile.labels.fullName",
              key: "name",
              type: "text",
            },
            {
              labelKey: "editProfile.labels.email",
              key: "email",
              type: "email",
            },
            {
              labelKey: "editProfile.labels.phone",
              key: "phone",
              type: "text",
            },
            {
              labelKey: "editProfile.labels.location",
              key: "location",
              type: "text",
            },
          ].map(({ labelKey, key, type }) => (
            <div key={key}>
              <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">
                {t(labelKey)}
              </label>
              <input
                type={type}
                value={form[key] || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 text-[#B8A7E5] rounded-lg hover:bg-white/20 transition-all font-medium cursor-pointer"
          >
            {t("editProfile.buttons.cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer"
          >
            <Save size={14} /> {t("editProfile.buttons.save")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

function ProfileHero({ mockProfileData }) {
  const { user } = mockProfileData;
  const [currentUser, setCurrentUser] = useState(user);
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation("profile");
  const displayTitle = currentUser.titleKey
    ? t(currentUser.titleKey)
    : currentUser.title;

  return (
    <>
      <div className="bg-gradient-to-br from-[#9B7EDE]/60 to-[#7C5FBD]/40 border-t border-[#9B7EDE]/40 rounded-[24px] p-6 lg:p-8 font-Inter">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {currentUser.name}
              </h1>
              <p className="text-sm text-[#D4C5F5] mt-0.5">
                {displayTitle} • {t("hero.level", { level: currentUser.level })}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentUser.badges.map((badgeKey) => (
                  <span
                    key={badgeKey}
                    className="text-[10px] font-semibold text-white bg-white/20 border border-white/30 rounded-full px-3 py-1"
                  >
                    {t(badgeKey, { defaultValue: badgeKey })}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-white/25 transition-all cursor-pointer"
            >
              <Calculator size={15} /> {t("hero.actions.gpaCalculator")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#9B7EDE] border border-[#B8A7E5]/30 text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-[#8B6ECA] transition-all cursor-pointer"
            >
              <Edit2 size={15} /> {t("hero.actions.editSubjects")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-white/25 transition-all cursor-pointer"
            >
              <Edit2 size={15} /> {t("hero.actions.editProfile")}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            user={currentUser}
            onClose={() => setShowEditModal(false)}
            onSave={(updated) =>
              setCurrentUser((prev) => ({ ...prev, ...updated }))
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProfileHero;

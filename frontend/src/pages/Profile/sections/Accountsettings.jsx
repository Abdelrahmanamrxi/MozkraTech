/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, Download, Trash2, AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DeleteAccountModal = ({ onClose }) => {
  const { t } = useTranslation("profile");

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
        className="bg-primary-dark/60 font-Inter backdrop-blur-2xl border border-red-500/30 rounded-[24px] p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 cursor-pointer rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-[#B8A7E5]" />
          </motion.button>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {t("accountSettings.deleteModal.title")}
        </h3>
        <p className="text-xs text-[#B8A7E5] leading-relaxed mb-8">
          {t("accountSettings.deleteModal.warning")}
        </p>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 text-[#B8A7E5] rounded-lg hover:bg-white/20 transition-all font-medium cursor-pointer"
          >
            {t("accountSettings.deleteModal.cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all font-medium cursor-pointer"
          >
            {t("accountSettings.deleteModal.confirm")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const accountButtons = [
  {
    icon: Lock,
    labelKey: "accountSettings.buttons.changePassword",
    danger: false,
  },
  {
    icon: Trash2,
    labelKey: "accountSettings.buttons.deleteAccount",
    danger: true,
  },
];

function AccountSettings({ mockProfileData }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation("profile");

  return (
    <>
      <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6 font-Inter">
        <p className="text-lg font-semibold text-white mb-4">
          {t("accountSettings.title")}
        </p>
        <div className="flex flex-col gap-2">
          {accountButtons.map(({ icon: Icon, labelKey, danger }) => (
            <motion.button
              key={labelKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={danger ? () => setShowDeleteModal(true) : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all cursor-pointer text-left ${
                danger
                  ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                  : "bg-white/5 border border-white/10 text-[#B8A7E5] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {t(labelKey)}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default AccountSettings;

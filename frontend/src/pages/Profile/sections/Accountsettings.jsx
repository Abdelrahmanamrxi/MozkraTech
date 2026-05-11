/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, Download, Trash2, AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../middleware/api";
import { removeAccessToken } from "../../../slices/authSlice";

const ChangePasswordModal = ({ onClose, onSave }) => {
  const { t } = useTranslation("profile");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setSaveError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password.",
      );
    } finally {
      setIsSaving(false);
    }
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
        className="bg-primary-dark/60 font-Inter backdrop-blur-2xl border border-white/20 rounded-[24px] p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {t("accountSettings.changePasswordModal.title")}
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
              labelKey: "accountSettings.changePasswordModal.currentPassword",
              key: "currentPassword",
            },
            {
              labelKey: "accountSettings.changePasswordModal.newPassword",
              key: "newPassword",
            },
            {
              labelKey: "accountSettings.changePasswordModal.confirmPassword",
              key: "confirmPassword",
            },
          ].map(({ labelKey, key }) => (
            <div key={key}>
              <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">
                {t(labelKey)}
              </label>
              <input
                type="password"
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
              />
            </div>
          ))}
        </div>

        {saveError && (
          <p className="mt-3 text-xs text-red-300" role="alert">
            {saveError}
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 text-[#B8A7E5] rounded-lg hover:bg-white/20 transition-all font-medium cursor-pointer"
          >
            {t("accountSettings.changePasswordModal.cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer disabled:opacity-70"
          >
            {t("accountSettings.changePasswordModal.save")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DeleteAccountModal = ({ onClose, onConfirm }) => {
  const { t } = useTranslation("profile");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleConfirm = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete account.",
      );
    } finally {
      setIsDeleting(false);
    }
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

        {deleteError && (
          <p className="mb-4 text-xs text-red-300" role="alert">
            {deleteError}
          </p>
        )}

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
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all font-medium cursor-pointer disabled:opacity-70"
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
    action: "changePassword",
  },
  {
    icon: Trash2,
    labelKey: "accountSettings.buttons.deleteAccount",
    danger: true,
    action: "deleteAccount",
  },
];

function AccountSettings({ mockProfileData }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { t } = useTranslation("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangePassword = async (form) => {
    await api.patch("/user/change-password", {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });
  };

  const handleDeleteAccount = async () => {
    await api.patch("/user/delete-account");
    dispatch(removeAccessToken());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6 font-Inter">
        <p className="text-lg font-semibold text-white mb-4">
          {t("accountSettings.title")}
        </p>
        <div className="flex flex-col gap-2">
          {accountButtons.map(({ icon: Icon, labelKey, danger, action }) => (
            <motion.button
              key={labelKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (action === "deleteAccount") setShowDeleteModal(true);
                if (action === "changePassword")
                  setShowChangePasswordModal(true);
              }}
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
        {showChangePasswordModal && (
          <ChangePasswordModal
            onClose={() => setShowChangePasswordModal(false)}
            onSave={handleChangePassword}
          />
        )}
        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default AccountSettings;

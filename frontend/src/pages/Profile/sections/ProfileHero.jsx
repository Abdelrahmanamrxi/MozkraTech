/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit2,
  Calculator,
  X,
  Save,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../../middleware/api";
import ProfileImageCropper from "./ProfileImageCropper";
import { buildAssetUrl } from "../../../utils/assetUrl";

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EditProfileModal = ({ user, onClose, onSave }) => {
  const initialPreview = user?.profileImage
    ? buildAssetUrl(user.profileImage)
    : "";
  const [form, setForm] = useState({
    ...user,
    profileImageFile: null,
    profileImagePreview: initialPreview,
    removeProfileImage: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [imageError, setImageError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(initialPreview);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation("profile");

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = (event) => {
    setImageError("");
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setImageError(t("editProfile.photo.invalidType"));
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      setImageError(t("editProfile.photo.tooLarge"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result?.toString() || "");
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (file) => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    setForm((prev) => ({
      ...prev,
      profileImageFile: file,
      profileImagePreview: nextPreview,
      removeProfileImage: false,
    }));
    setShowCropper(false);
    setCropImageSrc("");
  };

  const handleRemovePhoto = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setForm((prev) => ({
      ...prev,
      profileImageFile: null,
      profileImagePreview: "",
      removeProfileImage: true,
    }));
  };

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
          "Failed to save profile.",
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
        className="edit-profile-scroll bg-primary-dark/60 font-Inter backdrop-blur-2xl border border-white/20 rounded-[24px] p-5 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
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

        <div className="mb-5 rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-sm text-[#B8A7E5] mb-3 font-medium">
            {t("editProfile.labels.profilePhoto")}
          </p>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-white/25 bg-white/10 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={t("editProfile.photo.alt")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={26} className="text-white/60" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20"
              >
                <ImagePlus size={14} />
                {t("editProfile.photo.change")}
              </button>
              {previewUrl ? (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/15 px-4 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-400/25"
                >
                  <Trash2 size={14} />
                  {t("editProfile.photo.remove")}
                </button>
              ) : (
                <p className="text-[11px] text-white/50">
                  {t("editProfile.photo.helper")}
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleSelectFile}
                className="hidden"
              />
            </div>
          </div>
          {imageError && (
            <p className="mt-3 text-xs text-red-300" role="alert">
              {imageError}
            </p>
          )}
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
            {
              labelKey: "editProfile.labels.summary",
              key: "summary",
              type: "textarea",
            },
            {
              labelKey: "editProfile.labels.bio",
              key: "bio",
              type: "textarea",
            },
          ].map(({ labelKey, key, type }) => (
            <div key={key}>
              <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">
                {t(labelKey)}
              </label>
              {type === "textarea" ? (
                <textarea
                  rows={1}
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
                />
              )}
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
            {t("editProfile.buttons.cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer disabled:opacity-70"
          >
            <Save size={14} /> {t("editProfile.buttons.save")}
          </motion.button>
        </div>

        <AnimatePresence>
          {showCropper && cropImageSrc && (
            <ProfileImageCropper
              imageSrc={cropImageSrc}
              onCancel={() => {
                setShowCropper(false);
                setCropImageSrc("");
              }}
              onConfirm={handleCropConfirm}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

function ProfileHero({ user, onUserChange, onUserRefresh }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const displayTitle = user.titleKey ? t(user.titleKey) : user.title;
  const profileImageUrl = user?.profileImage
    ? buildAssetUrl(user.profileImage)
    : "";

  const handleSaveProfile = async (form) => {
    const payload = {};
    let nextProfileImage = undefined;

    const name = typeof form?.name === "string" ? form.name.trim() : "";
    if (name.length >= 3) {
      payload.fullName = name;
    }

    if (typeof form?.location === "string") {
      const location = form.location.trim();
      payload.location = location;
    }

    if (typeof form?.bio === "string") {
      const bio = form.bio.trim();
      payload.bio = bio;
    }

    if (typeof form?.summary === "string") {
      const summary = form.summary.trim();
      payload.summary = summary;
    }

    if (Object.keys(payload).length > 0) {
      await api.patch("/user/update-profile", payload);
    }

    if (form?.profileImageFile) {
      const formData = new FormData();
      formData.append("profileImage", form.profileImageFile);
      const { data } = await api.patch("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      nextProfileImage = data?.profileImage ?? "";
    } else if (form?.removeProfileImage) {
      await api.delete("/user/profile-image");
      nextProfileImage = null;
    }

    if (nextProfileImage !== undefined) {
      window.dispatchEvent(
        new CustomEvent("profile-image-updated", {
          detail: nextProfileImage,
        }),
      );
    }

    if (typeof onUserRefresh === "function") {
      await onUserRefresh();
    } else {
      const {
        profileImageFile,
        profileImagePreview,
        removeProfileImage,
        ...safeForm
      } = form;
      const nextLocalProfileImage = removeProfileImage
        ? null
        : profileImagePreview || user.profileImage;
      onUserChange((prev) => ({
        ...prev,
        ...safeForm,
        profileImage: nextLocalProfileImage,
      }));
    }
  };
  console.log(user.bio)
  
  return (
    <>
      <div className="bg-gradient-to-br from-[#9B7EDE]/60 to-[#7C5FBD]/40 border-t border-[#9B7EDE]/40 rounded-[24px] p-6 lg:p-8 font-Inter">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={t("editProfile.photo.alt")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {user.name}
              </h1>

              {user.summary && (
                <p className="text-[#B8A7E5] text-[12px]">{user.summary}</p>
              )}
              <p className="text-sm text-[#D4C5F5] font-bold mt-0.5">
                {displayTitle} • {t("hero.level", { level: user.level })}
              </p>
              <p className="mt-4 text-[15px] text-[#B8A7E5]">{user.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(user.badges || []).map((badgeKey) => (
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
              onClick={() => navigate("/edit-subjects")}
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
            user={user}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProfileHero;

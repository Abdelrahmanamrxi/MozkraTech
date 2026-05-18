/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../middleware/api";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditSessionModal = ({
  session,
  daysessions,
  onConfirm,
  onCancel,
  setEditingSession,
  sessionColors,
  wouldOverlap,
}) => {
  const { t } = useTranslation("schedule");
  const validators = {
    date: (v) => {
      if (!v) return t("errors.dateRequired");
      const selectedDay = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDay < today) return t("errors.dateAfterToday");
      return false;
    },
  };
  const getTodayString = () => new Date().toISOString().split("T")[0];

  // Local state for the custom status dropdown toggle
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState(() => {
    // Create local Date objects from the ISO strings to handle timezone shift
    const startObj = session.startTime
      ? new Date(session.startTime)
      : new Date();
    const endObj = session.endTime ? new Date(session.endTime) : new Date();

    const toHHmm = (date) =>
      `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    const toYYYYMMDD = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return {
      sessionId: session._id,
      name: session.name || "",
      date: toYYYYMMDD(startObj),
      startTime: toHHmm(startObj),
      endTime: toHHmm(endObj),
      duration: session.duration || "",
      color: session.color || sessionColors[0],
      status: session.status || "scheduled", // Ensure status is initialized
    };
  });
  console.log(form);
  const queryClient = useQueryClient();

  const [overlapError, setOverlapError] = useState(false);

  const update = (key, value) => {
    setOverlapError(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  function validateErrors(form) {
    let errors = {};
    for (const key in validators) {
      const error = validators[key](form[key]);
      if (error) errors[key] = error;
    }
    return errors;
  }

  async function editSession() {
    setError({});
    const errors = validateErrors(form);
    setError(errors);
    console.log(errors);
    if (Object.keys(errors).length > 0)
      throw new Error(t("errors.dateAfterToday"));

    const response = await api.patch("/sessions", { form });
    return response.data;
  }

  const statusOptions = [
    { value: "scheduled", label: t("status.scheduled"), dot: "bg-blue-400" },
    { value: "completed", label: t("status.completed"), dot: "bg-green-400" },
    { value: "missed", label: t("status.missed"), dot: "bg-red-400" },
    { value: "cancelled", label: t("status.cancelled"), dot: "bg-gray-400" },
  ];

  const currentStatus = statusOptions.find((s) => s.value === form.status);
  const hideIconClass = "[&::-webkit-calendar-picker-indicator]:hidden";
  const editMutation = useMutation({
    mutationFn: editSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
      setEditingSession(null);
    },
    onError: (err) => {
      console.log(err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        t("errors.editSessionFailed");
      setError((prev) => ({ ...prev, server: errorMsg }));
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2F2844] border border-white/10 rounded-[20px] p-6 w-full max-w-sm shadow-2xl"
      >
        <p className="text-white font-semibold text-lg mb-5">
          {t("labels.session")}
        </p>
        {error.server && (
          <p className="text-sm text-center font-Inter text-red-600">
            {error.server}
          </p>
        )}
        <div className="flex flex-col gap-4">
          {/* Name Input */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">
              {t("labels.name")}
            </span>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60"
            />
          </label>

          {/* Status Custom Dropdown */}
          <div className="relative">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1 block">
              {t("labels.status")}
            </span>
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentStatus?.dot}`} />
                {currentStatus?.label}
              </div>
              <span
                className={`text-[10px] transition-transform ${isStatusOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            <AnimatePresence>
              {isStatusOpen && (
                <>
                  {/* Local overlay to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsStatusOpen(false)}
                  />
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-20 w-full bg-[#3a3252] border border-white/10 rounded-[12px] shadow-2xl p-1"
                  >
                    {statusOptions.map((opt) => (
                      <li key={opt.value}>
                        <button
                          type="button"
                          onClick={() => {
                            update("status", opt.value);
                            setIsStatusOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] transition-colors ${
                            form.status === opt.value
                              ? "bg-[#9B7EDE] text-white"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              form.status === opt.value ? "bg-white" : opt.dot
                            }`}
                          />
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Date Picker */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">
              {t("labels.date")}
            </span>
            <input
              type="date"
              name="date"
              value={form.date}
              min={getTodayString()}
              onChange={(e) => update("date", e.target.value)}
              className={`w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#9B7EDE]/50 focus:outline-none [color-scheme:dark] ${hideIconClass}`}
            />
            {error.date && (
              <p className="text-xs font-Inter text-red-600 mt-2">
                {error.date}
              </p>
            )}
          </label>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">{t("labels.start")}</p>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
                className={`w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark] outline-none focus:border-[#9B7EDE]/60 ${hideIconClass}`}
              />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">{t("labels.end")}</p>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
                className={`w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark] outline-none focus:border-[#9B7EDE]/60 ${hideIconClass}`}
              />
            </div>
          </div>

          <AnimatePresence>
            {overlapError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs mt-1"
              >
                {t("errors.overlap")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-[10px] text-sm text-[#B8A7E5] bg-white/5 hover:bg-white/10 transition-colors"
          >
            {t("buttons.cancel")}
          </button>
          <button
            onClick={() => editMutation.mutate()}
            disabled={editMutation.isPending}
            className="flex-1 py-2 rounded-[10px] text-sm text-white bg-[#9B7EDE] hover:bg-[#8B6ECC] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {editMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                {t("loading.general")}
              </span>
            ) : (
              t("buttons.confirm")
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditSessionModal;

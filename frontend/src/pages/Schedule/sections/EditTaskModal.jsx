import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../../middleware/api";
import DeleteTaskModal from "./DeleteTaskModal";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "bg-blue-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" }
];

const EditTaskModal = ({ task, onCancel, setEditingTask, subjects = [] }) => {
  const { t } = useTranslation("schedule");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    name: task.name || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    priority: task.priority || "medium",
    status: task.status || "ongoing",
    subjectId: task.subjectId?._id || task.subjectId || "",
    totalHours: task.totalHours || ""
  });

  const queryClient = useQueryClient();
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function updateTask() {
    setError({});
    
    if (!form.name.trim()) {
      setError({ name: t("errors.nameRequired") });
      throw new Error(t("errors.nameRequired"));
    }

    if (!form.dueDate) {
      setError({ dueDate: t("errors.dateRequired") });
      throw new Error(t("errors.dateRequired"));
    }

    if (new Date(form.dueDate) < new Date(getTodayString())) {
      setError({ dueDate: t("errors.dateAfterToday") });
      throw new Error(t("errors.dateAfterToday"));
    }

    const response = await api.patch(`/tasks/${task._id}`, {
      name: form.name,
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
      totalHours: form.totalHours
      ,
      ...(form.subjectId ? { subjectId: form.subjectId } : {})
    });
    return response.data;
  }

  const editMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      setEditingTask(null);
    },
    onError: (err) => {
      const errorMsg = err?.response?.data?.message || err?.message || t("errors.updateFailed");
      setError((prev) => ({ ...prev, server: errorMsg }));
    }
  });

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === form.priority);

  if (isDeleting) {
    return (
      <DeleteTaskModal
        task={task}
        onCancel={() => setIsDeleting(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["schedule"] });
          setEditingTask(null);
        }}
      />
    );
  }

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
          {t("editTaskModal.title")}
        </p>

        {error.server && (
          <p className="text-sm text-center font-Inter text-red-600 mb-4">
            {error.server}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {/* Name Input */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">
              {t("editTaskModal.nameLabel")}
            </span>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60"
            />
            {error.name && <p className="text-xs text-red-400">{error.name}</p>}
          </label>

          {/* Due Date Input */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">
              {t("editTaskModal.dueDateLabel")}
            </span>
            <input
              type="date"
              value={form.dueDate}
              min={getTodayString()}
              onChange={(e) => update("dueDate", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60 scheme-dark"
            />
            {error.dueDate && <p className="text-xs text-red-400">{error.dueDate}</p>}
          </label>

          {/* Priority Dropdown */}
          <div className="relative">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1 block">
              {t("editTaskModal.priorityLabel")}
            </span>
            <button
              type="button"
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentPriority?.color}`} />
                {currentPriority?.label}
              </div>
              <span className={`text-[10px] transition-transform ${isPriorityOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <AnimatePresence>
              {isPriorityOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsPriorityOpen(false)}
                  />
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-20 w-full bg-[#3a3252] border border-white/10 rounded-xl shadow-2xl p-1"
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          type="button"
                          onClick={() => {
                            update("priority", opt.value);
                            setIsPriorityOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            form.priority === opt.value
                              ? "bg-[#9B7EDE] text-white"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              form.priority === opt.value ? "bg-white" : opt.color
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

          {/* Status Dropdown - Disabled if already completed */}
          <div className="relative">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1 block">
              {t("editTaskModal.statusLabel")}
            </span>
            <button
              type="button"
              onClick={() => !task.completedAt && setIsStatusOpen(!isStatusOpen)}
              disabled={task.completedAt}
              className={`w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white transition-all ${
                task.completedAt
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-white/10 cursor-pointer"
              }`}
            >
              <span className="capitalize">{form.status}</span>
              <span className={`text-[10px] transition-transform ${isStatusOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            <AnimatePresence>
              {isStatusOpen && !task.completedAt && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsStatusOpen(false)}
                  />
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-20 w-full bg-[#3a3252] border border-white/10 rounded-xl shadow-2xl p-1"
                  >
                    {["ongoing", "completed"].map((statusOption) => (
                      <li key={statusOption}>
                        <button
                          type="button"
                          onClick={() => {
                            update("status", statusOption);
                            setIsStatusOpen(false);
                          }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors capitalize ${
                            form.status === statusOption
                              ? "bg-[#9B7EDE] text-white"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          {statusOption}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Total Hours Input */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">
              {t("editTaskModal.totalHoursLabel")}
            </span>
            <input
              type="number"
              min="1"
              value={form.totalHours}
              onChange={(e) => update("totalHours", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6 flex-wrap">
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
                <Loader className="w-3 h-3 animate-spin" />
              </span>
            ) : (
              t("editTaskModal.edit")
            )}
          </button>

          <button
            onClick={() => setIsDeleting(true)}
            disabled={editMutation.isPending}
            className="flex-1 py-2 rounded-[10px] text-sm text-white bg-red-600/70 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t("taskActions.delete")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditTaskModal;

import { useState, useEffect } from "react";
import {
  calcDuration,
  toLocalDateInputValue,
  localDateTimeToUtcIso,
} from "@/utils/formatTime";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X,Loader2 } from "lucide-react";
import api from "../../../middleware/api";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}
async function createSession(newSession){
  const {name,date,startTime,endTime,taskId}=newSession
  const response=await api.post('/sessions',{name,date,startTime,endTime,taskId})
  return response.data
}

function CreateSessionModal({ setAddModal }) {
  const { t } = useTranslation("schedule");
  const queryClient = useQueryClient();
 
  const today = toLocalDateInputValue();
  const[err,setError]=useState("")
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });


  const tasks = data?.tasks ?? [];

  const [newSession, setNewSession] = useState({
    name: "",
    date: today,
    startTime: "18:00",
    endTime: "20:00",
    taskId: "",
  });

  const createSessionMutation=useMutation({
    mutationFn:()=>createSession(newSession),
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:['schedule']
      })
      setAddModal(false)
    },
    onError:(err)=>{
         const errorMsg = err?.response?.data?.message || err?.message || t('errors.createSessionFailed');
         setError(errorMsg);
       }
  })

  console.log(newSession)

  const [taskSelection, setTask] = useState(false);

  // ✅ AUTO SELECT FIRST TASK
  useEffect(() => {
    if (tasks.length > 0 && !newSession.taskId) {
      setNewSession((prev) => ({
        ...prev,
        taskId: tasks[0]._id,
      }));
    }
  }, [tasks]);

  const getDayNameFromDate = (dateString) => {
    if (!dateString) return "Mon";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, parseInt(month) - 1, parseInt(day));
    return daysOfWeek[date.getDay()];
  };

  

  const update = (key, value) => {
    setNewSession((prev) => ({ ...prev, [key]: value }));
  };

  const selectedTaskName =
    tasks.find((t) => t._id === newSession.taskId)?.name ||
    t("createSessionModal.selectTask");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1B142D] border border-white/10 rounded-[20px] p-5 w-full max-w-md"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-white font-semibold">{t("createSessionModal.title")}</h4>
         
          <button
            onClick={() => setAddModal(false)}
            className="text-white/50 hover:text-white/80"
          >
            <X className="w-4 h-4" />
          </button>
          
        </div>
    {error || err ? <p className="flex justify-center items-center text-center rounded-[16px] mb-6 p-3 bg-red-500/10 border border-red-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.15)] text-red-300">{error || err}</p>: ""}

        {/* LOADING */}
        {isLoading ? (
          <p className="text-white/50 text-sm text-center py-8">
            {t("loading.tasks")}
          </p>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {/* SESSION NAME */}
                        <label htmlFor="NAME" className='text-[11px] text-[#B8A7E5] uppercase mb-1 block'>{t("createSessionModal.nameLabel")}</label>
            <input
              type="text"
              value={newSession.name}
              onChange={(e) =>
                setNewSession((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              placeholder={t("placeholders.sessionName")}
              className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25"
            />

            {/* TASK SELECT */}
            <div className="relative">
              <span className="text-[11px] text-[#B8A7E5] uppercase mb-1 block">
                {t("createSessionModal.taskLabel")}
              </span>

              <button
                type="button"
                onClick={() => setTask(!taskSelection)}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white hover:bg-white/10 transition-all"
              >
                <span>{selectedTaskName || t("createSessionModal.selectTask")}</span>

                <span
                  className={`text-[10px] transition-transform ${
                    taskSelection ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {taskSelection && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setTask(false)}
                    />

                    <motion.ul
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 5 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute z-20 w-full bg-[#1B142D] border border-white/10 rounded-[12px] shadow-2xl p-1"
                    >
                      {tasks.map((opt) => (
                        <li key={opt._id}>
                          <button
                            type="button"
                            onClick={() => {
                              update("taskId", opt._id);
                              setTask(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] transition-colors ${
                              newSession.taskId === opt._id
                                ? "bg-[#9B7EDE] text-white"
                                : "text-white/70 hover:bg-white/5"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                newSession.taskId === opt._id
                                  ? "bg-white"
                                  : "bg-white/30"
                              }`}
                            />
                            {opt.name}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* DATE */}
            <label htmlFor="taskDate" className='text-[11px] text-[#B8A7E5] uppercase mb-1 block'>{t("createSessionModal.dateLabel")}</label>
            <input
              type="date"
              value={newSession.date}
              min={today}
              name="taskDate"
              onChange={(e) =>
                setNewSession((p) => ({
                  ...p,
                  date: e.target.value,
                }))
              }
              className="w-full rounded-[10px] custom-date  border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
            />

            {/* TIME */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col" >
            <label htmlFor="from" className='text-[11px]  text-[#B8A7E5] uppercase mb-1 block'>{t("createSessionModal.fromLabel")}</label>
              <input
              
              type="time"
              name="from"
                value={newSession.startTime}
                onChange={(e) =>
                  setNewSession((p) => ({
                    ...p,
                    startTime: e.target.value,
                  }))
                }
                className="rounded-[10px] border custom-date border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
              />

</div>
            <div className="flex flex-col">
            <label htmlFor="to" className='text-[11px] text-[#B8A7E5] uppercase mb-1 block'>{t("createSessionModal.toLabel")}</label>
              <input
                type="time"
                name="to"
                value={newSession.endTime}
                onChange={(e) =>
                  setNewSession((p) => ({
                    ...p,
                    endTime: e.target.value,
                  }))
                }
                className="rounded-[10px] border custom-date border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
                />
                </div>
            </div>

            {/* DURATION */}
            <p className="text-[11px] text-white/30">
              {t("createSessionModal.durationLabel")}: <span className="text-[#B8A7E5]">
                {calcDuration(newSession.startTime, newSession.endTime)}
              </span>
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={()=>{createSessionMutation.mutate()}}
                className="flex-1 py-2 rounded-[10px] cursor-pointer bg-[#9B7EDE] text-center text-white text-sm font-semibold"
              >
                {createSessionMutation.isPending?(<p className="flex justify-center items-center flex-row gap-3 text-center">
                  {t("loading.general")}  <Loader2 className="animate-spin"/>
                </p>):t("createSessionModal.addButton")}
              </button>

              <button
                onClick={() => setAddModal(false)}
                className="flex-1 py-2 rounded-[10px] border border-white/10 text-white/60 text-sm"
              >
                {t("createSessionModal.cancelButton")}
              </button>
            </div>
          </div>
        ) : (
          <p className="flex justify-center items-center text-center rounded-[24px] p-8 bg-red-500/10 border border-red-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.15)] text-red-200">
            {t("createSessionModal.noTasksMessage")}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default CreateSessionModal;
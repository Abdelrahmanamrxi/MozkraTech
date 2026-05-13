/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil,Trash2,Check,CirclePlus  } from "lucide-react";
import SessionCard from "./SessionCard";
import SessionDetailsModal from "./SessionDetailsModal";
import DeleteSessionModal from "./DeleteSessionModal";
import CreateSessionModal from "./CreateSessionModal";


const DayColumn = ({
  day,
  sessions,
  dragOverDay,
  setDragOverDay,
  onDrop,
  onEditSession,
  isEditMode,
  t,
  parseTimeToHours,
  parseDurationToHours,
  hourToPx,
  pxToSnappedHour,
  GRID_HEIGHT,
  HALF_TICKS,
  HOUR_HEIGHT_PX,
}) => {
  const [previewPx, setPreviewPx] = useState(null);
  const [showEditHint, setShowEditHint] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteModal,setDelete]=useState(false)
  const [addModal,setAddModal]=useState(false)
  const [showAddhint,setAddHint]=useState(false)
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const columnRef = useRef(null);

  const getRelativeY = (e) => {
    const rect = columnRef.current?.getBoundingClientRect();
    return rect ? e.clientY - rect.top : 0;
  };

  const handleDragOver = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    const y = getRelativeY(e);

    setPreviewPx(hourToPx(pxToSnappedHour(y)));
  };

  const handleDragEnter = () => {
    if (!isEditMode) return;
    setDragOverDay(day);
  };

  const handleDragLeave = (e) => {
    if (!isEditMode) return;
    
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDay(null);
      setPreviewPx(null);
    }
  };

  const handleDrop = (e, targetIndex = null) => {
    if (!isEditMode) return;
    e.preventDefault();

  const data = JSON.parse(
    e.dataTransfer.getData("application/json")
  )


 
    const y = getRelativeY(e);
    const snappedHour = pxToSnappedHour(y);
    setPreviewPx(null);
    setDragOverDay(null);
    onDrop(e, day, targetIndex, snappedHour);
  
  };

  const isOver = isEditMode && dragOverDay === day;

  const handleShowDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex flex-col">
      <div
        ref={columnRef}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
        onMouseEnter={() => {
          if (!isEditMode && canHover) setShowEditHint(true);
          if(isEditMode && canHover) setAddHint(true)
        }}
        onMouseLeave={() => {
          if (canHover) {
            setShowEditHint(false);
            setAddHint(false)
          }
            
        }}
        style={{ height: GRID_HEIGHT }}
        className={`relative rounded-[20px] transition-all duration-150 ${
          isOver ? "bg-white/[0.07] ring-2 ring-[#9B7EDE]/60" : "bg-[#2a2242]/40"
        }`}
      >
        {!isEditMode && showEditHint && (
          <div className="absolute top-3 sm:top-2 left-2 right-2 z-20 pointer-events-none">
            <div className="bg-black/50 text-[10px] sm:text-xs text-white/80 px-2 py-1 rounded-full text-center">
              {t.editHint}
            </div>
          </div>
        )}
        {isEditMode && showAddhint && <div className="absolute  top-3 sm:top-2 left-2 right-2 z-20 ">
            <div onClick={()=>{setAddModal(true)}} className="bg-black/50 cursor-pointer flex gap-3 flex-row justify-center items-center text-[10px] sm:text-xs text-white/80 px-2 py-1 rounded-full ">
              Add Session <CirclePlus size={16}/>
            </div>
          </div>}

        {HALF_TICKS.map((h) => (
          <div
            key={h}
            style={{ top: hourToPx(h) }}
            className={`absolute left-0 right-0 pointer-events-none border-t ${
              Number.isInteger(h) ? "border-white/[0.10]" : "border-white/[0.04]"
            }`}
          />
        ))}

        {isOver && previewPx !== null && (
          <div
            style={{ top: previewPx }}
            className="absolute left-1 right-1 h-[2px] bg-[#9B7EDE]/70 rounded-full pointer-events-none z-20 shadow-[0_0_8px_#9B7EDE]"
          />
        )}

        <AnimatePresence>
          {sessions.map((session, idx) => {
           
            const startH = parseTimeToHours(session.startTime);
            const durationMinutes = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
            const durationH = Number.isFinite(durationMinutes) && durationMinutes > 0
              ? durationMinutes / 60
              : (typeof session.duration === "number"
                ? session.duration
                : parseDurationToHours(session.duration));
            const topPx = hourToPx(startH);
            const heightPx = durationH * HOUR_HEIGHT_PX;
           
            return (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="group"
                style={{
                  position: "absolute",
                  top: topPx,
                  height: heightPx,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                }}
                onDragOver={(e) => e.stopPropagation()}
                onDrop={(e) => {
                  e.stopPropagation();
                  handleDrop(e, idx);
                }}
              >
                <SessionCard
                  session={session}
                  index={idx}
                  day={day}
                  isEditMode={isEditMode}
                  onDragStart={(e, d, i) => {
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({ fromDay: d, sourceIndex: i })
                    );
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDropOnCard={(e, d, i) => handleDrop(e, i)}
                  onShowDetails={handleShowDetails}
                />

                {isEditMode && session.status!=="completed"  && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSession(day, session);
                    }}
                    className="absolute top-1.5 right-1.5 z-30 w-6 h-6 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    style={{ opacity: undefined }}
                    aria-label="Edit session"
                  >
                     <Pencil size={11} />
                  </button>
                )}
                
                {isEditMode && (
                  <button
                    onClick={
                      ()=>{
                        setSelectedSession(session),
                        setDelete(true)
                      }
                        
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute top-1.5 left-1.5 text-white z-30 w-6 h-6 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center  hover:text-red-600 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    style={{ opacity: undefined }}
                    aria-label="Edit session"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sessions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-[#B8A7E5]/25 text-[10px] text-center">{t.noSessions}</p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSession(null);
        }}
      /> 
      {deleteModal && selectedSession  && <DeleteSessionModal setDelete={setDelete} session={selectedSession} t={t}/>}
      {addModal && <CreateSessionModal setAddModal={setAddModal} t={t}/> }
    </div>
  );
};

export default DayColumn;

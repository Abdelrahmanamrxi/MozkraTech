/* eslint-disable no-unused-vars */
import React from 'react'
import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDuration } from '../utils/timeUtility'
function DeleteSessionModal({ t, session, setDelete}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#231D36] border border-white/10 rounded-[18px] p-6 w-full max-w-sm shadow-2xl"
      >
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-red-500 font-semibold text-lg">
            {t.deleteSession}
          </h2>
          <p className="text-white/60 text-xs mt-1">
            This action cannot be undone.
          </p>
        </div>

        {/* Session Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3">
          <div>
            <p className="text-[10px] text-[#B8A7E5] uppercase">Session</p>
            <p className="text-white text-sm font-medium">{session.name}</p>
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-[10px] text-[#B8A7E5] uppercase">From</p>
              <p className="text-white">
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-[#B8A7E5] uppercase">To</p>
              <p className="text-white">
                {new Date(session.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#B8A7E5] uppercase">Duration</p>
            <p className="text-white text-sm">
              {formatDuration(session.startTime, session.endTime)}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Cancel */}
          <button
            onClick={()=>{setDelete(false)}}
            className="flex-1 px-4 py-2 rounded-lg border border-white/15 text-white/80 text-sm hover:bg-white/5 transition"
          >
            {t?.cancel || "Cancel"}
          </button>

          {/* Delete */}
          <button
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            🗑 {t?.confirm || "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


export default DeleteSessionModal

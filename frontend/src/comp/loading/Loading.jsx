import React from "react";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

function Loading({ message }) {
    const {t,i18n}=useTranslation(['common'])
  return (
    <div className="min-h-screen main-bg flex flex-col items-center justify-center text-white relative overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full" />

      {/* Loader Card */}
      <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">

        {/* Animated icon */}
        <Loader className="w-8 h-8 animate-spin text-violet-300" />

        {/* Message */}
        <p className="text-lg font-poppins font-medium tracking-wide text-white/90 text-center">
          {t(message || "loading.default")}
        </p>

        {/* Subtext */}
        <span className="text-xs font-inter text-white/40 tracking-widest uppercase">
          Please wait a moment
        </span>

      </div>
    </div>
  );
}

export default Loading;
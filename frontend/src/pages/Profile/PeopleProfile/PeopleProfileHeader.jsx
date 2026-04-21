import React from "react";
import { motion as Motion } from "framer-motion";
import { Clock, Target, Sparkles, Flame, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
export default function PeopleProfileHeader({ user, friendship, isFriendshipPending, itemVariants, glassPanel,isIncomingRequest }) {
  const { t, i18n } = useTranslation("profile");
  const pending = friendship?.status === "pending";
  const locale = i18n.language?.startsWith("ar") ? "ar-EG" : "en-US";

  const friendshipDate = friendship?.createdAt
    ? new Date(friendship.createdAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const requestTime = friendship?.createdAt
    ? new Date(friendship.createdAt).toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <Motion.div variants={itemVariants} whileHover={{ y: -2 }} className={`${glassPanel} p-6 md:p-10 h-full`}>
      <style>{`
        @keyframes streakGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(255, 112, 67, 0.6), 0 0 20px rgba(255, 152, 0, 0.4), inset 0 0 8px rgba(255, 152, 0, 0.2); }
          50% { box-shadow: 0 0 20px rgba(255, 112, 67, 0.8), 0 0 30px rgba(255, 152, 0, 0.6), inset 0 0 12px rgba(255, 152, 0, 0.3); }
        }
        .streak-badge {
          animation: streakGlow 2.5s ease-in-out infinite;
        }
      `}</style>
        <div className="mb-7 flex items-center justify-between">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-Inter font-bold uppercase tracking-wider text-white/90"
            style={{
              borderColor: "rgba(202,196,206,0.3)",
              background: "rgba(141,134,201,0.22)",
            }}
          >
            <Sparkles size={13} />
            {t("header.publicProfile")}
          </div>
         {friendship?.status==="accepted"&& (<div
            className="streak-badge inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-Inter font-bold uppercase tracking-wider text-[#f7ece1] backdrop-blur-xl"
            style={{
              borderColor: "rgba(255, 152, 0, 0.5)",
              background: "linear-gradient(135deg, rgba(255, 112, 67, 0.25) 0%, rgba(255, 152, 0, 0.15) 100%)",
            }}
          >
            <Flame size={13} className="text-orange-400" />
            {t("header.dayStreak", { count: user.streak })}
          </div>)}
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="relative shrink-0 pb-4 md:pb-0">
            <div
              className="absolute -inset-2 rounded-[36px] blur-xl"
              style={{
                background: "linear-gradient(140deg, rgba(141,134,201,0.45) 0%, rgba(144,103,198,0.2) 100%)",
              }}
            />
            <div className="relative h-32 w-32 rounded-[30px] border border-white/35 bg-linear-to-br from-white/25 to-white/5 p-1 shadow-2xl md:h-36 md:w-36">
              <div
                className="flex h-full w-full items-center justify-center rounded-[26px] text-5xl font-Inter font-black text-white"
                style={{
                  background: "linear-gradient(160deg, rgba(36,32,56,0.92) 0%, rgba(141,134,201,0.38) 100%)",
                }}
              >
                {user.fullName[0]}
              </div>
            </div>
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1 text-[10px] font-Inter font-black tracking-widest text-white backdrop-blur-xl"
              style={{
                borderColor: "rgba(202,196,206,0.45)",
                background: "rgba(144,103,198,0.28)",
              }}
            >
              {t("header.levelShort", { level: user.level })}
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-Inter font-black leading-tight text-white md:text-5xl">
              {user.fullName}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <p
                className="flex items-center gap-2 text-[11px] font-Inter font-bold uppercase tracking-widest"
                style={{ color: "var(--color-secondary-light)" }}
              >
                <Target size={14} strokeWidth={2.6} />
                {user.summary}
              </p>
              <span className="hidden h-1 w-1 rounded-full bg-white/30 md:block" />
              <p className="flex items-center gap-2 text-[11px] font-Inter font-bold uppercase tracking-widest text-slate-200">
                <Clock size={14} />
                {t("header.joined", { date: user.joinedAt })}
              </p>
              {pending && (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-white/30 md:block" />
                  <p className={`flex items-center gap-2 text-[11px] font-Inter font-bold uppercase tracking-widest ${isIncomingRequest ? "text-emerald-300" : "text-amber-200"}`}>
                    <UserPlus size={14} />
                    {isIncomingRequest ? t("header.incomingRequest") : t("header.pendingRequest")}
                  </p>
                </>
              )}
              
              {friendship?.status === "accepted" && (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-white/30 md:block" />
                  <p className="flex items-center gap-2 text-[11px] font-Inter font-bold uppercase tracking-widest text-slate-200">
                    <UserPlus size={14} />
                    {t("header.friendsSince", { date: friendshipDate })}
                  </p>
                </>
              )}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-100/85 md:text-[15px]">
              {user.bio}
            </p>
            {pending && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 shadow-[0_14px_30px_rgba(0,0,0,0.15)]">
                <UserPlus size={14} className="text-slate-100" />
                <span className="whitespace-nowrap">
                  {isIncomingRequest
                    ? t("header.requestReceivedAt", { time: requestTime })
                    : t("header.requestSentAt", { time: requestTime })}
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-left transition-all duration-300 hover:bg-white/16">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{t("stats.subjects")}</p>
                {user.subjects.length>0?<p className="mt-1 text-xl font-Inter font-black text-white">{user.subjects.length}</p>:<p className="mt-1 text-base font-Inter font-black text-white ">{t("fallback.unknown")}</p>}
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-left transition-all duration-300 hover:bg-white/16">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{t("stats.streak")}</p>
                {friendship?.status==="accepted" ? <p className="mt-1 text-xl font-Inter font-black text-white">{t("header.dayStreak", { count: user.streak })}</p> : <p className="mt-1 text-base font-Inter font-black text-white">{t("fallback.unknown")}</p>}
              </div>
           
            </div>
          </div>
        </div>
    </Motion.div>
  );
}

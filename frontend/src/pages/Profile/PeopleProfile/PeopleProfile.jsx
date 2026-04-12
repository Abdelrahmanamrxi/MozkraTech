import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  UserPlus,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Target,
  Trophy,
  Clock,
  Sparkles,
  Flame,
} from "lucide-react";

function PeopleProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const mockUser = {
    _id: id,
    fullName: "Alex Johnson",
    level: 24,
    xpProgress: 65,
    status: "Deep Diving into Quantum Mechanics",
    joinedAt: "Jan 2024",
    streak: 10,
    xpToNext: 240,
    subjects: [
      { name: "Mathematics", xp: 80 },
      { name: "Physics", xp: 95 },
      { name: "Computer Science", xp: 70 },
      { name: "Chemistry", xp: 40 },
    ],
    badges: ["Early Adopter", "Solver", "10 Day Streak"],
    bio: "Passionate learner and tech enthusiast exploring software architecture and human-centric design.",
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, staggerChildren: 0.08, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  const glassPanel =
    "rounded-[28px] border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_22px_70px_rgba(14,11,26,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.1]";

  const progressRing = Math.max(0, Math.min(100, mockUser.xpProgress));

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-hidden px-4 py-6 md:px-10 md:py-10 text-slate-100 font-poppins"
      style={{
        background:
          "linear-gradient(128deg, var(--color-primary-dark) 0%, #302a4d 48%, var(--color-primary) 135%)",
      }}
    >
      <style>{`
        @keyframes profileDriftA {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(12px, -18px, 0) scale(1.05); }
        }

        @keyframes profileDriftB {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-15px, 12px, 0) scale(1.08); }
        }

        .profile-orb-a {
          animation: profileDriftA 16s ease-in-out infinite;
        }

        .profile-orb-b {
          animation: profileDriftB 20s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="profile-orb-a absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(141,134,201,0.45) 0%, rgba(141,134,201,0.05) 45%, transparent 70%)",
          }}
        />
        <div
          className="profile-orb-b absolute right-0 top-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(144,103,198,0.38) 0%, rgba(144,103,198,0.05) 48%, transparent 72%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(247,236,225,0.22) 0%, rgba(247,236,225,0.03) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[30px_30px] mask-[radial-gradient(circle_at_center,black_38%,transparent_82%)]" />

      <div className="relative mx-auto max-w-6xl space-y-8 md:space-y-10">
        <Motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/12 px-5 py-2 text-[11px] font-Inter font-bold uppercase tracking-[0.2em] backdrop-blur-xl transition-all hover:-translate-x-0.5 hover:bg-white/20"
        >
          <ArrowLeft size={14} className="text-slate-300 transition-transform group-hover:-translate-x-1" />
          <span className="text-slate-100">Profile</span>
        </Motion.button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className={"lg:col-span-8 " + glassPanel + " p-6 md:p-10"}
          >
            <div className="mb-7 flex items-center justify-between">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-Inter font-bold uppercase tracking-wider text-white/90"
                style={{
                  borderColor: "rgba(202,196,206,0.3)",
                  background: "rgba(141,134,201,0.22)",
                }}
              >
                <Sparkles size={13} />
                Public Profile
              </div>
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-Inter font-bold uppercase tracking-wider text-[#f7ece1]"
                style={{
                  borderColor: "rgba(247,236,225,0.35)",
                  background: "rgba(247,236,225,0.12)",
                }}
              >
                <Flame className="text-yellow-400" size={20} />
                {mockUser.streak} Day Streak
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-2 rounded-[36px] blur-xl"
                  style={{
                    background:
                      "linear-gradient(140deg, rgba(141,134,201,0.45) 0%, rgba(144,103,198,0.2) 100%)",
                  }}
                />
                <div className="relative h-32 w-32 rounded-[30px] border border-white/35 bg-linear-to-br from-white/25 to-white/5 p-1 shadow-2xl md:h-36 md:w-36">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-[26px] text-5xl font-Inter font-black text-white"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(36,32,56,0.92) 0%, rgba(141,134,201,0.38) 100%)",
                    }}
                  >
                    {mockUser.fullName[0]}
                  </div>
                </div>
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1 text-[10px] font-Inter font-black tracking-widest text-white backdrop-blur-xl"
                  style={{
                    borderColor: "rgba(202,196,206,0.45)",
                    background: "rgba(144,103,198,0.28)",
                  }}
                >
                  LVL {mockUser.level}
                </div>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-Inter font-black leading-tight text-white md:text-5xl">
                  {mockUser.fullName}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <p
                    className="flex items-center gap-2 text-[11px] font-Inter font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-secondary-light)" }}
                  >
                    <Target size={14} strokeWidth={2.6} />
                    {mockUser.status}
                  </p>
                  <span className="hidden h-1 w-1 rounded-full bg-white/30 md:block" />
                  <p className="flex items-center gap-2 text-[11px] font-Inter font-bold uppercase tracking-widest text-slate-200">
                    <Clock size={14} />
                    Joined {mockUser.joinedAt}
                  </p>
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-slate-100/85 md:text-[15px]">
                  {mockUser.bio}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-left transition-all duration-300 hover:bg-white/16">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Subjects</p>
                    <p className="mt-1 text-xl font-Inter font-black text-white">{mockUser.subjects.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-left transition-all duration-300 hover:bg-white/16">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Streak</p>
                    <p className="mt-1 text-xl font-Inter font-black text-white">{mockUser.streak}d</p>
                  </div>
                
                </div>
              </div>
            </div>
          </Motion.div>

          <Motion.div variants={itemVariants} className="lg:col-span-4">
            <div className={glassPanel + " h-full p-6 md:p-7"}>
              <div className="space-y-6">
                <div
                  className="rounded-2xl border p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,12,29,0.45)]"
                  style={{
                    borderColor: "rgba(202,196,206,0.28)",
                    background:
                      "linear-gradient(150deg, rgba(141,134,201,0.23) 0%, rgba(36,32,56,0.58) 100%)",
                  }}
                >
                  <div className="mb-3 flex items-end justify-between">
                    <span className="text-[10px] font-Inter font-black uppercase tracking-[0.22em] text-slate-200/90">
                      Current Level
                    </span>
                    <span className="text-4xl font-Inter font-black text-white">{mockUser.level}</span>
                  </div>

                  <p className="mb-3 text-[11px] text-slate-200">{mockUser.xpToNext} XP to unlock the next level.</p>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
                    <Motion.div
                      initial={{ width: 0 }}
                      animate={{ width: progressRing + "%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%)",
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-end">
                    <span className="text-[11px] font-Inter font-bold text-white/90">{mockUser.xpProgress}% complete</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mockUser.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-Inter font-bold uppercase tracking-wider text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <button className="w-full rounded-2xl border border-white/15 bg-white px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] text-[var(--color-primary-dark)] shadow-[0_16px_48px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_58px_rgba(255,255,255,0.28)] hover:bg-white/90">
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus size={16} strokeWidth={2.5} />
                      Connect
                    </span>
                  </button>
                  <button
                    className="w-full rounded-2xl border px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(13,10,23,0.4)]"
                    style={{
                      borderColor: "rgba(202,196,206,0.36)",
                      background:
                        "linear-gradient(130deg, rgba(144,103,198,0.36) 0%, rgba(36,32,56,0.64) 100%)",
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <MessageSquare size={16} strokeWidth={2.5} />
                      Message
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>

        <Motion.div variants={itemVariants} className={glassPanel + " p-6 md:p-7"}>
          <div className="mb-5 flex items-center gap-3">
            <Trophy size={16} style={{ color: "var(--color-secondary-light)" }} />
            <h2 className="text-[11px] font-Inter font-black uppercase tracking-[0.3em] text-slate-100">
              Subject Mastery
            </h2>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockUser.subjects.map((subj) => (
              <Motion.div
                key={subj.name}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group rounded-2xl border border-white/20 bg-white/8 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:bg-white/14 hover:shadow-[0_18px_40px_rgba(14,10,25,0.45)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 transition-all duration-300 group-hover:scale-110"
                    style={{ color: "var(--color-secondary-light)" }}
                  >
                    <BookOpen size={19} />
                  </div>
                  <ChevronRight size={16} className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <h3 className="mb-3 text-sm font-Inter font-bold uppercase tracking-wider text-white">
                  {subj.name}
                </h3>
              
   
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
}

export default PeopleProfile;
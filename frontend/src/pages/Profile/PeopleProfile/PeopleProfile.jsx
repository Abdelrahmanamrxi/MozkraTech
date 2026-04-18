import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import PeopleProfileHeader from "./PeopleProfileHeader";
import PeopleProfileSidebar from "./PeopleProfileSidebar";
import PeopleProfileSubjects from "./PeopleProfileSubjects";
import { useQuery } from "@tanstack/react-query";
import api from "../../../middleware/api";




async function getProfileByID(id){
  const response=await api.get(`user/profile/${id}`)
  return response.data
}


function PeopleProfile() {

const { id } = useParams();

const {data,isLoading,error}=useQuery({
  queryKey:['user',id],
  queryFn:()=>getProfileByID(id),
  retry:1
})



  
  const navigate = useNavigate();



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
    "rounded-[28px] border border-white/20 bg-white/8 backdrop-blur-2xl shadow-[0_22px_70px_rgba(14,11,26,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/14";



    if(isLoading)
      return <p>Loading...</p>
    
    if(error)
      return <p>{error.response.data.message}</p>
    console.log(data)

    const nextLvlXP = Math.pow(data.data.user.level, 2) * 100;
    const currLvlXP = Math.pow(data.data.user.level - 1, 2) * 100;
    const xpInLevel = Math.max(0, data.data.user.currentXP - currLvlXP);

    const d=data.data
    const user = {
    fullName: d.user.fullName,
    level: d.user.level,
    xpProgress: Math.min(100, (xpInLevel / (nextLvlXP - currLvlXP)) * 100),
    summary: d.summary? d.summary:"No summary to show",
    joinedAt: new Date(d.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
    streak: d.user.currentStreak || 0,
    xpToNext: Math.max(0, nextLvlXP - d.user.currentXP),
    subjects: d.user.subjects && d.user.subjects.length > 0 ? d.user.subjects : [],
    badges: ["Early Adopter", "Solver", "10 Day Streak"],
    bio: d.user.bio?d.user.bio : "No bio to show",
  };

  
  const progressRing = user.xpProgress;
  
  const isFriendshipPending = !d.friendship || d.friendship?.status === "pending";
const isOutgoingRequest = d.friendship?.status === "pending"
  && d.friendship.receiverId === id

const isIncomingRequest = d.friendship?.status === "pending"
  && d.friendship.requesterId === id
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
          <ArrowLeft
            size={14}
            className="text-slate-300 transition-transform group-hover:-translate-x-1"
          />
          <span className="text-slate-100">Profile</span>
        </Motion.button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-8">
            <PeopleProfileHeader
              user={user}
              friendship={data.data.friendship}
              isFriendshipPending={isFriendshipPending}
              itemVariants={itemVariants}
              glassPanel={glassPanel}
              isIncomingRequest={isIncomingRequest}
            />
          </div>
          <PeopleProfileSidebar
            id={id}
            user={user}
            friendship={data.data.friendship}
            progressRing={progressRing}
            itemVariants={itemVariants}
            glassPanel={glassPanel}
            isIncomingRequest={isIncomingRequest}
            isOutgoingRequest={isOutgoingRequest}
          />
        </div>

        {user.subjects.length > 0 && !isFriendshipPending && (
          <PeopleProfileSubjects
            subjects={user.subjects}
            itemVariants={itemVariants}
            glassPanel={glassPanel}
          />
        )}
      </div>
    </Motion.div>
  );
}

export default PeopleProfile;

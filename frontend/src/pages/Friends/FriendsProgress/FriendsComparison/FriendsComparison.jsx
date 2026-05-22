/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { YellowFireIcon, BadgeIcon,Search2Icon,TargetIcon,ClockIcon } from "@/comp/ui/Icons";
import SubjectComparison from "./SubjectComparison/SubjectComparison";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import StatCard from "./StatCard";
import api from "../../../../middleware/api";
import { buildAssetUrl } from "../../../../utils/assetUrl";



const userData = {
  name: "Mohamed ",
  initials: "ME",
  level: 8,
  rank: 3,
  color: "bg-purple-500",
  studyHours: 157,
  goals: 24,
  streak: 12,
  achievements: 8,
  progress: 78,
};

const friendStats = {
  1: {
    name: "Sarah Johnson",
    initials: "SJ",
    level: 9,
    rank: 4,
    color: "bg-purple-400",
    studyHours: 142,
    goals: 22,
    streak: 15,
    achievements: 9,
    progress: 82,
    diff: { studyHours: -10.6, goals: -9.1, streak: 20.0, achievements: 11.1 },
  },
  2: {
    name: "Alex Chen",
    initials: "AC",
    level: 10,
    rank: 1,
    color: "bg-orange-400",
    studyHours: 178,
    goals: 28,
    streak: 20,
    achievements: 14,
    progress: 95,
    diff: { studyHours: 13.4, goals: 16.7, streak: 66.7, achievements: 75.0 },
  },
  3: {
    name: "Emma Davis",
    initials: "ED",
    level: 8,
    rank: 6,
    color: "bg-emerald-500",
    studyHours: 128,
    goals: 19,
    streak: 7,
    achievements: 6,
    progress: 65,
    diff: {
      studyHours: -18.5,
      goals: -20.8,
      streak: -41.7,
      achievements: -25.0,
    },
  },
  4: {
    name: "Michael Brown",
    initials: "MB",
    level: 9,
    rank: 2,
    color: "bg-slate-400",
    studyHours: 165,
    goals: 25,
    streak: 18,
    achievements: 11,
    progress: 89,
    diff: { studyHours: 5.1, goals: 4.2, streak: 50.0, achievements: 37.5 },
  },
  5: {
    name: "Olivia Martinez",
    initials: "OM",
    level: 8,
    rank: 5,
    color: "bg-rose-400",
    studyHours: 135,
    goals: 20,
    streak: 10,
    achievements: 7,
    progress: 71,
    diff: {
      studyHours: -14.0,
      goals: -16.7,
      streak: -16.7,
      achievements: -12.5,
    },
  },
};





const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};


async function getFriends(search) {
  const response = await api.get(`/friends?search=${search}`);
  return response.data;
}
async function compareProgress(selected){
  const response=await api.get(`/friends/progress/${selected}`)
  return response.data
}

export default function FriendsComparison() {
  const { t, i18n } = useTranslation("friends");
  const isArabic = i18n?.language?.toLowerCase?.().startsWith("ar");

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const debouncedSearch=useDebounce(search,500)

  const{data,isLoading,error,isError,refetch}=useQuery({
    queryKey:['friendsWithProgress',debouncedSearch],
    queryFn:()=>getFriends(debouncedSearch),
    enabled:!!debouncedSearch.trim(),
    retry:false

  })

  useEffect(() => {
    if (!data?.friends?.length) {
      setSelected(null);
      return;
    }

    setSelected((currentSelected) => {
      const stillExists = data.friends.some((friend) => friend.friend._id === currentSelected);
      return stillExists ? currentSelected : data.friends[0].friend._id;
    });
  }, [data]);

  const {
    data: compareData,
    isLoading: isCompareLoading,
    isError: isCompareError,
    error: compareError,
    refetch: refetchCompare,
  } = useQuery({
    queryKey: ["friendProgressComparison", selected],
    queryFn: () => compareProgress(selected),
    enabled: !!selected,
    retry: false,
  });

  
  console.log(selected)
 
  console.log(isError)
  console.log(error)


  //const friend = friendStats[selected];

  return (
    <div className="font-Inter w-full mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className="w-full mx-auto rounded-2xl"
      >
        <div className="bg-[#3D3555] border border-[#9B7EDE]/20 p-8 mb-8 rounded-3xl">
          <h2 className="text-white font-bold text-2xl mb-5">
            {t("progress.compareTitle")}
          </h2>

          {/* Search */}
          <div className="flex items-center gap-3 bg-[#3D3555]/60 border border-[#9B7EDE]/20 rounded-xl px-4 py-3 mb-5">
            <span className="text-purple-300/50">
              <Search2Icon />
            </span>
            <input
              type="text"
              placeholder={t("progress.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-purple-300/40 text-sm outline-none flex-1"
            />
          </div>

          {/* Friend Selector */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={` ${data && data.friends.length>0?"grid grid-cols-3 sm:grid-cols-5":""} gap-2 sm:gap-3 mb-6`}
          >
            {isLoading && (
              <div className="col-span-full flex flex-col items-center justify-center py-6">
                <svg className="animate-spin h-8 w-8 text-[#9B7EDE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <p className="text-sm text-purple-300/70 mt-2">Searching...</p>
              </div>
            )}
            {isError && (
              <div className="col-span-full bg-red-600/10 border border-red-500 text-red-100 p-3 rounded-md flex items-center justify-between">
                <p className="text-sm">
                  {error?.response?.data?.message ?? error?.message ?? 'Unexpected error'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="ml-4 text-sm bg-red-500 hover:bg-red-400 px-3 py-1 rounded"
                >
                  Retry
                </button>
              </div>
            )}
            {!debouncedSearch.trim() && (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-center text-purple-300/70">
                <Search size={20} />
                {i18n?.language?.toLowerCase?.().startsWith("ar") ? (
                  <>
                    <p className="mt-2 text-sm" dir="rtl">اكتب للبحث عن الأصدقاء</p>
                    
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-sm">Type to search for friends</p>
                   
                  </>
                )}
              </div>
            )}
            {data&& data.friends.length===0 &&(
              <p className=" text-center font-semibold font-Inter flex flex-col md:flex-row gap-3 items-center h-full justify-center text-white mt-10"><Search size={16}/>{t('actions.empty')}</p>)
              }
            {data && data.friends.length>0 && data.friends.map((f) => (
              <motion.button
                key={f.friend._id}
                variants={itemVariants}
                onClick={() => setSelected(f.friend._id)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 border transition-all duration-200 cursor-pointer ${
                  selected === f.friend._id
                    ? "bg-[#9B7EDE]/20 border-3 hover:bg-[#9B7EDE]/20 border-[#9B7EDE]"
                    : "bg-[#52466B] border-2 border-[#9B7EDE]/15 hover:border-[#9B7EDE]/60"
                }`}
              >
                <div className="relative">
              {f.friend.profileImage?<img className="w-11 h-11 rounded-full" src={`${import.meta.env.VITE_SERVER_URL}${f.friend.profileImage}`}/>: 
              (
                <div
                className={`w-11 h-11 rounded-full bg-[#B8A7E5] flex items-center justify-center text-white font-bold text-sm`}
                >
                    {f.friend.fullName[0]}
                  </div>
                  )}
                
                </div>
                <p className="text-white text-xs font-medium">{f.friend.fullName}</p>
                <p className="text-purple-300/50 text-[10px]">
                  {t("progress.level")}
                </p>
                <p className="text-purple-300/70 text-xs font-semibold">
                  {f.friend.level}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Comparison Cards */}
        {!selected ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-purple-300/70">
            <Search size={36} />
            {i18n?.language?.toLowerCase?.().startsWith("ar") ? (
              <p className="mt-4 text-sm" dir="rtl">ابحث عن صديق للمقارنة أو اختر من القائمة أعلاه</p>
            ) : (
              <p className="mt-4 text-sm">Search or select a friend to compare progress</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:gap-12 gap-6 items-center w-full">
            {isCompareLoading && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                <div className="rounded-3xl bg-[#3D3555] p-6 border border-[#9B7EDE]/10 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#4A3A63]" />
                    <div className="flex flex-col gap-2">
                      <div className="w-36 h-4 bg-[#4A3A63] rounded" />
                      <div className="w-20 h-3 bg-[#3B324F] rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-14 bg-[#3B324F] rounded" />
                    <div className="h-14 bg-[#3B324F] rounded" />
                    <div className="h-14 bg-[#3B324F] rounded" />
                    <div className="h-14 bg-[#3B324F] rounded" />
                  </div>
                  <div className="h-2 bg-[#2A2440] rounded-full overflow-hidden">
                    <div className="h-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]" style={{ width: '30%' }} />
                  </div>
                </div>

                <div className="rounded-3xl bg-[#3D3555] p-6 border border-[#9B7EDE]/10 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#4A3A63]" />
                    <div className="flex flex-col gap-2">
                      <div className="w-36 h-4 bg-[#4A3A63] rounded" />
                      <div className="w-20 h-3 bg-[#3B324F] rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-14 bg-[#3B324F] rounded" />
                    <div className="h-14 bg-[#3B324F] rounded" />
                    <div className="h-14 bg-[#3B324F] rounded" />
                    <div className="h-14 bg-[#3B324F] rounded" />
                  </div>
                  <div className="h-2 bg-[#2A2440] rounded-full overflow-hidden">
                    <div className="h-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            )}
          {/* You */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: 0.1,
            }}
            className="rounded-3xl bg-[#3D3555] p-5 w-full lg:w-1/2 border-3 hover:bg-primary-dark/60 transition-colors border-[#9B7EDE] flex flex-col gap-5"
          >
            {isCompareLoading && (
              <div className="flex items-center justify-center min-h-44 text-purple-200/80">
                <span className="inline-flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-[#9B7EDE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  {t("searchFriends.searchingTitle")}
                </span>
              </div>
            )}
            {!isCompareLoading && compareData?.me && (
              <>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {compareData.me.profileImage ? (
                  <img
                    className="w-14 h-14 rounded-xl object-cover"
                    src={buildAssetUrl(compareData.me.profileImage)}
                    alt={compareData.me.fullName || "You"}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {(compareData.me.fullName || "You").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">
                  {compareData.me.fullName} {t("progress.you")}
                </p>
                <p className="text-purple-300/60 text-sm">
                  {t("progress.level")} {compareData.me.level}
                </p>
                <p className="text-purple-300/40 text-xs">
                  {t("progress.achievements")} {compareData.me.achievementCount ?? 0}
                </p>
                <p className="text-purple-300/40 text-xs">
                  {isArabic ? "الهدف الأسبوعي: " : "Weekly Goal: "}
                  {compareData.me.weeklyStudyHours ?? 0}h
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <StatCard
                icon={<ClockIcon />}
                value={compareData.me.hoursSpent}
                label={t("progress.studyHours")}
              />
              <StatCard
                icon={<TargetIcon />}
                value={compareData.me.completedGoals}
                label={t("progress.completedGoals")}
              />
              <StatCard
                icon={<YellowFireIcon />}
                value={compareData.me.currentStreak ?? 0}
                label={t("progress.dayStreak")}
              />
              <StatCard
                icon={<BadgeIcon />}
                value={compareData.me.achievementCount}
                label={t("progress.achievements")}
              />
            </div>

            <div className="bg-[#3D3555] p-3 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold text-sm">
                  {isArabic ? "إجمالي التقدم بالنسبة لي" : "Overall Progress for Me"}
                </span>
                <span className="text-[#9B7EDE] font-bold text-lg">
                  {Math.round(compareData.me.overallProgress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#2A2440] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, compareData.me.overallProgress)}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]"
                />
              </div>
            </div>
              </>
            )}
            {isCompareError && (
              <div className="col-span-full bg-red-600/10 border border-red-500 text-red-100 p-3 rounded-md flex items-center justify-between">
                <p className="text-sm">
                  {compareError?.response?.data?.message ?? compareError?.message ?? "Unexpected error"}
                </p>
                <button
                  onClick={() => refetchCompare()}
                  className="ml-4 text-sm bg-red-500 hover:bg-red-400 px-3 py-1 rounded"
                >
                  Retry
                </button>
              </div>
            )}
          </motion.div>

          
          {/* Friend */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: 0.15,
            }}
            className="rounded-3xl bg-[#3D3555] border-3 w-full lg:w-1/2 hover:bg-primary-dark/60 transition-colors border-[#7C5FBD] p-5 flex flex-col gap-5"
          >
            {!isCompareLoading && compareData?.friend && (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    {compareData.friend.profileImage ? (
                      <img
                        className="w-14 h-14 rounded-xl object-cover"
                        src={buildAssetUrl(compareData.friend.profileImage)}
                        alt={compareData.friend.fullName || "Friend"}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#7C5FBD] flex items-center justify-center text-white font-bold text-lg">
                        {(compareData.friend.fullName || "F").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1E1B2E]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">
                      {compareData.friend.fullName}
                    </p>
                    <p className="text-purple-300/60 text-sm">
                      {t("progress.level")} {compareData.friend.level}
                    </p>
                    <p className="text-purple-300/40 text-xs">
                      {t("progress.achievements")} {compareData.friend.achievementCount ?? 0}
                    </p>
                    <p className="text-purple-300/40 text-xs">
                      {isArabic ? "الهدف الأسبوعي: " : "Weekly Goal: "}
                      {compareData.friend.weeklyStudyHours ?? 0}h
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <StatCard
                    icon={<ClockIcon />}
                    value={compareData.friend.hoursSpent}
                    label={t("progress.studyHours")}
                  />
                  <StatCard
                    icon={<TargetIcon />}
                    value={compareData.friend.completedGoals}
                    label={t("progress.completedGoals")}
                  />
                  <StatCard
                    icon={<YellowFireIcon />}
                    value={compareData.friend.currentStreak ?? 0}
                    label={t("progress.dayStreak")}
                  />
                  <StatCard
                    icon={<BadgeIcon />}
                    value={compareData.friend.achievementCount}
                    label={t("progress.achievements")}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold text-sm">
                      {isArabic
                        ? `إجمالي التقدم بالنسبة إلى ${compareData.friend.fullName}`
                        : `Overall Progress for ${compareData.friend.fullName}`}
                    </span>
                    <span className="text-[#9B7EDE] font-bold text-lg">
                      {Math.round(compareData.friend.overallProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#2A2440] rounded-full overflow-hidden">
                    <motion.div
                      key={selected}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, compareData.friend.overallProgress)}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      className="h-full rounded-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
        )}
      </motion.div>

      {selected && (
        <SubjectComparison
          meSubjects={compareData?.comparison?.subjects?.me || []}
          friendSubjects={compareData?.comparison?.subjects?.friend || []}
          meTasks={compareData?.comparison?.myTasks || []}
          friendTasks={compareData?.comparison?.friendsTasks || []}
          friendName={compareData?.friend?.fullName || "Friend"}
          loading={isCompareLoading}
        />
      )}
    </div>
  );
}

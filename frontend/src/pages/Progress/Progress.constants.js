const mockProgressData = {
  totalStudyHours: 157,
  goalsAchieved: 24,
  dayStreak: 12,
  achievements: 8,

  overallProgress: 78,
  progressChangeThisMonth: "+12%",

  level: 8,
  xp: 2450,
  xpRequired: 3000,

  personalBestStreak: 15,
  streakDays: [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ],

  subjects: [
    {
      name: "Data Structures",
      hoursStudied: 42,
      totalHours: 50,
      grade: "A+",
      progress: 85,
    },
    {
      name: "Web Development",
      hoursStudied: 36,
      totalHours: 50,
      grade: "B+",
      progress: 72,
    },
    {
      name: "Database Design",
      hoursStudied: 45,
      totalHours: 50,
      grade: "A+",
      progress: 90,
    },
    {
      name: "Algorithm Analysis",
      hoursStudied: 34,
      totalHours: 50,
      grade: "B",
      progress: 68,
    },
  ],

  weeklyActivity: {
    totalHoursThisWeek: 41.5,
    days: [
      { day: "Mon", tasks: 8, hours: 5.5 },
      { day: "Tue", tasks: 12, hours: 7.0 },
      { day: "Wed", tasks: 10, hours: 6.2 },
      { day: "Thu", tasks: 14, hours: 8.5 },
      { day: "Fri", tasks: 7, hours: 4.8 },
      { day: "Sat", tasks: 15, hours: 6.0 },
      { day: "Sun", tasks: 11, hours: 3.5 },
    ],
  },

  milestones: [
    {
      title: "Completed Advanced Algorithms Module",
      date: "December 20, 2025",
      tag: "Course Completion",
    },
    {
      title: "Achieved 90% on Database Final",
      date: "December 18, 2025",
      tag: "Exam Success",
    },
    {
      title: "Reached 100 Study Hours",
      date: "December 15, 2025",
      tag: "Milestone",
    },
    {
      title: "Mastered Binary Search Trees",
      date: "December 10, 2025",
      tag: "Skill Achievement",
    },
  ],

  achievementBadges: [
    { icon: "🔥", color: "#f97316", unlocked: true },
    { icon: "⭐", color: "#a855f7", unlocked: true },
    { icon: "⚡", color: "#eab308", unlocked: true },
    { icon: "🏆", color: "#1e293b", unlocked: false },
    { icon: "🎯", color: "#1e293b", unlocked: false },
    { icon: "📅", color: "#16a34a", unlocked: true },
  ],

 
};

export default mockProgressData;

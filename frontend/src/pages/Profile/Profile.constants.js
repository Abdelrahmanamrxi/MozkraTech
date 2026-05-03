const mockProfileData = {
  user: {
    name: "Mohamed Ahmed",
    titleKey: "hero.titles.computerScienceStudent",
    level: 3,
    email: "mohamed.ahmed@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    memberSince: "January 2024",
    badges: [
      "badges.activeLearner",
      "badges.twelveDayStreak",
      "badges.topPerformer",
    ],
  },

  stats: [
    { labelKey: "statsLabels.studyHours", value: "124.5", type: "hours" },
    { labelKey: "statsLabels.courses", value: 8, type: "courses" },
    { labelKey: "statsLabels.achievements", value: 15, type: "achievements" },
    { labelKey: "statsLabels.streakDays", value: 12, type: "streak" },
  ],

  activities: [
    {
      type: "quiz",
      titleKey: "recentActivity.types.quizCompleted",
      dayKey: "recentActivity.timestamps.today",
      time: "2:30 PM",
    },
    {
      type: "module",
      titleKey: "recentActivity.types.moduleStarted",
      dayKey: "recentActivity.timestamps.today",
      time: "10:15 AM",
    },
    {
      type: "streak",
      titleKey: "recentActivity.types.streakAchieved",
      dayKey: "recentActivity.timestamps.yesterday",
      time: "11:45 PM",
    },
    {
      type: "project",
      titleKey: "recentActivity.types.projectCompleted",
      dayKey: "recentActivity.timestamps.yesterday",
      time: "4:20 PM",
    },
  ],

  preferences: [
    {
      key: "emailNotifications",
      labelKey: "preferences.labels.emailNotifications",
      enabled: true,
    },
    {
      key: "studyReminders",
      labelKey: "preferences.labels.studyReminders",
      enabled: true,
    },
    {
      key: "weeklyReports",
      labelKey: "preferences.labels.weeklyReports",
      enabled: true,
    },
    {
      key: "achievementAlerts",
      labelKey: "preferences.labels.achievementAlerts",
      enabled: false,
    },
  ],

  achievements: {
    total: 25,
    unlocked: 15,
  },
};

export default mockProfileData;

const NAME_PATTERNS = [
  /^(.+?)\s+has sent you a friend request/i,
  /^(.+?)\s+has accepted your friend request/i,
  /^(.+?)\s+viewed your profile/i,
  /^Welcome\s+(.+?),/i,
  /^Welcome Back\s+(.+?),/i,
];

/** Maps English milestone names from DB notifications to achievement locale codes */
const ACHIEVEMENT_NAME_TO_CODE = {
  "First Step": "session_1",
  "On a Roll": "session_10",
  "Session Veteran": "session_50",
  "Session Legend": "session_100",
  "First Connection": "friend_1",
  "Social Butterfly": "friend_5",
  "Popular": "friend_25",
  "Networking Legend": "friend_50",
  "Hat Trick": "streak_3",
  "Week Warrior": "streak_7",
  "Consistent": "streak_30",
  "Unstoppable": "streak_100",
};

function extractNameFromMessage(message) {
  if (!message) return "";
  for (const pattern of NAME_PATTERNS) {
    const match = message.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function parseAchievementMessage(message) {
  if (!message) return null;
  const match = message.match(/^(.+?):\s*(.+?)\s*(\S+)\s*!*$/);
  if (!match) return null;
  return {
    name: match[1].trim(),
    description: match[2].trim(),
    icon: match[3].trim(),
  };
}

function resolveActorName(notification) {
  const payload = notification.payload ?? {};
  return (
    payload.actorName ??
    payload.senderName ??
    payload.viewerName ??
    extractNameFromMessage(notification.message)
  );
}

function translateAchievementMessage(notification, t, tAchievements) {
  const parsed = parseAchievementMessage(notification.message);
  if (!parsed) return notification.message ?? "";

  const code = ACHIEVEMENT_NAME_TO_CODE[parsed.name];
  if (!code) {
    return notification.message ?? "";
  }

  const name = tAchievements(`achievements.${code}.name`, {
    defaultValue: parsed.name,
  });
  const description = tAchievements(`achievements.${code}.description`, {
    defaultValue: parsed.description,
  });

  const templateKey =
    notification.eventType === "streak_milestone_reached"
      ? "navbar.notifications.messages.streak_milestone_reached"
      : "navbar.notifications.messages.achievement_unlocked";

  return t(templateKey, {
    name,
    description,
    icon: parsed.icon,
    defaultValue: notification.message,
  });
}

export function getNotificationMessage(notification, t, tAchievements) {
  const name = resolveActorName(notification);
  const fallback = notification.message ?? "";

  if (
    notification.eventType === "achievement_unlocked" ||
    notification.eventType === "streak_milestone_reached"
  ) {
    return translateAchievementMessage(notification, t, tAchievements);
  }

  if (notification.eventType === "system_announcement") {
    if (/Welcome Back/i.test(fallback)) {
      return t("navbar.notifications.messages.system_welcome_back", {
        name,
        defaultValue: fallback,
      });
    }
    if (/Welcome/i.test(fallback)) {
      return t("navbar.notifications.messages.system_welcome", {
        name,
        defaultValue: fallback,
      });
    }
  }

  const key = `navbar.notifications.messages.${notification.eventType}`;
  return t(key, { name, defaultValue: fallback });
}

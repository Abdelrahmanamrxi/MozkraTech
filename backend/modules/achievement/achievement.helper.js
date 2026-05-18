import achievementModel from '../../DB/models/achievement.model.js';
import sessionModel from '../../DB/models/session.model.js';
import friendshipModel from '../../DB/models/friendship.model.js';
import { notificationModel } from '../../DB/models/notifications.model.js';
import { getStartOfDay,getDayDifference } from '../../utils/customHelpers/customHelpers.js';

export const SESSION_MILESTONES = [
    { code: 'session_1',   count: 1,   name: 'First Step',     description: 'Completed your first session', badge: 'common',    icon: '👣', type: 'session' },
    { code: 'session_10',  count: 10,  name: 'On a Roll',       description: 'Completed 10 sessions',        badge: 'rare',      icon: '🎯', type: 'session' },
    { code: 'session_50',  count: 50,  name: 'Session Veteran', description: 'Completed 50 sessions',        badge: 'epic',      icon: '⚔️', type: 'session' },
    { code: 'session_100', count: 100, name: 'Session Legend',  description: 'Completed 100 sessions',       badge: 'legendary', icon: '🏆', type: 'session' },
];

export const FRIENDSHIP_MILESTONES = [
    { code: 'friend_1',  count: 1,  name: 'First Connection',  description: 'Made your first friend', badge: 'common',    icon: '🤝', type: 'friendship' },
    { code: 'friend_5',  count: 5,  name: 'Social Butterfly',  description: 'Made 5 friends',         badge: 'rare',      icon: '🦋', type: 'friendship' },
    { code: 'friend_25', count: 25, name: 'Popular',           description: 'Made 25 friends',        badge: 'epic',      icon: '⭐', type: 'friendship' },
    { code: 'friend_50', count: 50, name: 'Networking Legend', description: 'Made 50 friends',        badge: 'legendary', icon: '👑', type: 'friendship' },
];

export const STREAK_MILESTONES = [
    { code: 'streak_3',   count: 3,   name: 'Hat Trick',   description: '3 day streak',   badge: 'common',    icon: '🎩', type: 'streak' },
    { code: 'streak_7',   count: 7,   name: 'Week Warrior', description: '7 day streak',   badge: 'rare',      icon: '⚡', type: 'streak' },
    { code: 'streak_30',  count: 30,  name: 'Consistent',  description: '30 day streak',  badge: 'epic',      icon: '🔥', type: 'streak' },
    { code: 'streak_100', count: 100, name: 'Unstoppable', description: '100 day streak', badge: 'legendary', icon: '💎', type: 'streak' },
];


async function grantIfNew(userId, type, milestone,notiType) {
    const exists = await achievementModel.exists({ userId, name: milestone.name });
    if (exists) return;

    await Promise.all([ 
        await achievementModel.create({
            userId,
            type,
            name:        milestone.name,
            description: milestone.description,
            badge:       milestone.badge,
            icon:        milestone.icon
        }),
        await notificationModel.create({
            userId,
            message:`${milestone.name}: ${milestone.description} ${milestone.icon}!!`,
            eventType:notiType
        })
    ])
}


export async function CheckSessionAchievements(userId) {
    const count = await sessionModel.countDocuments({ userId, status: 'completed' });
    const milestone = SESSION_MILESTONES.find(m => m.count === count);
    console.log(milestone,count)
    if (milestone) await grantIfNew(userId, 'session', milestone,'achievement_unlocked');
}

export async function checkFriendshipAchievements(userId) {
    const count = await friendshipModel.countDocuments({
        $or: [{ requesterId: userId }, { receiverId: userId }],
        status: 'accepted'
    });
    const milestone = FRIENDSHIP_MILESTONES.find(m => m.count === count);
    if (milestone) await grantIfNew(userId, 'friendship', milestone,'achievement_unlocked');
}

export async function checkStreakAchievements(userId, currentStreak) {
    const milestone = STREAK_MILESTONES.find(m => m.count === currentStreak);
    if (milestone) await grantIfNew(userId, 'streak', milestone,'achievement_unlocked');
}

export async function getAchievementCatalog(userId) {
    // Get all unlocked achievements for this user
    const unlockedAchievements = await achievementModel.find({ userId });
    const unlockedMap = new Map(unlockedAchievements.map(a => [a.name, a]));

    // Combine all milestones into a single catalog
    const allMilestones = [
        ...SESSION_MILESTONES,
        ...FRIENDSHIP_MILESTONES,
        ...STREAK_MILESTONES
    ];

    // Map each milestone to include unlock status and unlockedAt timestamp
    return allMilestones.map(milestone => {
        const unlockedData = unlockedMap.get(milestone.name);
        return {
            code: milestone.code,
            name: milestone.name,
            description: milestone.description,
            badge: milestone.badge,
            icon: milestone.icon,
            type: milestone.type,
            unlocked: !!unlockedData,
            unlockedAt: unlockedData?.createdAt || null
        };
    });
}



export const checkUserStreak = async (user) => {
    const now = new Date();
    const today = getStartOfDay(now);

    if (!user.lastActivityDate) {
        user.currentStreak = 1;
    } else {
        const lastActivity = getStartOfDay(user.lastActivityDate);
        const diff = getDayDifference(today, lastActivity);

        if (diff === 0) return;           // already active today, bail early
        else if (diff === 1) user.currentStreak = (user.currentStreak || 0) + 1;
        else user.currentStreak = 1;      // streak broken
    }

    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    user.lastActivityDate = now;
    await user.save();

    await checkStreakAchievements(user._id, user.currentStreak,"streak_milestone_reached"); // 👈 called internally
};
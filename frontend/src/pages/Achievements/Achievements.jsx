import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../middleware/api';

function Achievements() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('achievements');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/achievements/all');
      setAchievements(data.achievements || []);
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  // Group achievements by type
  const groupedByType = achievements.reduce((acc, achievement) => {
    const type = achievement.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(achievement);
    return acc;
  }, {});

  const categoryOrder = ['session', 'friendship', 'streak'];
  
  const categoryConfig = {
    session: { 
      gradient: 'from-[#9B7EDE]/15 to-[#7C5FBD]/10',
      border: 'border-[#9B7EDE]/30',
      titleColor: '#9B7EDE'
    },
    friendship: { 
      gradient: 'from-[#B59EF7]/15 to-[#9B7EDE]/10',
      border: 'border-[#B59EF7]/30',
      titleColor: '#B59EF7'
    },
    streak: { 
      gradient: 'from-[#9B7EDE]/10 to-[#7C5FBD]/15',
      border: 'border-[#9B7EDE]/30',
      titleColor: '#9B7EDE'
    },
  };

  const categoryLabels = {
    session: t('categories.session'),
    friendship: t('categories.friendship'),
    streak: t('categories.streak'),
  };

  const badgeGradients = {
    common: 'from-gray-500 to-gray-700',
    rare: 'from-[#4F46E5] to-[#4338CA]',
    epic: 'from-[#9333EA] to-[#7E22CE]',
    legendary: 'from-[#D97706] to-[#B45309]',
  };

  if (loading) {
    return (
      <div className="text-white main-background lg:p-15 p-5 sm:p-8 min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#9B7EDE]/30 border-t-[#9B7EDE] rounded-full"
        />
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="text-white main-background lg:p-15 p-5 sm:p-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#B8A7E5] hover:text-white transition-colors mb-6 font-Inter text-sm"
        >
          <ArrowLeft size={16} />
          <span>{t('back')}</span>
        </button>

        <div className="flex items-start gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B7EDE]/30 to-[#7C5FBD]/20 border border-[#9B7EDE]/40 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Trophy size={28} className="text-[#B59EF7]" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-2">{t('title')}</h1>
            <p className="text-[#B8A7E5] font-Inter text-sm md:text-base">
              {t('description', { unlocked: unlockedCount, total: totalCount })}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="bg-white/5 border border-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-[#9B7EDE] via-[#B59EF7] to-[#7C5FBD] rounded-full"
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="font-blinker text-xs text-[#B8A7E5]/70">
              {t('progress')}
            </p>
            <p className="font-blinker text-sm font-bold text-[#B59EF7]">
              {unlockedCount}/{totalCount}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="space-y-14">
        {categoryOrder.map((type, categoryIndex) => {
          const items = groupedByType[type] || [];
          if (items.length === 0) return null;

          const config = categoryConfig[type];

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + categoryIndex * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div 
                  className="w-1 h-8 rounded-full"
                  style={{ background: config.titleColor }}
                />
                <h2 className="text-2xl font-poppins font-bold capitalize" style={{ color: config.titleColor }}>
                  {categoryLabels[type]}
                </h2>
              </div>

              {/* 2x2 Grid per category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((achievement, index) => (
                  <motion.div
                    key={achievement.code}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.1 + categoryIndex * 0.1 + index * 0.05,
                      duration: 0.4
                    }}
                    whileHover={{ y: achievement.unlocked ? -4 : 0 }}
                    className="group relative"
                  >
                    {/* Glow effect for unlocked */}
                    {achievement.unlocked && (
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#9B7EDE]/20 to-transparent rounded-[24px] blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
                    )}

                    <div
                      className={`relative bg-gradient-to-br ${config.gradient} border ${config.border} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                        achievement.unlocked
                          ? 'hover:border-[#B59EF7]/50'
                          : 'opacity-50 hover:opacity-70'
                      }`}
                    >
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#9B7EDE]/5 to-transparent rounded-full -mr-12 -mt-12" />

                      {/* Checkmark for unlocked */}
                      {achievement.unlocked && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: 'spring' }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-[#00C950] to-[#00A540] rounded-full flex items-center justify-center shadow-lg border border-green-300/30"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 8L5.5 13L15 3"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      )}

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon and Badge */}
                        <div className="flex items-start justify-between mb-5">
                          <div
                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badgeGradients[achievement.badge]} flex items-center justify-center text-3xl shadow-lg backdrop-blur-sm border border-white/10`}
                          >
                            {achievement.icon}
                          </div>
                          <div
                            className={`px-3 py-1 rounded-lg text-xs font-blinker font-bold uppercase text-white/90 bg-white/10 border border-white/20 backdrop-blur-sm`}
                          >
                            {achievement.badge}
                          </div>
                        </div>

                        {/* Name and Description */}
                        <h3 className="text-lg font-poppins font-bold mb-2 text-white">{achievement.name}</h3>
                        <p className="text-sm font-Inter text-white/70 mb-4 leading-relaxed">{achievement.description}</p>

                        {/* Unlock Date or Locked Message */}
                        <div className="pt-5 border-t border-white/10">
                          {achievement.unlocked && achievement.unlockedAt ? (
                            <p className="text-xs font-Inter text-[#B8A7E5]/60">
                              ✓ {t('unlockedOn')} {new Date(achievement.unlockedAt).toLocaleDateString(
                                i18n.language === 'ar' ? 'ar-SA' : 'en-US',
                                { month: 'short', day: 'numeric', year: 'numeric' }
                              )}
                            </p>
                          ) : (
                            <p className="text-xs font-Inter text-white/40 italic">{t('locked')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-[#FF6B6B] font-Inter mb-4">{error}</p>
          <button
            onClick={fetchAchievements}
            className="px-6 py-2 bg-gradient-to-r from-[#9B7EDE]/20 to-[#7C5FBD]/20 border border-[#9B7EDE]/40 rounded-lg hover:border-[#B59EF7]/60 transition-all duration-300 font-Inter text-sm text-[#B59EF7] hover:text-white"
          >
            {t('retry')}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default Achievements;

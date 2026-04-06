import { AchievementIcon, CompletedIcon, FireIcon } from "@/comp/ui/Icons";
import { NoteIcon, TimerIcon } from "@/comp/ui/Icons";
import TopCard, { Card, T } from "@/comp/ui/TopCard";
import useCountUp from "@/hooks/useCountUp";
import Dots from "@/comp/ui/Dots";
import Donut from "@/comp/ui/Donut";
import ProgressBar from "@/comp/ui/ProgressBar";
import { useTranslation } from "react-i18next";

export default function TodaysSummary({ mockUserData }) {
  const { t } = useTranslation(['dashboard']);
  const [streak, goals, achievements, hours] = [useCountUp(mockUserData.streak, 365), useCountUp(mockUserData.goals, 400), useCountUp(mockUserData.achievements, 500), useCountUp(mockUserData.hours.hoursThisWeek, 0)];
  const pct = Math.round(mockUserData.hours.hoursThisWeek / mockUserData.hours.totalHours * 100)
  
  return (
    <section className="mt-15">
      <div className="grid font-blinker grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-20">
        
        <TopCard variant="purple" delay={0} icon={<FireIcon />} value={streak} sub={t('summary.currentStreak.sub')} label={t('summary.currentStreak.label')} />

        <TopCard variant="dark" delay={100}
          icon={<CompletedIcon />}
          value={goals} extra={<span className="font-semibold text-gray-200 text-lg">{t('summary.goalsCompleted.extra')}</span>}
          sub={t('summary.goalsCompleted.sub')} label={t('summary.goalsCompleted.label')}
        />

        <TopCard variant="purple" delay={200}
          icon={<AchievementIcon />}
          value={achievements} sub={t('summary.achievements.sub')} label={t('summary.achievements.label')}
        />

        {/* Study Hours */}
        <Card variant="light" delay={300}>
          <div className="flex lg:flex-row flex-col items-center gap-2">
            <TimerIcon />
            <span className="text-sm lg:text-start text-center font-semibold" style={{ color: 'white' }}>{t('summary.studyHours.label')}</span>
          </div>
          <div className="mt-3">
            <span className="font-bold text-lg lg:text-3xl font-poppins">{hours}</span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'white' }}>{t('summary.studyHours.subLabel')}</div>
          <ProgressBar value={28.5} max={40} delay={600} />
        </Card>

        {/* Tasks */}
        <Card variant="light" delay={400}>
          <div className="flex items-center gap-2">
            <NoteIcon />
            <span className="font-semibold" style={{ ...T.light }}>{t('summary.tasks.label')}</span>
          </div>
          <div className='font-semibold mt-2' style={{ ...T.light }} >{mockUserData.tasks.doneTasks}/{mockUserData.tasks.totalTasks}</div>
          <div className="text-white text-sm">{mockUserData.tasks.totalTasks - mockUserData.tasks.doneTasks} {t('summary.tasks.remaining')}</div>
          <Dots done={12} total={18} delay={600} />
        </Card>

        {/* Donut */}
        <Card variant="light" delay={500}>
          <span className="font-semibold" style={{ ...T.light }}>{t('summary.donutChart.label')}</span>
          <div className="flex lg:flex-row flex-col items-center gap-4 mt-2">
            <Donut pct={pct} />
            <div className="flex flex-col gap-2">
              {[["#9067c6", t('summary.donutChart.completed')], ["white", t('summary.donutChart.remaining')]].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: bg }} />
                  <span style={{ ...T.light, fontSize: 12 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
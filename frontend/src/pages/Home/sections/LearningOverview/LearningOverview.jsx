import GlassySection from "@/comp/ui/GlassySection";
import LiquidGlassButton from "@/comp/ui/LiquidGlassButton";
import { StartIcon, CalenderIcon } from "@/comp/ui/Icons";
import { Card } from "@/comp/ui/TopCard";
import { Calendar, HandshakeIcon } from "lucide-react";
import { motion } from "framer-motion";
const LearningOverview = ({ mockUserData }) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8 mt-10 items-start">

        {/* Left column — AI + Today's Schedule stacked */}
        <div className="flex-1 flex flex-col gap-8">

          <GlassySection>
            <motion.svg
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
              width="90" height="50" viewBox="0 0 90 50" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
            >
              <g transform="translate(-10,0)">
                <path d="M37.839 5.68658C38.0905 5.04897 38.993 5.04897 39.2445 5.68658L39.9559 7.49087C40.4167 8.65887 41.3413 9.58345 42.5092 10.0441L44.3136 10.7557C44.9511 11.0072 44.9511 11.9096 44.3136 12.161L42.5092 12.8726C41.3413 13.3333 40.4167 14.2579 39.9559 15.4259L39.2445 17.2302C38.993 17.8678 38.0905 17.8678 37.839 17.2302L37.1276 15.4259C36.6667 14.2579 35.7422 13.3333 34.5742 12.8726L32.7699 12.161C32.1324 11.9096 32.1324 11.0072 32.7699 10.7557L34.5742 10.0441C35.7422 9.58345 36.6667 8.65887 37.1276 7.49087L37.839 5.68658Z" stroke="#141B34" strokeWidth="1.5" />
              </g>
              <g transform="translate(40,0)">
                <path d="M15.7929 2.27523C16.4635 0.574922 18.8698 0.574922 19.5404 2.27523L21.4381 7.08667C22.6665 10.2014 25.1319 12.6669 28.2467 13.8952L33.0581 15.7929C34.7583 16.4635 34.7583 18.8698 33.0581 19.5404L28.2467 21.4381C25.1319 22.6665 22.6665 25.1319 21.4381 28.2467L19.5404 33.0581C18.8698 34.7583 16.4635 34.7583 15.7929 33.0581L13.8953 28.2467C12.6669 25.1319 10.2014 22.6665 7.08667 21.4381L2.27523 19.5404C0.574922 18.8698 0.574922 16.4635 2.27523 15.7929L7.08667 13.8952C10.2014 12.6669 12.6669 10.2014 13.8953 7.08667L15.7929 2.27523Z" stroke="#141B34" strokeWidth="2" />
              </g>
            </motion.svg>

            <div className="flex font-poppins flex-col">
              <p className="font-semibold text-lg">AI Suggestion</p>
              <p className="font-blinker text-base">{mockUserData.aiRecommendation}</p>
              <LiquidGlassButton icon={StartIcon} className="px-2 lg:w-1/5 w-1/2 mt-6 py-1">
                Start Session
              </LiquidGlassButton>
            </div>
          </GlassySection>

          {/* Today's Schedule — sits directly under AI */}
          <Card variant="dark" className="cursor-pointer p-4">
            <p className="font-poppins text-lg">Today's Schedule Here</p>
            <div className="flex flex-col gap-4 items-center">
              {mockUserData.todaysSchedule.map((subj) => {
                return (
                  <GlassySection classname={'w-full mt-2 flex justify-between'}>
                    <div className="flex flex-row items-center gap-3">
                      <p className="tracking-wdiest flex flex-row gap-3 items-center">{subj.time}
                        <svg width="1" height="70" viewBox="0 0 1 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="0.5" x2="0.5" y2="70" stroke="white" />
                        </svg>
                      </p>
                      <div className="flex flex-col">
                        <p className="font-semibold">{subj.subject}</p>
                        <p className="text-xs">{subj.session}</p>
                      </div>
                    </div>
                    <div className={`${subj.difficulty === 'Easy' && "glassy-easy-background"}
                  ${subj.difficulty === 'Hard' && "glassy-hard-background"}
                  ${subj.difficulty === 'Medium' && "glassy-medium-background"}
                  px-3 py-1 text-lg rounded-full font-blinker`}>{subj.difficulty}</div>
                  </GlassySection>
                )
              })}
            </div>
          </Card>

        </div>

        {/* Right column — Upcoming Schedule + XASDASD stacked */}
        <div className="flex flex-col gap-8 shrink-0 lg:w-1/4 w-full">

          <div className="glassy-secondary-background rounded-3xl p-5">
            <p className="flex flex-row font-blinker font-semibold gap-5 items-center text-lg"><CalenderIcon />Upcoming Schedule</p>
            {mockUserData.upComingSchedule.map((subj, index) => (
              <Card key={index} className="mt-5 p-8 relative overflow-hidden" variant="dark">
                <div
                  className="glassy-secondary-background absolute top-2 right-3 px-2 py-1 rounded-full text-xs font-semibold font-blinker"
                  style={{ color: "#f7ece1" }}
                >
                  {subj.daysLeft} days
                </div>
                <div className="flex flex-row justify-center">
                  <p className="font-blinker text-lg font-semibold">{subj.subject}</p>
                </div>
                <p className="flex flex-row gap-3 items-center font-blinker text-xs">
                  <Calendar size={20} />{subj.date}
                </p>
              </Card>
            ))}
          </div>

          {/* Friends Section  */}
          <div className="glassy-secondary-background rounded-3xl p-5 ">
            <p className="font-blinker flex flex-row gap-3 items-center font-semibold text-lg"><HandshakeIcon />Friend's Progress</p>
            <div className="flex flex-row items-end justify-around mt-6 h-40 px-2">
    {[
      { name: "Mohamed", height: 112 },
      { name: "Islam",   height: 88 },
      { name: "Roshdy",  height: 144 },
      { name: "Hoka",    height: 72},
    ].map((friend) => (
      <div key={friend.name} className="flex flex-col items-center gap-2 w-1/5">
        <div
          className="w-full rounded-t-2xl rounded-b-md"
          style={{
            height: friend.height,
            background: "rgba(30, 20, 60, 0.75)",
            minHeight: "24px",
          }}
        />
        <p className="font-blinker text-xs text-center">{friend.name}</p>
      </div>
    ))}
  </div>
  <p className="font-blinker text-center text-sm mt-4">
    You're ahead of 2 friends this week! 🎉
  </p>
  {/* Footer message */} </div>

        </div>

      </div>
    </div>
  )
}

export default LearningOverview
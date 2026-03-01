import AiImage from "../assets/ai.svg";
import analytics from "../assets/analytics.svg";
import flash from "../assets/flash.svg";
import group from "../assets/group.svg";
import schedule from "../assets/schedule.svg";
import timer from "../assets/timer.svg";

export const cards_data=[{
    header:'AI-Powered Planning',
    src:AiImage,
    paragraph: "Smart algorithms analyze your learning patterns and suggest optimal study schedules."
},
{
    header:'Smart Timer',
    src:timer,
    paragraph:'Pomodoro-style timer with automatic breaks and productivity tracking.'
},
{
    header:'Visual Schedule',
    src:schedule,
    paragraph:'Beautiful calendar views with drag-and-drop scheduling and color-coded tasks.'
},
{
    header:'Study Groups',
    src:group,
    paragraph:'Collaborate with friends, share progress, and stay motivated together.'
},
{
    header:'Progress Analytics',
    src:analytics,
    paragraph:'Detailed insights and charts to track your productivity and improvement.'
},
{
    header:'Quick Actions',
    src:flash,
    paragraph:'DAccess your most-used features instantly with smart shortcuts and widgets.'
}

]
export const ai_cards=[{
    icon:<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4V38C4 41.32 6.68 44 10 44H44" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 34L19.18 23.28C20.7 21.52 23.4 21.4 25.04 23.06L26.94 24.96C28.58 26.6 31.28 26.5 32.8 24.74L42 14" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>,
header:'Weekly Insight',
paragraph:'Your focus time increased by 23% this week! Keep up the momentum. 🎉'
},{
    icon:<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.4801 4H17.5201C10.0001 4 9.42008 10.76 13.4801 14.44L34.5201 33.56C38.5801 37.24 38.0001 44 30.4801 44H17.5201C10.0001 44 9.42008 37.24 13.4801 33.56L34.5201 14.44C38.5801 10.76 38.0001 4 30.4801 4Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>,
header:'Smart Reminder',
paragraph:'Your Algorithms exam is in 3 days. Want to add extra review sessions?',
},{
    icon:<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.1 5.06007L8.06004 12.9201C4.20004 15.4401 4.20004 21.0801 8.06004 23.6001L20.1 31.4601C22.26 32.8801 25.82 32.8801 27.98 31.4601L39.96 23.6001C43.8 21.0801 43.8 15.4601 39.96 12.9401L27.98 5.08007C25.82 3.64007 22.26 3.64007 20.1 5.06007Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.26 26.1599L11.24 35.5399C11.24 38.0799 13.2 40.7999 15.6 41.5999L21.98 43.7199C23.08 44.0799 24.9 44.0799 26.02 43.7199L32.4 41.5999C34.8 40.7999 36.76 38.0799 36.76 35.5399V26.2599" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M42.8 30V18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>,
header:'Adaptive Learning',
paragraph:'Adjusts difficulty and timing based on your progress'
}]
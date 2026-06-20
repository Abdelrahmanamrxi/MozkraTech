import { createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Body from "./comp/layout/Body.jsx";
import "./App.css"
import ProtectedRoute from "./comp/auth/ProtectedRoute.jsx";
import ErrorFallback from "./comp/error/ErrorFallback.jsx";
import { load } from "./comp/loading/pageLoader.jsx"; // helper above
import { RouterProvider } from "react-router-dom";
const LandingPage = load(
  () => import("./pages/LandingPage/LandingPage"),
  "Loading..."
);

const SignupPage = load(
  () => import("./pages/SignupPage/index.jsx"),
  "Loading..."
);

const LoginPage = load(
  () => import("./pages/LoginPage/LoginPage"),
  "Welcome back..."
);

const ForgetPassword = load(
  () => import("./pages/ForgetPassword"),
  "Loading..."
);

const Home = load(
  () => import("./pages/Dashboard/Dashboard.jsx"),
  "Loading dashboard..."
);

const Chatbot = load(
  () => import("./pages/Chatbot/Chatbot"),
  "Starting AI assistant..."
);

const Schedule = load(
  () => import("./pages/Schedule/Schedule.jsx"),
  "Loading schedule..."
);

const Friends = load(
  () => import("./pages/Friends/Friends.jsx"),
  "Loading friends..."
);

const FriendsMessages = load(
  () => import("./pages/Friends/FriendsMessages/FriendsMessages.jsx"),
  "Loading messages..."
);

const Timer = load(
  () => import("./pages/Timer/Timer.jsx"),
  "Preparing focus mode..."
);

const Progress = load(
  () => import("./pages/Progress/Progress.jsx"),
  "Loading progress..."
);

const SubjectRegister = load(
  () => import("./pages/SubjectRegister/subjectRegister.jsx"),
  "Setting up subjects..."
);

const PeopleProfile = load(
  () => import("./pages/PeopleProfile/PeopleProfile.jsx"),
  "Loading profile..."
);

const AISchedule = load(
  () => import("./pages/AISchedule/AISchedule.jsx"),
  "Generating AI schedule..."
);

const Profile = load(
  () => import("./pages/Profile/Profile.jsx"),
  "Loading your profile..."
);

const Achievements = load(
  () => import("./pages/Achievements/Achievements.jsx"),
  "Loading achievements..."
);

const Quizzes = load(
  () => import("./pages/Quizzes/Quizzes.jsx"),
  "Loading quizzes..."
);
const router = createBrowserRouter([
  // ✅ PUBLIC ROUTES WITH BODY LAYOUT
  {
    element: <Body />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
    ],
  },

  // ✅ PUBLIC ROUTES WITHOUT BODY LAYOUT
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPassword />,
  },

  // ✅ PROTECTED ROUTES WITH BODY LAYOUT
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorFallback />, // ✅ ADD THIS
    children: [
      {
        element: <Body />,
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "/dashboard",
            element: <Home />,
          },
          {
            path: "/dashboard/schedule",
            element: <Schedule />,
          },
          {
            path: "/dashboard/friends",
            element: <Friends />,
          },
          {
            path: "/dashboard/messages",
            element: <FriendsMessages />,
          },
          {
            path: "/dashboard/progress",
            element: <Progress />,
          },
          {
            path: "/dashboard/quizzes",
            element: <Quizzes />,
          },
          {
            path: "/dashboard/myprofile",
            element: <Profile />,
          },
          {
            path: "/dashboard/achievements",
            element: <Achievements />,
          },
        ],
      },
    ],
  },

  // ✅ PROTECTED ROUTES WITHOUT BODY LAYOUT
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorFallback />, // ✅ ADD THIS
    children: [
      {
        path: "/subject-register",
        element: <SubjectRegister />,
      },
      {
        path: "/edit-subjects",
        element: <SubjectRegister isEdit />,
      },
      {
        path: "/schedule-generation",
        element: <AISchedule />,
      },
      {
        path: "/dashboard/timer",
        element: <Timer />,
      },
      {
        path: "/dashboard/ai",
        element: <Chatbot />,
      },
      {
        path: "/dashboard/profile/:id",
        element: <PeopleProfile />,
      },
    ],
  },
]);

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);


  return <RouterProvider router={router} />;
}

export default App;

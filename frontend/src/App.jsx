import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignupPage from "./pages/SignupPage/index.jsx";
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Dashboard/Dashboard.jsx";
import Chatbot from "./pages/Chatbot/Chatbot";
import "./App.css";
import Schedule from "./pages/Schedule/Schedule.jsx";
import Friends from "./pages/Friends/Friends.jsx";
import Timer from "./pages/Timer/Timer.jsx";
import Progress from "./pages/Progress/Progress.jsx";
import Body from "./comp/layout/Body.jsx";
import ProtectedRoute from "./comp/auth/ProtectedRoute.jsx";
import ErrorFallback from "./comp/error/ErrorFallback.jsx";
import PeopleProfile from "./pages/Profile/PeopleProfile/PeopleProfile.jsx";

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
    errorElement: <ErrorFallback />,  // ✅ ADD THIS
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
            path: "/dashboard/progress",
            element: <Progress />,
          },
         
        ],
      },
    ],
  },

  // ✅ PROTECTED ROUTES WITHOUT BODY LAYOUT
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorFallback />,  // ✅ ADD THIS
    children: [
      {
        path: "/dashboard/timer",
        element: <Timer />,
      },
      {
        path: "/dashboard/ai",
        element: <Chatbot />,
      },
       {
            path:"/dashboard/profile/:id",
            element:<PeopleProfile/>
          }
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
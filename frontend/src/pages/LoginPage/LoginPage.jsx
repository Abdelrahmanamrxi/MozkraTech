import {useState,useRef} from "react";
import { useTranslation } from "react-i18next";
import FormContainer from "../../comp/containers/FormContainer";
import { Link,useNavigate } from "react-router";
import Logo from "../../comp/logo/Logo";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Footer from "../../comp/layout/Footer/Footer";
import { ArrowLeftIcon } from "lucide-react";
import { setAccessToken } from "../../slices/authSlice";


function LoginPage() {
  const { t, i18n } = useTranslation("common");
  const dispatch=useDispatch()
  const baseUrl=import.meta.env.VITE_BACKEND_URL
  const [error,setErrors]=useState({google:'',login:''})
  const googleLoginRef=useRef(null)
  const navigate=useNavigate()

  async function handleLoginGoogleSuccess(credentialResponse)
  {
    setErrors({})
    const idToken=credentialResponse?.credential
    
    if(!idToken){
      setErrors((prev)=>{
        return {...prev,google:"Login Failed"}
      })
    }
    try{
      const response=await axios.post(`${baseUrl}/auth/login-with-google`,{idToken},{
        withCredentials:true
      })
      dispatch(setAccessToken(response.data.accessToken))
      navigate('/dashboard')
    }
    catch(err){
          const message = err?.response?.data?.message || err.message || "Login Failed";
          setErrors({ google: message });
    }
  }
  const handleGoogleButtonClick=()=>{
      if (googleLoginRef.current) {
    // Find the button element and click it
    const button = googleLoginRef.current.querySelector('button') || 
         googleLoginRef.current.querySelector('[role="button"]') ||
         googleLoginRef.current.querySelector('div[role="button"]');
    if (button) {
      button.click();
    }
  }
  }


  const isRtl = i18n.language === "ar";
  const backPositionClasses = isRtl ? "absolute top-6 right-6 lg:right-20" : "absolute top-6 left-6 lg:left-20";
  const headingAccent = t("loginPage.headingAccent");

  return (
    <div className="flex flex-col relative ">
      <Link
        to=".."
        className={`${backPositionClasses} z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
        aria-label={t("loginPage.back")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {t("loginPage.back")}
      </Link>
      <div className={`min-h-screen flex flex-col gap-3 ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"} main-background items-center lg:justify-between relative lg:px-14 px-6 py-20`}>
        {/* LEFT SIDE */}
        <div className={`lg:w-1/2 w-full space-y-6 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
          <Logo />

          <motion.h1
            className="text-5xl flex flex-col  gap-3 lg:flex-col text-white lg:text-6xl font-sans font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("loginPage.heading")}
            {headingAccent ? <span className="text-primary">{headingAccent}</span> : null}
          </motion.h1>

          <motion.p
            className={`font-blinker text-center ${isRtl ? "lg:text-right" : "lg:text-left"} text-secondary text-base lg:text-lg`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {t("loginPage.description")}
          </motion.p>
        </div>

        <FormContainer>
          <h2 className="text-3xl text-white font-sans font-semibold text-center mb-2">
            {t("loginPage.logIn")}
          </h2>
              <div
                  ref={googleLoginRef}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                    pointerEvents: "none"
                  }}
                >
                  <GoogleLogin
                    onSuccess={handleLoginGoogleSuccess}
                    onError={() => {
                      console.error("Google login failed");
                      setErrors({ google: "Google login failed. Please try again." });
                    }}
                  />
                </div>
          
          <button onClick={handleGoogleButtonClick} className="w-full text-white mt-3 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 transition rounded-full py-2 mb-6">
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.6002 10.2H12.2002V13.9H17.7002C17.6002 14.8 17.0002 16.2 15.7002 17.1C14.9002 17.7 13.7002 18.1 12.2002 18.1C9.6002 18.1 7.3002 16.4 6.5002 13.9C6.3002 13.3 6.2002 12.6 6.2002 11.9C6.2002 11.2 6.3002 10.5 6.5002 9.9C6.6002 9.7 6.6002 9.5 6.7002 9.4C7.6002 7.3 9.7002 5.8 12.2002 5.8C14.1002 5.8 15.3002 6.6 16.1002 7.3L18.9002 4.5C17.2002 3 14.9002 2 12.2002 2C8.3002 2 4.9002 4.2 3.3002 7.5C2.6002 8.9 2.2002 10.4 2.2002 12C2.2002 13.6 2.6002 15.1 3.3002 16.5C4.9002 19.8 8.3002 22 12.2002 22C14.9002 22 17.2002 21.1 18.8002 19.6C20.7002 17.9 21.8002 15.3 21.8002 12.2C21.8002 11.4 21.7002 10.8 21.6002 10.2Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            {t("loginPage.google")}
            
          </button>
        {error.google && (
  <p className="w-full text-red-400 text-center text-base mb-5">
    {error.google}
  </p>
)}
          <div className="space-y-10">
              
            <div className="flex items-center gap-3 text-sm text-secondary mb-6">
              <div className="h-px bg-white/20 flex-1"></div>
              {t("loginPage.or")}
              <div className="h-px bg-white/20 flex-1"></div>
            </div>
                    
            <input type="email" placeholder={t("loginPage.emailPlaceholder")} className="form-input" />

            <input
              type="password"
              placeholder={t("loginPage.passwordPlaceholder")}
              className="form-input"
            />
          </div>
          <div className="text-right mt-3">
            <Link to="/forgot-password" className="text-sm  text-secondary hover:text-white transition-colors">
              {t("loginPage.forgotPassword")}
            </Link>
          </div>
          <div className="text-center text-sm text-secondary mt-5">
            <Link to="/signup" className="underline underline-offset-4">
              {t("loginPage.signupPrompt")}
            </Link>
          </div>
          <Link to="/home">
            <motion.button
              className="create-account-button text-white mx-auto block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.44,
              }}
              whileTap={{ scale: 0.96 }}
            >
              {t("loginPage.loginButton")}
            </motion.button>
          </Link>
        </FormContainer>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;

import {useState} from "react";
import { useTranslation } from "react-i18next";
import FormContainer from "../../comp/containers/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../comp/logo/Logo";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Footer from "../../comp/layout/Footer/Footer";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { setAccessToken } from "../../slices/authSlice";


function LoginPage() {
  const { t, i18n } = useTranslation("common");
  const location=useLocation()
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [errors, setErrors] = useState({ google: "", login: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
    console.log(location)
     useEffect(() => {
        if (location.state?.message) {
            setErrors((prev) => ({
                ...prev,
                login: location.state.message
            }))
        }
    }, [location]) 

  async function handleSubmit(e) {
    e.preventDefault();

    const fieldErrors = {};
    if (!formData.email.trim()) {
      fieldErrors.email = t("loginPage.errors.emailRequired");
    }
    if (!formData.password) {
      fieldErrors.password = t("loginPage.errors.passwordRequired");
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...fieldErrors, login: "" }));
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, login: "" }));

    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        formData,
        {
          withCredentials: true
        }
      );
      dispatch(setAccessToken(response.data.accessToken));
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Login Failed";
      setErrors((prev) => ({ ...prev, login: message }));
    } finally {
      setIsLoading(false);
    }
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "", login: "" }));
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }


  async function handleLoginGoogleSuccess(credentialResponse) {
    setErrors((prev) => ({ ...prev, google: "", login: "" }));
    const idToken = credentialResponse?.credential;

    if (!idToken) {
      setErrors((prev) => ({ ...prev, google: "Login Failed" }));
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
          setErrors((prev) => ({ ...prev, google: message }));
    }
  }
  const isRtl = i18n.language === "ar";
  const backPositionClasses = isRtl ? "absolute top-6 right-6 lg:right-20" : "absolute top-6 left-6 lg:left-20";
  const headingAccent = t("loginPage.headingAccent");




  return (
    <div className="flex flex-col relative w-full overflow-x-hidden">
      <Link
        to=".."
        className={`${backPositionClasses} z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
        aria-label={t("loginPage.back")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {t("loginPage.back")}
      </Link>
      <div className={`min-h-[100dvh] lg:min-h-screen w-full flex flex-col gap-3 ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"} main-background items-center lg:justify-between relative lg:px-14 px-6 lg:py-20 py-14`}>
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
       <style>{`
  .google-login-wrapper {
    display: flex;
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: fit-content;
  }

  .google-login-wrapper:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    transform: translateY(-2px);
  }

  .google-login-wrapper div {
    border-radius: 16px;
  }
`}</style>

<div className="google-login-wrapper mb-5 mt-4">
  <GoogleLogin
    onSuccess={handleLoginGoogleSuccess}
    onError={() => {
      setErrors({ google: "Google login failed. Please try again." });
    }}
    theme="filled_black"
    size="large"
    width="350"
  />
</div>
          {errors.google && (
            <p className="w-full text-red-400 text-center text-base mb-5">
              {errors.google}
            </p>
          )}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm text-secondary mb-6">
              <div className="h-px bg-white/20 flex-1"></div>
              {t("loginPage.or")}
              <div className="h-px bg-white/20 flex-1"></div>
            </div>
            {errors.login && (
              <p className="w-full text-red-400 text-center text-base mb-3">
                {errors.login}
              </p>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder={t("loginPage.emailPlaceholder")}
                  className="form-input"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  onChange={handleChange}
                  name="password"
                  placeholder={t("loginPage.passwordPlaceholder")}
                  className="form-input"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
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
        
            <motion.button
              onClick={handleSubmit}
              type="button"
              disabled={isLoading}
              className={`create-account-button text-white mx-auto block ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.44,
              }}
              whileTap={{ scale: isLoading ? 1 : 0.96 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("loginPage.loggingIn") || t("loginPage.loginButton")}
                </span>
              ) : (
                t("loginPage.loginButton")
              )}
            </motion.button>
         
        </FormContainer>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;

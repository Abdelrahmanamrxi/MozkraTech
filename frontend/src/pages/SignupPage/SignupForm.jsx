import { motion as Motion } from "framer-motion";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import SignupOtpStep from "./SignupOtpStep";
import useSignupForm from "../../hooks/useSignupForm";
import { setAccessToken } from "../../slices/authSlice";
import {useDispatch} from 'react-redux'
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
import { useNavigate } from "react-router";

function SignupForm({ isRtl, t }) {
 const baseUrl=import.meta.env.VITE_BACKEND_URL
 const navigate=useNavigate()
 const dispatch=useDispatch()
 const googleLoginRef = useRef(null)
    
  const {
    formData,
    errors,
    step,
    otp,
    loading,
    showPassword,
    showConfirmPassword,
    timeLeft,
    expired,
    genderOptions,
    handleChange,
    handleGenderChange,
    handleBirthDate,
    handleSubmit,
    handleOtpSubmit,
    handleResendOtp,
    setOtp,
    setErrors,
    setShowPassword,
    setShowConfirmPassword,
  } = useSignupForm(t);

// Handle Google sign-up success - receives credential with ID token
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    // Get the ID token from credential (JWT token)
    const idToken = credentialResponse?.credential;
    
    if (!idToken) {
      console.error("ID token missing from credential response");
      setErrors({ submit: "Google authentication failed. Please try again." });
      return;
    }

  //console.log("ID Token received successfully");

    // Construct birthDate from formData
    const { day, month, year } = formData.birthDate;
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));

    // Send to backend
    const response = await axios.post(`${baseUrl}/auth/signup-with-google`, {
      idToken,
      birthDate,
      gender: formData.gender.toLowerCase(),
    },{withCredentials:true});

    // Save access token
    dispatch(setAccessToken(response.data.accessToken));
    navigate('/dashboard')
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Registration failed";
   // console.error("Google signup error:", err);
    setErrors({ submit: message });
  }
};

// Validation check for Google signup
const googleSignupEnabled =
  Boolean(formData.birthDate.day) &&
  Boolean(formData.birthDate.month) &&
  Boolean(formData.birthDate.year) &&
  Boolean(formData.gender);

const handleGoogleButtonClick = () => {
  if (!googleSignupEnabled) {
    setErrors((prev) => ({
      ...prev,
      gender: formData.gender ? "" : "Please provide a gender before signing up with Google",
      birthDate: (formData.birthDate.day && formData.birthDate.month && formData.birthDate.year) 
        ? "" 
        : "Please provide your birthdate before signing up with Google",
    }));
    return; // Don't proceed with Google login if validation fails
  }
  // Find and click the Google button inside the ref
  if (googleLoginRef.current) {
    // Find the button element and click it
    const button = googleLoginRef.current.querySelector('button') || 
         googleLoginRef.current.querySelector('[role="button"]') ||
         googleLoginRef.current.querySelector('div[role="button"]');
    if (button) {
      button.click();
    }
  }
};
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const renderSignupStep = () => (
    <>
      {errors.submit && <p className="text-red-400 text-sm text-center mb-3">{errors.submit}</p>}
      <form id="signup-form" onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder={t("signupPage.fullName")}
            className={`form-input ${errors.fullName ? "border-red-400" : ""}`}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1 ml-4">{errors.fullName}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder={t("signupPage.emailPlaceholder")}
            className={`form-input ${errors.email ? "border-red-400" : ""}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1 ml-4">{errors.email}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("signupPage.passwordPlaceholder")}
            className={`form-input ${errors.password ? "border-red-400" : ""} ${isRtl ? "pl-10" : "pr-10"}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t("signupPage.hide") : t("signupPage.show")}
            className={`absolute top-1/2 -translate-y-1/2 text-secondary hover:text-white ${isRtl ? "left-3" : "right-3"}`}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.password && <p className="text-red-400 text-xs mt-1 ml-4">{errors.password}</p>}
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("signupPage.confirmPasswordPlaceholder")}
            className={`form-input ${errors.confirmPassword ? "border-red-400" : ""} ${isRtl ? "pl-10" : "pr-10"}`}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? t("signupPage.hide") : t("signupPage.show")}
            className={`absolute top-1/2 -translate-y-1/2 text-secondary hover:text-white ${isRtl ? "left-3" : "right-3"}`}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-4">{errors.confirmPassword}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-center">
          <div className="min-w-0">
            <div className={`flex items-center justify-between gap-1 ${errors.gender ? "border-red-400" : ""}`}>
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleGenderChange(option.value)}
                  className={`flex-1 py-2 px-2 text-xs lg:text-sm rounded-full transition-all ${
                    formData.gender === option.value ? "bg-primary text-white" : "text-secondary hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-400 text-xs mt-1 ml-4">{errors.gender}</p>}
          </div>

          <div className="min-w-0">
            <div className="form-input flex items-center justify-center gap-1">
              <input
                type="number"
                placeholder={t("signupPage.birthDate.dayPlaceholder")}
                min={1}
                max={31}
                value={formData.birthDate.day}
                required
                onChange={(e) => handleBirthDate("day", e.target.value)}
                className="w-6 lg:w-8 bg-transparent text-white placeholder:text-secondary outline-none text-center text-sm"
              />
              <span className="text-secondary text-sm">/</span>
              <input
                type="number"
                placeholder={t("signupPage.birthDate.monthPlaceholder")}
                min={1}
                max={12}
                value={formData.birthDate.month}
                required
                onChange={(e) => handleBirthDate("month", e.target.value)}
                className="w-6 lg:w-8 bg-transparent text-white placeholder:text-secondary outline-none text-center text-sm"
              />
              <span className="text-secondary text-sm">/</span>
              <input
                type="number"
                placeholder={t("signupPage.birthDate.yearPlaceholder")}
                min={1900}
                max={2015}
                value={formData.birthDate.year}
                required
                onChange={(e) => handleBirthDate("year", e.target.value)}
                className="w-10 lg:w-14 bg-transparent text-white placeholder:text-secondary outline-none text-center text-sm"
              />
            </div>
            {errors.birthDate && <p className="text-red-400 text-xs mt-1 ml-4">{errors.birthDate}</p>}
          </div>
        </div>

        <div className="text-center text-sm text-secondary mt-5">
          <p>
            {t("signupPage.alreadyHaveAccount")}
            <Link className={`text-primary ${isRtl ? "mr-2" : "ml-2"} hover:underline`} to="/login">
              {t("signupPage.loginHere")}
            </Link>
          </p>
        </div>

        <Motion.button
          type="submit"
          className="create-account-button mx-auto block"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? t("forgetPassword.sending") : t("signupPage.createAccountButton")}
        </Motion.button>
      </form>
    </>
  );

  const renderOtpStep = () => (
    <SignupOtpStep
      otp={otp}
      onOtpChange={handleOtpChange}
      errors={errors}
      loading={loading}
      onSubmit={handleOtpSubmit}
      onResend={handleResendOtp}
      email={formData.email}
      timeLeft={timeLeft}
      expired={expired}
      t={t}
    />
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <p className="text-green-300 text-base">{t("signupPage.emailVerificationSuccess", "Email verified successfully.")}</p>
      <Link to="/login" className="text-primary hover:underline">
        {t("signupPage.loginHere")}
      </Link>
    </div>
  );

  return (
    <Motion.div
      className="mt-14 lg:mt-0 w-full max-w-md rounded-3xl p-10 relative border border-white/20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      style={{ boxShadow: "0 10px 32px rgba(144,103,198,0.95)" }}
    >
      <h2 className="text-3xl font-semibold text-center mb-2">{t("signupPage.createAccount")}</h2>
      <p className="text-center text-sm text-secondary mb-6">{t("signupPage.getStarted")}</p>
      
      <button  
        type="button"
        onClick={handleGoogleButtonClick}
        className="w-full cursor-pointer flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 transition rounded-full py-2 mb-6"
      >
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.6002 10.2H12.2002V13.9H17.7002C17.6002 14.8 17.0002 16.2 15.7002 17.1C14.9002 17.7 13.7002 18.1 12.2002 18.1C9.6002 18.1 7.3002 16.4 6.5002 13.9C6.3002 13.3 6.2002 12.6 6.2002 11.9C6.2002 11.2 6.3002 10.5 6.5002 9.9C6.6002 9.7 6.6002 9.5 6.7002 9.4C7.6002 7.3 9.7002 5.8 12.2002 5.8C14.1002 5.8 15.3002 6.6 16.1002 7.3L18.9002 4.5C17.2002 3 14.9002 2 12.2002 2C8.3002 2 4.9002 4.2 3.3002 7.5C2.6002 8.9 2.2002 10.4 2.2002 12C2.2002 13.6 2.6002 15.1 3.3002 16.5C4.9002 19.8 8.3002 22 12.2002 22C14.9002 22 17.2002 21.1 18.8002 19.6C20.7002 17.9 21.8002 15.3 21.8002 12.2C21.8002 11.4 21.7002 10.8 21.6002 10.2Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {t("signupPage.google")}
      </button>

      {/* GoogleLogin component - positioned off-screen so it can be triggered */}
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
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.error("Google Signup Failed");
            setErrors({ submit: "Google Signup Failed. Please try again." });
          }}
        />
      </div>

      <div className="flex items-center gap-3 text-sm text-secondary mb-6">
        <div className="h-px bg-white/20 flex-1"></div>
        {t("signupPage.or")}
        <div className="h-px bg-white/20 flex-1"></div>
      </div>

      {step === 1 ? renderSignupStep() : step === 2 ? renderOtpStep() : renderSuccessStep()}
    </Motion.div>
  );
}

export default SignupForm;
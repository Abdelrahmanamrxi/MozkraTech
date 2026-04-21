import { motion as Motion } from "framer-motion";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import SignupOtpStep from "./SignupOtpStep";
import useSignupForm from "../../hooks/useSignupForm";
import { setAccessToken } from "../../slices/authSlice";
import {useDispatch} from 'react-redux'
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function SignupForm({ isRtl, t }) {
 const baseUrl=import.meta.env.VITE_BACKEND_URL
 const navigate=useNavigate()
 const dispatch=useDispatch()
    
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

const handleOtpSubmitWithRedirect = async (e) => {
  await handleOtpSubmit(e, () => navigate("/subject-register"));
};

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
    navigate('/subject-register')
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Registration failed";
   // console.error("Google signup error:", err);
    setErrors({ submit: message });
  }
};

const isBirthDateComplete =
  Boolean(formData.birthDate.day) &&
  Boolean(formData.birthDate.month) &&
  Boolean(formData.birthDate.year);

const googleSignupEnabled = isBirthDateComplete && Boolean(formData.gender);
const requiredGenderMessage = t("signupPage.errors.genderRequired");
const requiredBirthDateMessage = t("signupPage.errors.birthDateRequired");

const handleGoogleDisabledClick = () => {
  if (googleSignupEnabled) return;

  setErrors((prev) => ({
    ...prev,
    gender: formData.gender ? prev.gender : requiredGenderMessage,
    birthDate: isBirthDateComplete ? prev.birthDate : requiredBirthDateMessage,
  }));
};

useEffect(() => {
  setErrors((prev) => {
    const next = { ...prev };
    let changed = false;

    if (formData.gender && next.gender === requiredGenderMessage) {
      next.gender = "";
      changed = true;
    }
    if (isBirthDateComplete && next.birthDate === requiredBirthDateMessage) {
      next.birthDate = "";
      changed = true;
    }

    return changed ? next : prev;
  });
}, [formData.gender, isBirthDateComplete, requiredGenderMessage, requiredBirthDateMessage, setErrors]);
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
      onSubmit={handleOtpSubmitWithRedirect}
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
         <style>{`
  .google-login-wrapper {
    position: relative;
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

  .google-login-wrapper.is-disabled {
    filter: saturate(0.55);
    opacity: 0.75;
  }

  .google-login-overlay {
    position: absolute;
    inset: 0;
    border: none;
    background: rgba(2, 6, 23, 0.18);
    cursor: not-allowed;
  }
`}</style>

<div className={`google-login-wrapper mb-5 mt-4 ${googleSignupEnabled ? "" : "is-disabled"}`}>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      setErrors({ submit: "Google login failed. Please try again." });
    }}
    theme="filled_black"
    size="large"
    width="350"
  />
  {!googleSignupEnabled && (
    <button
      type="button"
      className="google-login-overlay"
      onClick={handleGoogleDisabledClick}
      aria-label={t("signupPage.google")}
    />
  )}
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
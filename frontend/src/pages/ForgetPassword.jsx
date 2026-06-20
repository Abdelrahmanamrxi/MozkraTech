import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Logo from "../comp/logo/Logo";
import FormContainer from "../comp/containers/FormContainer";
import axios from "axios";
import useOtpTimer from "../hooks/useOtpTimer";

function ForgetPassword() {
  const { t, i18n } = useTranslation("common");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const isRtl = i18n.language === "ar";
  const backPositionClasses = isRtl ? "absolute top-6 right-6 lg:right-20" : "absolute top-6 left-6 lg:left-20";
  const backLinkDirection = isRtl ? "flex-row-reverse" : "";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { timeLeft, startTimer } = useOtpTimer(60);

  const navigate=useNavigate()
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validatePassword = (password) => password.length >= 8;

  // ── Step 1: send OTP ──────────────────────────────────────────────────────
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = t("forgetPassword.errors.emailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("forgetPassword.errors.validEmail");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await axios.post(`${baseUrl}/auth/forget-password`, { email });
      startTimer(1 * 60);
      setStep(2);
    } catch (err) {
      setErrors({ api: err?.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = t("forgetPassword.errors.otpRequired");
    } else if (otp.length !== 4) {
      newErrors.otp = t("forgetPassword.errors.otpDigits");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (timeLeft <= 0) {
      setErrors({ submit: t("forgetPassword.errors.otpExpired") });
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`${baseUrl}/auth/confirm-email`, { email, code: otp });
      setOtpCode(otp);
      setStep(3);
    } catch (err) {
      setErrors({ api: err?.response?.data?.message || t("forgetPassword.errors.invalidOtp") });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: reset password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = t("forgetPassword.errors.passwordRequired");
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = t("forgetPassword.errors.passwordLength");
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t("forgetPassword.errors.confirmPasswordRequired");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("forgetPassword.errors.passwordsMismatch");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await axios.patch(`${baseUrl}/auth/reset-password`, {
        email,
        code: otpCode,
        newPassword,
        confirmPassword
      });
      navigate('/login',{replace:true})
      // TODO: navigate to login or show success toast
    } catch (err) {
      setErrors({ api: err?.response?.data?.message || t("forgetPassword.errors.resetFailed") });
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResendOtp = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await axios.post(`${baseUrl}/auth/resend-otp`, { email });
        startTimer(1 * 60);
        setErrors({});
      } catch (err) {
        setErrors({ api: err?.response?.data?.message || t("forgetPassword.errors.resendFailed") });
      } finally {
        setLoading(false);
      }
    },
    [email,startTimer],
  );

  return (
    <div className="flex flex-col relative">
      <Link
        to=".."
        className={`${backPositionClasses} z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors ${backLinkDirection}`}
        aria-label={t("forgetPassword.back")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {t("forgetPassword.back")}
      </Link>

      <div className={`min-h-screen flex ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"} flex-col gap-3 main-background items-center lg:justify-between relative lg:px-14 px-6 py-20`}>
        {/* LEFT SIDE */}
        <div className={`lg:w-1/2 w-full space-y-6 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
          <Logo />
          <motion.h1
            className="text-5xl flex flex-col gap-3 lg:flex-col text-white lg:text-6xl font-sans font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("forgetPassword.heading")}
            <span className="text-primary">{t("forgetPassword.accent")}</span>
          </motion.h1>
          <motion.p
            className={`font-blinker text-center ${isRtl ? "lg:text-right" : "lg:text-left"} text-secondary text-base lg:text-lg`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {t("forgetPassword.description")}
          </motion.p>
        </div>

        {/* RIGHT FORM */}
        <FormContainer>
          {/* Step Progress */}
          <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                className="h-1.5 rounded-full w-12"
                animate={{ backgroundColor: step >= s ? "#9067c6" : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>

          {errors.api && (
            <p className="text-red-400 text-sm mb-4 text-center">{errors.api}</p>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl text-white font-sans font-semibold text-center mb-2">
                {t("forgetPassword.enterEmail")}
              </h2>
              <p className="text-center text-sm text-secondary mb-6">
                {t("forgetPassword.enterEmailSubtitle")}
              </p>

              <form onSubmit={handleEmailVerification} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder={t("forgetPassword.emailPlaceholder")}
                    className="form-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="create-account-button text-white mx-auto block disabled:opacity-50"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? t("forgetPassword.sending") : t("forgetPassword.sendOtp")}
                </motion.button>
              </form>

              <div className="text-center text-sm text-secondary mt-6">
                <Link to="/login" className="underline underline-offset-4">
                  {t("forgetPassword.backToLogin")}
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl text-white font-sans font-semibold text-center mb-2">
                {t("forgetPassword.enterOtp")}
              </h2>
              <p className="text-center text-sm text-secondary mb-6">
                {t("forgetPassword.otpSent")}
                <br />
                <span className="text-white font-semibold">{email}</span>
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder={t("forgetPassword.otpPlaceholder")}
                    maxLength="4"
                    className="form-input text-center tracking-widest text-2xl"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOtp(value);
                      if (errors.otp) setErrors({ ...errors, otp: "" });
                    }}
                  />
                  {errors.otp && (
                    <p className="text-red-400 text-sm mt-2">{errors.otp}</p>
                  )}
                  {errors.submit && (
                    <p className="text-red-400 text-sm mt-2">{errors.submit}</p>
                  )}
                </div>

                <p className="text-xs text-white/70 text-center">
                  {timeLeft > 0
                    ? `${t("forgetPassword.expiresIn")} ${String(Math.floor(timeLeft / 60)).padStart(2, "0")} : ${String(timeLeft % 60).padStart(2, "0")}`
                    : t("forgetPassword.otpExpiredMsg")}
                </p>

                <motion.button
                  type="submit"
                  disabled={loading || timeLeft <= 0}
                  className="create-account-button text-white mx-auto block disabled:opacity-50"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? t("forgetPassword.verifying") : t("forgetPassword.verifyOtp")}
                </motion.button>
              </form>

              <div className="text-center text-sm text-secondary mt-6 flex flex-col gap-3">
                <p>
                  {t("forgetPassword.didntReceiveCode")}
                  <button
                    onClick={handleResendOtp}
                    disabled={loading || timeLeft > 0}
                    className="text-primary cusor-pointer hover:text-white transition-colors disabled:opacity-50"
                  >
                    {t("forgetPassword.resend")}
                  </button>
                </p>
                <button
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setErrors({});
                  }}
                  className="underline underline-offset-4"
                >
                  {t("forgetPassword.useDifferentEmail")}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl text-white font-sans font-semibold text-center mb-2">
                {t("forgetPassword.resetPassword")}
              </h2>
              <p className="text-center text-sm text-secondary mb-6">
                {t("forgetPassword.resetPasswordSubtitle")}
              </p>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder={t("forgetPassword.newPasswordPlaceholder")}
                      className="form-input pr-10"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors({ ...errors, newPassword: "" });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showNewPassword
                        ? <EyeOffIcon className="w-4 h-4" />
                        : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-400 text-sm mt-2">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("forgetPassword.confirmPasswordPlaceholder")}
                      className="form-input pr-10"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword
                        ? <EyeOffIcon className="w-4 h-4" />
                        : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  
                  className="create-account-button text-white mx-auto block disabled:opacity-50"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? t("forgetPassword.resetting") : t("forgetPassword.resetPassword")}
                </motion.button>
              </form>
            </motion.div>
          )}
        </FormContainer>
      </div>
    </div>
  );
}

export default ForgetPassword;
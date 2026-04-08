import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import Logo from "../comp/logo/Logo";
import FormContainer from "../comp/containers/FormContainer";

function ForgetPassword() {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.language === "ar";
  const backPositionClasses = isRtl ? "absolute top-6 right-6 lg:right-20" : "absolute top-6 left-6 lg:left-20";
  const backLinkDirection = isRtl ? "flex-row-reverse" : "";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = t("forgetPassword.errors.emailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("forgetPassword.errors.validEmail");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Simulate API call to send OTP
      setTimeout(() => {
        setStep(2);
        setOtpTimeLeft(1 * 60);
        setLoading(false);
      }, 1500);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = t("forgetPassword.errors.otpRequired");
    } else if (otp.length !== 4) {
      newErrors.otp = t("forgetPassword.errors.otpDigits");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (otpTimeLeft <= 0) {
        setErrors({ submit: "OTP has expired. Please resend to get a new code." });
        return;
      }

      setLoading(true);
      // Simulate API call to verify OTP
      setTimeout(() => {
        // Redirect to reset password page or show success
        console.log("OTP verified, redirect to reset password");
        setLoading(false);
      }, 1500);
    }
  };

  const handleResendOtp = () => {
    setLoading(true);
    setOtpTimeLeft(1 * 60);
    setTimeout(() => {
      setLoading(false);
      // Resend OTP logic
    }, 1500);
  };

  useEffect(() => {
    if (step !== 2 || otpTimeLeft <= 0) return;

    const interval = setInterval(() => {
      setOtpTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step, otpTimeLeft]);

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
            <motion.div
              className={`h-1.5 rounded-full transition-all ${
                step >= 1 ? "bg-primary w-12" : "bg-white/20 w-12"
              }`}
              animate={{ backgroundColor: step >= 1 ? "#9067c6" : "rgba(255,255,255,0.2)" }}
            />
            <motion.div
              className={`h-1.5 rounded-full transition-all ${
                step >= 2 ? "bg-primary w-12" : "bg-white/20 w-12"
              }`}
              animate={{ backgroundColor: step >= 2 ? "#9067c6" : "rgba(255,255,255,0.2)" }}
            />
          </div>

          {step === 1 ? (
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

              <form onSubmit={handleEmailSubmit} className="space-y-6">
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
          ) : (
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
                      const value = e.target.value.replace(/\D/g, ""); // Only numbers
                      setOtp(value);
                      if (errors.otp) setErrors({ ...errors, otp: "" });
                    }}
                  />
                  {errors.otp && (
                    <p className="text-red-400 text-sm mt-2">{errors.otp}</p>
                  )}
                </div>

                <p className="text-xs text-white/70 text-center">
                  {otpTimeLeft > 0
                    ? `Expires in ${String(Math.floor(otpTimeLeft / 60)).padStart(2, "0")} : ${String(otpTimeLeft % 60).padStart(2, "0")}`
                    : "OTP expired. Please resend to get a new code."}
                </p>

                <motion.button
                  type="submit"
                  disabled={loading || otpTimeLeft <= 0}
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
                    disabled={loading}
                    className="text-primary hover:text-white transition-colors disabled:opacity-50"
                  >
                    {t("forgetPassword.resend")}
                  </button>
                </p>
                <button
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setErrors({});
                    setOtpTimeLeft(0);
                  }}
                  className="underline underline-offset-4"
                >
                  {t("forgetPassword.useDifferentEmail")}
                </button>
              </div>
            </motion.div>
          )}
        </FormContainer>
      </div>
    </div>
  );
}

export default ForgetPassword;

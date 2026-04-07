/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Logo from "../comp/logo/Logo";
import { Link } from "react-router";
import Footer from "../comp/layout/Footer/Footer";
import { ArrowLeftIcon } from "lucide-react";
function SignupPage() {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.language === "ar";
  const backPositionClasses = isRtl ? "absolute top-6 right-6 lg:right-20" : "absolute top-6 left-6 lg:left-20";
  const loginLinkMargin = isRtl ? "mr-2" : "ml-2";

  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" });

const handleBirthDate = (field, value) => {
  const limits = { day: 31, month: 12, year: new Date().getFullYear() };
  if (value > limits[field]) return;
  setBirthDate((prev) => ({ ...prev, [field]: value }));
};
  return (
    <div className="flex flex-col main-background relative">
      {/* Back link - absolute so it doesn't shift content */}
      <Link
        to=".."
        className={`${backPositionClasses} z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
        aria-label={t("signupPage.back")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {t("signupPage.back")}
      </Link>

      <div className={`min-h-screen flex ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"} flex-col items-center justify-between lg:px-14 px-6 py-20 text-white`}>
        {/* LEFT TEXT */}
        <div className={`lg:w-1/2 space-y-6 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
          <Logo />

          <motion.h1
            className="text-5xl flex flex-col gap-3 lg:flex-col text-white lg:text-6xl font-sans font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("signupPage.heading")}
            <br />
            <span className="text-primary">{t("signupPage.accent")}</span>
          </motion.h1>

          <motion.p
            className={`font-blinker text-center ${isRtl ? "lg:text-right" : "lg:text-left"} text-secondary text-base lg:text-lg`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {t("signupPage.description")}
          </motion.p>
        </div>

        {/* RIGHT FORM */}

        <motion.div
          className="mt-14 lg:mt-0 w-full max-w-md rounded-3xl p-10 relative border border-white/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            boxShadow: "0 10px 32px rgba(144,103,198,0.95)",
          }}
        >
          <h2 className="text-3xl font-semibold text-center mb-2">
            {t("signupPage.createAccount")}
          </h2>

          <p className="text-center text-sm text-secondary mb-6">
            {t("signupPage.getStarted")}
          </p>

          {/* Google Button */}

          <button className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 transition rounded-full py-2 mb-6">
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
            {t("signupPage.google")}
          </button>

          {/* Divider */}

          <div className="flex items-center gap-3 text-sm text-secondary mb-6">
            <div className="h-px bg-white/20 flex-1"></div>
            {t("signupPage.or")}
            <div className="h-px bg-white/20 flex-1"></div>
          </div>

          {/* Inputs */}
<div className="space-y-4">
  <input type="text" placeholder={t("signupPage.fullName")} className="form-input" />
  <input type="email" placeholder={t("signupPage.emailPlaceholder")} className="form-input" />
  <input type="password" placeholder={t("signupPage.passwordPlaceholder")} className="form-input" />
  <input type="password" placeholder={t("signupPage.confirmPasswordPlaceholder")} className="form-input border-primary" />

  {/* Gender + Birth Date in one row */}
  <div className={`flex ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"} flex-col gap-3`}>

    {/* Gender */}
    <div className="form-input flex items-center justify-between gap-1 flex-1">
      {[t("signupPage.gender.male"), t("signupPage.gender.female"), t("signupPage.gender.other")].map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => setGender(g)}
          className={`flex-1 py-1 px-2 text-sm rounded-full transition-all ${
            gender === g ? "bg-primary text-white" : "text-secondary hover:text-white"
          }`}
        >
          {g}
        </button>
      ))}
    </div>

    {/* Birth Date */}
    <div className="form-input flex items-center gap-1 flex-1">
      <input type="number" placeholder={t("signupPage.birthDate.dayPlaceholder")} min={1} max={31}
        value={birthDate.day}
        onChange={(e) => handleBirthDate("day", e.target.value)}
        className="w-8 bg-transparent text-white placeholder:text-secondary outline-none text-center"
      />
      <span className="text-secondary">/</span>
      <input type="number" placeholder={t("signupPage.birthDate.monthPlaceholder")} min={1} max={12}
        value={birthDate.month}
        onChange={(e) => handleBirthDate("month", e.target.value)}
        className="w-8 bg-transparent text-white placeholder:text-secondary outline-none text-center"
      />
      <span className="text-secondary">/</span>
      <input type="number" placeholder={t("signupPage.birthDate.yearPlaceholder")} min={1900} max={new Date().getFullYear()}
        value={birthDate.year}
        onChange={(e) => handleBirthDate("year", e.target.value)}
        className="w-14 bg-transparent text-white placeholder:text-secondary outline-none text-center"
      />
    </div>

  </div>
</div>

          <div className="text-center text-sm text-secondary mt-5">
            <p>
              {t("signupPage.alreadyHaveAccount")}
              <Link className={`text-primary ${loginLinkMargin} hover:underline`} to="/login">
                {t("signupPage.loginHere")}
              </Link>
            </p>
          </div>

          <motion.button
            className="create-account-button mx-auto block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.44,
            }}
            whileTap={{ scale: 0.96 }}
          >
            {t("signupPage.createAccountButton")}
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default SignupPage;

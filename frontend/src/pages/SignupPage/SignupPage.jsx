/* eslint-disable no-unused-vars */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import Logo from "../../comp/logo/Logo";
import SignupForm from "./SignupForm";
import Footer from "../../comp/layout/Footer/Footer";

function SignupPage() {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.language === "ar";
  const backPositionClasses = isRtl ? "absolute top-6 right-6 lg:right-20" : "absolute top-6 left-6 lg:left-20";

  return (
    <div className="flex flex-col main-background relative">
      <Link
        to=".."
        className={`${backPositionClasses} z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
        aria-label={t("signupPage.back")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {t("signupPage.back")}
      </Link>

      <div className={`min-h-screen flex ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"} flex-col items-center justify-between lg:px-14 px-6 py-20 text-white`}>
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

        <SignupForm isRtl={isRtl} t={t} />
      </div>

      <Footer />
    </div>
  );
}

export default SignupPage;

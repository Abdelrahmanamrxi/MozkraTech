import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import LandingenTranslation from "./locales/Landing/en.json";
import LandingarTranslation from "./locales/Landing/ar.json";
import CommonenTranslation from './locales/common/en.json'
import CommonarTranslation from './locales/common/ar.json'
import DashboardenTranslation from './locales/dashboard/en.json'
import DashboardarTranslation from './locales/dashboard/ar.json'
import ProgressenTranslation from './locales/progress/en.json'
import ProgressarTranslation from './locales/progress/ar.json'
import ScheduleenTranslation from './locales/schedule/en.json'
import SchedulearTranslation from './locales/schedule/ar.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "en", // corrected
    resources: {
      en: {
        landing: LandingenTranslation,
        common:CommonenTranslation,
        dashboard:DashboardenTranslation,
        progress:ProgressenTranslation,
        schedule:ScheduleenTranslation
      },
      ar: {
        landing: LandingarTranslation,
        common:CommonarTranslation,
        dashboard:DashboardarTranslation,
        progress:ProgressarTranslation,
        schedule:SchedulearTranslation
      }
    },
    ns: ["landing"], // optional but explicit
    defaultNS: "landing",
    react: {
      useSuspense: true
    }
  });

export default i18n;
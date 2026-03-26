import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import LandingenTranslation from "./locales/Landing/en.json";
import LandingarTranslation from "./locales/Landing/ar.json";
import CommonenTranslation from './locales/common/en.json'
import CommonarTranslation from './locales/common/ar.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "en", // corrected
    resources: {
      en: {
        landing: LandingenTranslation,
        common:CommonenTranslation
      },
      ar: {
        landing: LandingarTranslation,
        common:CommonarTranslation
      }
    },
    ns: ["landing"], // optional but explicit
    defaultNS: "landing",
    react: {
      useSuspense: true
    }
  });

export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import authen from "@/i18n/locales/en/auth.json";
import authes from "@/i18n/locales/es/auth.json";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    resources: {
      en: { auth: authen },
      es: { auth: authes },
    },
  });

export default i18n;

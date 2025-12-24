import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import landing_en from "./locales/en/landing.json";
import landing_es from "./locales/es/landing.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    ns: ["common"],
    defaultNS: "common",
    resources: {
      en: { landing: landing_en },
      es: { landing: landing_es },
    },
  });

export default i18n;

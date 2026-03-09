import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import authen from "@/i18n/locales/en/auth.json";
import authes from "@/i18n/locales/es/auth.json";
import dashboarden from "@/i18n/locales/en/dashboard.json";
import dashboardes from "@/i18n/locales/es/dashboard.json";
import commonen from "@/i18n/locales/en/common.json";
import commones from "@/i18n/locales/es/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: ["common", "auth", "dashboard"],
    defaultNS: "common",
    resources: {
      en: { common: commonen, auth: authen, dashboard: dashboarden },
      es: { common: commones, auth: authes, dashboard: dashboardes },
    },
  });

export default i18n;

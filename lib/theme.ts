import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
    resources: {
      pt: {
        translation: {
          home: "Início",
          patients: "Pacientes",
          dentists: "Dentistas",
          odontogram: "Odontograma",
          anamnesis: "Anamnese",
          settings: "Configurações",
          subscription: "Assinatura",
          language: "Idioma",
        },
      },
      en: {
        translation: {
          home: "Home",
          patients: "Patients",
          dentists: "Dentists",
          odontogram: "Odontogram",
          anamnesis: "Anamnesis",
          settings: "Settings",
          subscription: "Subscription",
          language: "Language",
        },
      },
    },
  });

export default i18n;

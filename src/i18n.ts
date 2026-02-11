import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        settings: "Settings",
        appearance: "Appearance",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        language: "Language",
        notifications: "Notifications",
        itemsPerPage: "Items per page",
        currency: "Currency",
        // ajoute tous les autres mots ici pour ton dashboard
      },
    },
    fr: {
      translation: {
        settings: "Paramètres",
        appearance: "Apparence",
        lightMode: "Mode clair",
        darkMode: "Mode sombre",
        language: "Langue",
        notifications: "Notifications",
        itemsPerPage: "Éléments par page",
        currency: "Devise",
        // ajoute tous les autres mots ici pour ton dashboard
      },
    },
  },
  lng: "en", // langue par défaut
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

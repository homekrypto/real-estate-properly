import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en/common.json';
import es from './locales/es/common.json';
import pl from './locales/pl/common.json';
import de from './locales/de/common.json';
import fr from './locales/fr/common.json';
import it from './locales/it/common.json';
import pt from './locales/pt/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    resources: {
      en: { translation: en },
      es: { translation: es },
      pl: { translation: pl },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      pt: { translation: pt },
    },

    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },

    defaultNS: 'translation',
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;
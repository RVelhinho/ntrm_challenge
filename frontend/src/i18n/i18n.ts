import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { pt } from './locales/pt';

export const languages = ['en', 'pt'] as const;
export type Language = (typeof languages)[number];

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, pt: { translation: pt } },
  lng: localStorage.getItem('nutrium-language') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export { i18n };

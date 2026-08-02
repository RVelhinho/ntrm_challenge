/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { i18n, type Language, languages } from '../../i18n/i18n';

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('nutrium-language');
    return languages.includes(stored as Language) ? (stored as Language) : 'en';
  });

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    void i18n.changeLanguage(nextLanguage);
    localStorage.setItem('nutrium-language', nextLanguage);
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { enUS, fr, arDZ } from 'date-fns/locale';
import { LANGUAGES, translations } from '../i18n/translations';

const DATE_LOCALES = { en: enUS, fr, ar: arDZ };

const STORAGE_KEY = 'imp.language';
const LanguageContext = createContext(null);

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return LANGUAGES.some((l) => l.code === stored) ? stored : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const dir = useMemo(() => LANGUAGES.find((l) => l.code === language)?.dir || 'ltr', [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = useCallback((code) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLanguageState(code);
  }, []);

  const t = useCallback(
    (key, vars) => {
      let str = translations[language]?.[key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          str = str.replaceAll(`{${name}}`, value);
        }
      }
      return str;
    },
    [language]
  );

  // Accepts either a full team object — in which case its own nameFr/nameAr
  // (set on the team itself, see TeamFormDialog) take priority, so a team
  // created in Arabic actually changes when you switch language — or a
  // plain string, for the handful of spots that only carry
  // application.teamPreference / a notification's stored team name and
  // don't have the full team record to hand: those fall back to the
  // static seeded-team lookup below, same pattern as StatusBadge.
  const tTeam = useCallback(
    (teamOrName) => {
      if (!teamOrName) return teamOrName;
      if (typeof teamOrName === 'string') {
        if (teamOrName === 'No preference') return t('apply.education.noPreference');
        const key = `common.teamNames.${teamOrName}`;
        const translated = translations[language]?.[key];
        return translated || teamOrName;
      }
      if (language === 'fr' && teamOrName.nameFr) return teamOrName.nameFr;
      if (language === 'ar' && teamOrName.nameAr) return teamOrName.nameAr;
      if (!teamOrName.name) return teamOrName.name;
      const key = `common.teamNames.${teamOrName.name}`;
      const translated = translations[language]?.[key];
      return translated || teamOrName.name;
    },
    [language, t]
  );

  const dateLocale = DATE_LOCALES[language] || enUS;

  const value = useMemo(
    () => ({ language, setLanguage, dir, t, tTeam, dateLocale, languages: LANGUAGES }),
    [language, setLanguage, dir, t, tTeam, dateLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale, t } from "./messages";

const COOKIE = "lanka_locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE}=`))
      ?.split("=")[1] as Locale | undefined;
    if (stored === "en" || stored === "si" || stored === "ta") {
      setLocaleState(stored);
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    document.cookie = `${COOKIE}=${l};path=/;max-age=31536000`;
    document.documentElement.lang = l === "si" ? "si" : l === "ta" ? "ta" : "en";
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: (key) => t(locale, key) }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

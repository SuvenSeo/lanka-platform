"use client";

import { LOCALES } from "@/lib/i18n/messages";
import { useI18n } from "@/lib/i18n/context";

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="locale-switcher" role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={locale === l.code ? "active" : ""}
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

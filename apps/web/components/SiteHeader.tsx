"use client";

import Link from "next/link";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";

const NAV_KEYS = [
  ["nav.datasets", "/datasets"],
  ["nav.search", "/search"],
  ["nav.news", "/news"],
  ["nav.legal", "/legal"],
  ["nav.cabinet", "/cabinet"],
  ["nav.map", "/map"],
  ["nav.elections", "/elections"],
  ["nav.government", "/government"],
  ["nav.environment", "/environment"],
  ["nav.alerts", "/alerts"],
  ["nav.developers", "/developers"],
] as const;

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="logo">
          Lanka Platform
        </Link>
        <nav className="nav-links" aria-label="Main">
          {NAV_KEYS.map(([key, href]) => (
            <Link key={href} href={href}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}

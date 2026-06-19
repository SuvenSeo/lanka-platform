import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/context";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lanka Platform — Sri Lanka Open Data",
  description: "Federated trilingual open data portal for Sri Lanka — nuuuwan ecosystem",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <SiteHeader />
          <main>{children}</main>
          <footer className="site-footer">
            <p>ශ්‍රී ලංකාවේ විවෘත දත්ත · இலங்கை திறந்த தரவு · Sri Lanka Open Data</p>
            <p className="mt-2">
              Built on{" "}
              <a href="https://github.com/nuuuwan" target="_blank" rel="noopener noreferrer">
                nuuuwan
              </a>
              {" · "}
              <a href="https://arxiv.org/abs/2510.04124" target="_blank" rel="noopener noreferrer">
                Research paper
              </a>
            </p>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}

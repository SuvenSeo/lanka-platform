import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lanka Platform — Sri Lanka Open Data",
  description: "Federated trilingual open data portal for Sri Lanka — nuuuwan ecosystem",
};

const NAV = [
  ["Datasets", "/datasets"],
  ["Search", "/search"],
  ["News", "/news"],
  ["Legal", "/legal"],
  ["Cabinet", "/cabinet"],
  ["Map", "/map"],
  ["Elections", "/elections"],
  ["Apps", "/apps"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="nav-inner">
            <Link href="/" className="logo">
              Lanka Platform
            </Link>
            <nav className="nav-links" aria-label="Main">
              {NAV.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
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
      </body>
    </html>
  );
}

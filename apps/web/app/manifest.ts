import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lanka Platform",
    short_name: "Lanka",
    description: "Sri Lanka open data portal — trilingual civic data federation",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#8b1538",
    lang: "en",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

/** Same-origin API — works on Vercel without external backend */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  const site = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return site;
}

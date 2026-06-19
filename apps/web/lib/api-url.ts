/** Same-origin API — works on Vercel without external backend */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (publicUrl) return publicUrl;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;
  return "http://localhost:3000";
}

/** Public base URL: explicit setting first, then Vercel's production domain, then the request origin. */
export function siteUrl(fallback = "http://localhost:3000") {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return fallback;
}

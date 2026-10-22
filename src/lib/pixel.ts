"use client";

type Fbq = (cmd: "track" | "trackCustom", event: string, params?: Record<string, unknown>) => void;

/** Sends a Meta Pixel event when the pixel is configured (NEXT_PUBLIC_META_PIXEL_ID); otherwise does nothing. */
export function track(event: string, params?: Record<string, unknown>, custom = false) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  try { fbq?.(custom ? "trackCustom" : "track", event, params); } catch { /* never break the UI for analytics */ }
}

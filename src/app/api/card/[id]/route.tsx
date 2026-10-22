import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profiles";
import { ACCORD_MAP } from "@/data/accords";

/** Shareable card. Default 1080x1920 (Instagram Story); ?f=og gives 1200x630 for link previews. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const og = url.searchParams.get("f") === "og";
  const locale = url.searchParams.get("l") === "en" ? "en" : "id";
  const p = await getProfile(id);
  if (!p) return new Response("Not found", { status: 404 });
  const prof = p.profile;
  const family = prof.family.secondary ? `${prof.family.primary[locale]} ${prof.family.secondary[locale]}` : prof.family.primary[locale];
  const labels = locale === "en" ? { top: "TOP", heart: "HEART", base: "BASE" } : { top: "ATAS", heart: "TENGAH", base: "DASAR" };
  const W = og ? 1200 : 1080, H = og ? 630 : 1920;
  const s = og ? 0.55 : 1;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#15110e", color: "#f3eadd", padding: 90 * s, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30 * s, letterSpacing: 2, color: "#bbae9e" }}>PERSONALITY SCENT · SCENT DNA</div>
          <div style={{ fontSize: 120 * s, lineHeight: 1.02, marginTop: 40 * s }}>{family}</div>
          <div style={{ fontSize: 44 * s, color: "#d9a35c", marginTop: 24 * s, fontStyle: "italic" }}>{prof.narrative.title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 * s }}>
          {(["top", "heart", "base"] as const).map((pos, i) => (
            <div key={pos} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${[60, 80, 100][i]}%`, border: `2px solid ${i === 0 ? "#d9a35c" : "#3d3229"}`, borderRadius: 18 * s, padding: `${28 * s}px ${20 * s}px`, background: i === 0 ? "rgba(217,163,92,0.1)" : "#1d1814" }}>
              <div style={{ fontSize: 24 * s, color: "#bbae9e", letterSpacing: 2 }}>{labels[pos]}</div>
              <div style={{ fontSize: 48 * s, marginTop: 8 * s, textAlign: "center" }}>{prof.pyramid[pos].map((n) => n.name[locale]).join(" · ")}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14 * s, flexWrap: "wrap" }}>
          {prof.topAccords.slice(0, 4).map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12 * s, fontSize: 30 * s, border: "2px solid #3d3229", borderRadius: 999, padding: `${10 * s}px ${22 * s}px` }}>
              <div style={{ width: 18 * s, height: 18 * s, borderRadius: 999, background: ACCORD_MAP[a.id].color }} />
              {ACCORD_MAP[a.id].name[locale]}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: W, height: H, headers: { "cache-control": "public, max-age=3600" } },
  );
}

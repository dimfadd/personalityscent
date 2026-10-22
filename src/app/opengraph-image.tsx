import { ImageResponse } from "next/og";

export const alt = "Personality Scent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#0a0a0a", color: "#ffffff", padding: 80, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 70, height: 12, background: "#cfa968", borderRadius: 4, marginLeft: 35 }} />
          <div style={{ width: 105, height: 12, background: "#cfa968", opacity: 0.7, borderRadius: 4, marginLeft: 17 }} />
          <div style={{ width: 140, height: 12, background: "#cfa968", opacity: 0.45, borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 34, color: "#cfa968", letterSpacing: 2 }}>PERSONALITY SCENT</div>
        <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 20 }}>Wangi di orang lain,</div>
        <div style={{ fontSize: 76, lineHeight: 1.05, color: "#e8cf93", fontStyle: "italic" }}>belum tentu wangi di kamu.</div>
        <div style={{ fontSize: 30, color: "#a9a6a1", marginTop: 30 }}>Tes aroma kepribadian · Gratis · ±4 menit</div>
      </div>
    ),
    size,
  );
}

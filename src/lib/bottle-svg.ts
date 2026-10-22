/** Static SVG bottle (same drawing as PerfumeBottle, classic shape) for server-rendered images. */
export function bottleSvgDataUri(colors: [string, string, string], label: string) {
  const [base, heart, top] = colors;
  const esc = (x: string) => x.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" width="400" height="640">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3b4"/><stop offset=".5" stop-color="#cfa968"/><stop offset="1" stop-color="#8a6a31"/></linearGradient>
<linearGradient id="l" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${base}"/><stop offset=".34" stop-color="${base}"/><stop offset=".5" stop-color="${heart}"/><stop offset=".66" stop-color="${heart}"/><stop offset=".84" stop-color="${top}"/><stop offset="1" stop-color="${top}"/></linearGradient>
<radialGradient id="w" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="${heart}" stop-opacity=".35"/><stop offset="1" stop-color="${heart}" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="100" cy="230" rx="96" ry="78" fill="url(#w)"/>
<path d="M52 118 H148 Q168 118 168 140 V282 Q168 302 148 302 H52 Q32 302 32 282 V140 Q32 118 52 118 Z" fill="#ffffff" fill-opacity=".05"/>
<path d="M56 160 H162 V280 Q162 296 144 296 H56 Q38 296 38 280 V160 Z" fill="url(#l)" opacity=".92"/>
<rect x="38" y="158" width="124" height="2.5" fill="#fff" opacity=".35"/>
<path d="M52 118 H148 Q168 118 168 140 V282 Q168 302 148 302 H52 Q32 302 32 282 V140 Q32 118 52 118 Z" fill="none" stroke="#ffffff" stroke-opacity=".4" stroke-width="2.5"/>
<path d="M47 146 Q43 210 47 276" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/>
<rect x="84" y="94" width="32" height="26" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".25"/>
<rect x="78" y="92" width="44" height="8" rx="2" fill="url(#g)"/>
<rect x="70" y="34" width="60" height="62" rx="6" fill="url(#g)"/>
<rect x="58" y="196" width="84" height="50" rx="3" fill="#0a0a0a" fill-opacity=".62" stroke="url(#g)"/>
<text x="100" y="211" text-anchor="middle" font-size="6.5" letter-spacing="1.4" fill="#cfa968" font-family="sans-serif">SCENT DNA</text>
<text x="100" y="234" text-anchor="middle" font-size="${label.length > 10 ? 12 : 16}" fill="#ffffff" font-family="serif">${esc(label)}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

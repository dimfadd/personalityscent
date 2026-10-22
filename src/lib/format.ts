/** Rp2,1jt / Rp350rb style used for estimated prices. */
export function idrShort(n: number) {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;
  return `Rp${Math.round(n / 1000)}rb`;
}

export function idr(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export function shopLinks(brand: string, name: string) {
  const q = encodeURIComponent(`${brand} ${name}`);
  return {
    shopee: `https://shopee.co.id/search?keyword=${q}`,
    tokopedia: `https://www.tokopedia.com/search?q=${q}`,
  };
}

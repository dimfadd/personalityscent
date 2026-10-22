import type { Metadata } from "next";
import { LegalPage, type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Syarat & Ketentuan" };

const price = Number(process.env.UNLOCK_PRICE_IDR ?? 29000).toLocaleString("id-ID");

const DOC: LegalDoc = {
  id: {
    title: "Syarat & Ketentuan",
    updated: "Berlaku sejak 2026",
    sections: [
      ["Layanan", [
        "Personality Scent adalah layanan web yang memetakan jawaban kuesioner kepribadian dan preferensi aroma menjadi profil aroma (Scent DNA), serta memberikan rekomendasi parfum berdasarkan kemiripan profil.",
        "Hasil adalah interpretasi berbasis psikologi untuk hiburan dan referensi belanja. Hasil bukan diagnosis psikologis, medis, atau saran profesional.",
      ]],
      ["Produk berbayar", [
        `Rekomendasi Lengkap adalah produk digital seharga Rp${price} yang dibayar sekali per hasil profiling. Setelah pembayaran terkonfirmasi, daftar rekomendasi langsung terbuka di halaman hasil dan dapat diakses kembali lewat link hasil yang sama.`,
        "Pembayaran diproses oleh Midtrans. Kami tidak menyimpan data kartu atau rekening pembayaranmu.",
      ]],
      ["Pengembalian dana", [
        "Karena produk dikirim secara digital dan langsung, pembayaran tidak dapat dikembalikan dengan alasan selera atau ketidakcocokan dengan parfum yang direkomendasikan.",
        "Pengembalian dana penuh diberikan bila pembayaranmu berhasil tetapi rekomendasi tidak terbuka karena gangguan sistem dan kami tidak dapat memperbaikinya dalam 3 x 24 jam. Ajukan dengan menyertakan ID order ke {contact}.",
      ]],
      ["Harga dan data parfum", [
        "Estimasi harga parfum adalah perkiraan harga retail di Indonesia dan bisa berbeda di tiap toko. Notes parfum dikurasi dari deskripsi yang dipublikasikan brand dan dapat mengandung ketidakakuratan. Selalu coba tester sebelum membeli.",
        "Link ke Shopee atau Tokopedia hanya berupa pencarian. Transaksi di toko tersebut sepenuhnya di luar tanggung jawab Personality Scent.",
      ]],
      ["Penggunaan yang wajar", [
        "Kamu tidak boleh menyalin, menjual ulang, atau mengambil data dari layanan ini secara otomatis tanpa izin tertulis.",
      ]],
      ["Hak kekayaan intelektual", [
        "Nama, desain, teks, dan kode Personality Scent dilindungi hak cipta. Nama dan merek parfum adalah milik pemiliknya masing-masing dan disebut hanya sebagai referensi.",
        "Kuesioner Mini-IPIP berasal dari International Personality Item Pool dan berada di domain publik.",
      ]],
      ["Perubahan", [
        "Syarat ini dapat diperbarui. Versi terbaru selalu tersedia di halaman ini.",
      ]],
    ],
  },
  en: {
    title: "Terms & Conditions",
    updated: "Effective from 2026",
    sections: [
      ["Service", [
        "Personality Scent is a web service that maps personality questionnaire answers and smell preferences onto a scent profile (Scent DNA), and recommends perfumes by profile similarity.",
        "Results are a psychology-informed interpretation for entertainment and shopping reference. They are not a psychological or medical diagnosis, nor professional advice.",
      ]],
      ["Paid product", [
        `Full Matches is a digital product priced at IDR ${price}, paid once per profiling result. Once payment is confirmed, the recommendations unlock on the result page and remain available at the same result link.`,
        "Payments are processed by Midtrans. We do not store your card or bank details.",
      ]],
      ["Refunds", [
        "Because the product is delivered digitally and instantly, payments are not refundable for reasons of taste or because a recommended perfume does not suit you.",
        "A full refund is given if your payment succeeded but the recommendations did not unlock because of a system fault we cannot fix within 3 x 24 hours. Request it with your order ID at {contact}.",
      ]],
      ["Prices and perfume data", [
        "Perfume prices are estimated Indonesian retail prices and vary by store. Notes are curated from brand descriptions and may contain inaccuracies. Always try a tester before buying.",
        "Shopee and Tokopedia links are searches only. Purchases on those stores are entirely outside Personality Scent's responsibility.",
      ]],
      ["Fair use", [
        "You may not copy, resell, or automatically extract data from this service without written permission.",
      ]],
      ["Intellectual property", [
        "The Personality Scent name, design, text, and code are protected by copyright. Perfume names and brands belong to their owners and are mentioned for reference only.",
        "The Mini-IPIP questionnaire comes from the International Personality Item Pool and is in the public domain.",
      ]],
      ["Changes", [
        "These terms may be updated. The latest version is always on this page.",
      ]],
    ],
  },
};

export default function Page() {
  return <LegalPage doc={DOC} />;
}

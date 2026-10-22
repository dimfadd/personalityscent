import type { Metadata } from "next";
import { LegalPage, type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Kebijakan Privasi" };

const DOC: LegalDoc = {
  id: {
    title: "Kebijakan Privasi",
    updated: "Berlaku sejak 2026",
    sections: [
      ["Data yang kami kumpulkan", [
        "Jawaban profiling (kuesioner kepribadian, pilihan aroma, skenario, konteks, dan cerita kenangan aroma bila kamu mengisinya), hasil profil yang dihitung, status pembayaran, dan rating parfum yang kamu berikan.",
        "Kami tidak meminta nama, email, atau nomor telepon untuk menggunakan layanan ini.",
      ]],
      ["Untuk apa data dipakai", [
        "Menghitung dan menampilkan hasilmu, membuka rekomendasi setelah pembayaran, dan memperbaiki akurasi pencocokan secara agregat.",
        "Bila fitur AI aktif, cerita kenangan aromamu dan ringkasan hasil dikirim ke penyedia AI yang dipilih (misalnya Anthropic, OpenAI, xAI, atau Google) hanya untuk diproses saat itu.",
      ]],
      ["Pihak ketiga", [
        "Midtrans memproses pembayaran. Vercel menghosting situs. Penyedia database menyimpan data. Bila diaktifkan, Meta Pixel mencatat kunjungan dan langkah di halaman (misalnya memulai profiling atau pembayaran) untuk mengukur iklan. Isi jawabanmu tidak dikirim ke Meta.",
      ]],
      ["Link hasil", [
        "Hasilmu tersimpan di link unik yang sulit ditebak. Siapa pun yang memegang link tersebut dapat melihat hasilnya, jadi bagikan dengan sadar.",
      ]],
      ["Hakmu", [
        "Sesuai UU Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, kamu dapat meminta akses atau penghapusan data hasilmu dengan mengirimkan link hasil ke {contact}.",
      ]],
      ["Penyimpanan di browser", [
        "Kami menyimpan draft profiling dan pilihan bahasa di penyimpanan lokal browsermu agar kamu bisa melanjutkan. Data ini tidak dikirim ke server sampai kamu menekan tombol lihat hasil.",
      ]],
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Effective from 2026",
    sections: [
      ["Data we collect", [
        "Profiling answers (personality questionnaire, smell choices, scenes, context, and your scent memory if you write one), the computed profile, payment status, and perfume ratings you give.",
        "We do not ask for your name, email, or phone number to use the service.",
      ]],
      ["How we use it", [
        "To compute and show your result, unlock recommendations after payment, and improve matching accuracy in aggregate.",
        "When AI is enabled, your scent memory and a result summary are sent to the selected AI provider (for example Anthropic, OpenAI, xAI, or Google) for processing at that moment only.",
      ]],
      ["Third parties", [
        "Midtrans processes payments. Vercel hosts the site. A database provider stores data. When enabled, Meta Pixel records visits and on-page steps (such as starting profiling or checkout) to measure ads. Your answers are not sent to Meta.",
      ]],
      ["Result links", [
        "Your result lives at a unique, hard-to-guess link. Anyone holding that link can view the result, so share it consciously.",
      ]],
      ["Your rights", [
        "Under Indonesia's Personal Data Protection Law (Law No. 27 of 2022), you can request access to or deletion of your result by sending its link to {contact}.",
      ]],
      ["Browser storage", [
        "We keep your profiling draft and language choice in your browser's local storage so you can resume. It is not sent to our server until you press the button to see your result.",
      ]],
    ],
  },
};

export default function Page() {
  return <LegalPage doc={DOC} />;
}

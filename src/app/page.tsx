import { Landing } from "@/components/landing/Landing";

export default function Home() {
  const price = Number(process.env.UNLOCK_PRICE_IDR ?? 29000);
  return <Landing price={price} />;
}

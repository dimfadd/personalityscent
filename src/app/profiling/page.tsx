import type { Metadata } from "next";
import { Profiling } from "@/components/profiling/Profiling";

export const metadata: Metadata = { title: "Profiling" };

export default function Page() {
  return <Profiling />;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Training Tracker",
  description: "Log sessions for your Sthir program.",
  path: "/tracker",
  noIndex: true,
});

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

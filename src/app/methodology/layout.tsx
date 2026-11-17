import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How GEI Thinks — ASK YALLTOO",
  description:
    "Explore the four-stage methodology of Genesis Engineered Interpretation: textual investigation, linguistic investigation, engineering investigation, and interpretive synthesis.",
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

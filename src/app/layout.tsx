import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASK YALLTOO — GEI Knowledge & Discovery Engine",
  description:
    "Ask the questions. Explore the connections. Your gateway to Genesis Engineered Interpretation — an independent research framework examining Genesis through hydraulic engineering.",
  keywords: [
    "Genesis Engineered Interpretation",
    "GEI",
    "YALLTOO",
    "Genesis",
    "hydraulic engineering",
    "biblical interpretation",
    "Wilbert Bouie Jr",
  ],
  openGraph: {
    title: "ASK YALLTOO — GEI Knowledge & Discovery Engine",
    description:
      "Ask the questions. Explore the connections. Your gateway to Genesis Engineered Interpretation.",
    type: "website",
    siteName: "ASK YALLTOO",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
        <ThemeProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

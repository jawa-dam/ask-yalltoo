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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "ASK YALLTOO",
                url: "https://ask.yalltoo.com",
                description:
                  "The GEI Knowledge & Discovery Engine — search and explore Genesis Engineered Interpretation research.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://ask.yalltoo.com/?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "YALLTOO",
                url: "https://www.yalltoo.com",
                description:
                  "Educational platform for Genesis Engineered Interpretation (GEI), founded by Wilbert Bouie Jr.",
                founder: {
                  "@type": "Person",
                  name: "Wilbert Bouie Jr.",
                  jobTitle: "Independent Researcher",
                },
              },
            ]),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          style={{ background: "var(--accent)" }}
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Navigation />
          <main id="main-content" className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

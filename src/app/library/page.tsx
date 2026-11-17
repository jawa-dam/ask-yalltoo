import type { Metadata } from "next";
import { getAllDocuments, getAllCategories } from "@/lib/knowledge";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Knowledge Library — ASK YALLTOO",
  description:
    "Browse the GEI research collection. Explore documents on Genesis creation days, the Adam/A-DAM hypothesis, the firmament, and more — organized by category and evidence classification.",
};

const categoryLabels: Record<string, string> = {
  genesis: "Genesis Days",
  "adam-the-dam": "Adam / A-DAM",
  firmament: "The Firmament",
  hydrology: "Hydrology",
  "hebrew-linguistics": "Hebrew Linguistics",
  engineering: "Engineering",
  "creation-symbolism": "Creation Symbolism",
  methodology: "Methodology",
  sources: "Sources & References",
  questions: "Research Questions",
};

const evidenceBadgeColors: Record<string, string> = {
  textual: "#059669",
  linguistic: "#0284c7",
  hypothesis: "#7c3aed",
  "engineering-analogy": "#d97706",
  "research-question": "#94a3b8",
  unclassified: "#64748b",
};

export default function LibraryPage() {
  const docs = getAllDocuments();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
        Knowledge Library
      </h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        Browse the GEI research collection. {docs.length} documents across {categories.length} categories.
      </p>

      {categories.map((cat) => {
        const catDocs = docs.filter((d) => d.category === cat);
        if (catDocs.length === 0) return null;
        return (
          <section key={cat} className="mb-8">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              {categoryLabels[cat] || cat}
            </h2>
            <div className="grid gap-2">
              {catDocs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/library/${doc.slug}`}
                  className="rounded-xl p-4 flex items-start justify-between gap-4 transition-all hover:scale-[1.005]"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{doc.title}</p>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-tertiary)" }}>{doc.excerpt}</p>
                  </div>
                  <span
                    className="shrink-0 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ background: evidenceBadgeColors[doc.evidenceLevel] || "#64748b" }}
                  >
                    {doc.evidenceLevel}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

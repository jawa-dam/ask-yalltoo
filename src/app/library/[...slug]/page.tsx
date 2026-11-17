import type { Metadata } from "next";
import { getAllDocuments, getDocumentBySlug, getRelatedDocuments } from "@/lib/knowledge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug.join("/"));
  if (!doc) return { title: "Document Not Found — ASK YALLTOO" };
  return {
    title: `${doc.title} — ASK YALLTOO`,
    description: doc.excerpt.slice(0, 160),
  };
}

export async function generateStaticParams() {
  const docs = getAllDocuments();
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export default async function DocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const doc = getDocumentBySlug(slugPath);

  if (!doc) notFound();

  const processed = await remark().use(html).process(doc.content);
  const contentHtml = processed.toString();
  const related = getRelatedDocuments(doc);

  const evidenceBadgeColors: Record<string, string> = {
    textual: "#059669",
    linguistic: "#0284c7",
    hypothesis: "#7c3aed",
    "engineering-analogy": "#d97706",
    "research-question": "#94a3b8",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Link href="/library" className="text-sm mb-4 inline-block hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
        &larr; Back to Library
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
            {doc.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span className="rounded-full px-2.5 py-0.5 font-medium text-white"
              style={{ background: evidenceBadgeColors[doc.evidenceLevel] || "#64748b" }}>
              {doc.evidenceLevel}
            </span>
            <span>Category: {doc.category}</span>
            {doc.genesisDay && <span>Day {doc.genesisDay}</span>}
            <span>Updated: {doc.lastUpdated}</span>
          </div>
          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {doc.tags.map((tag) => (
                <span key={tag} className="rounded-full px-2 py-0.5 text-xs" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-sm max-w-none"
          style={{ color: "var(--text-primary)" }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {related.length > 0 && (
        <section className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
            Related Documents
          </h2>
          <div className="grid gap-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/library/${r.slug}`}
                className="rounded-lg p-3 text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

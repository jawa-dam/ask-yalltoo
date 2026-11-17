import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface KnowledgeDocument {
  slug: string;
  filepath: string;
  title: string;
  category: string;
  tags: string[];
  evidenceLevel: string;
  genesisDay?: number;
  related: string[];
  lastUpdated: string;
  status: string;
  content: string;
  excerpt: string;
}

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");
const METHODOLOGY_DIR = path.join(process.cwd(), "methodology");
const SOURCES_DIR = path.join(process.cwd(), "sources");

function getAllMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      files.push(fullPath);
    }
  }
  return files;
}

function parseDocument(filepath: string, baseDir: string): KnowledgeDocument {
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const relative = path.relative(baseDir, filepath);
  const slug = relative.replace(/\.md$/, "").replace(/\\/g, "/");

  const plainText = content
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/\|[^|]*\|/g, "")
    .replace(/[*_`~\[\]()>]/g, "")
    .replace(/---+/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

  const excerpt = plainText.slice(0, 300).trim();

  return {
    slug,
    filepath: relative,
    title: data.title || slug,
    category: data.category || "uncategorized",
    tags: data.tags || [],
    evidenceLevel: data.evidence_level || "unclassified",
    genesisDay: data.genesis_day,
    related: data.related || [],
    lastUpdated: data.last_updated || "unknown",
    status: data.status || "draft",
    content,
    excerpt,
  };
}

let cachedDocs: KnowledgeDocument[] | null = null;

export function getAllDocuments(): KnowledgeDocument[] {
  if (cachedDocs && process.env.NODE_ENV === "production") return cachedDocs;

  const knowledgeFiles = getAllMdFiles(KNOWLEDGE_DIR);
  const methodologyFiles = getAllMdFiles(METHODOLOGY_DIR);
  const sourceFiles = getAllMdFiles(SOURCES_DIR);

  const docs = [
    ...knowledgeFiles.map((f) => parseDocument(f, KNOWLEDGE_DIR)),
    ...methodologyFiles.map((f) => parseDocument(f, METHODOLOGY_DIR)),
    ...sourceFiles.map((f) => parseDocument(f, SOURCES_DIR)),
  ].filter((doc) => doc.status !== "draft" || process.env.NODE_ENV !== "production");

  cachedDocs = docs;
  return docs;
}

export function getDocumentBySlug(slug: string): KnowledgeDocument | undefined {
  return getAllDocuments().find((doc) => doc.slug === slug);
}

const STOP_WORDS = new Set([
  "the", "is", "a", "an", "of", "in", "to", "and", "or", "for", "on", "it",
  "as", "at", "by", "be", "was", "are", "were", "been", "do", "does", "did",
  "has", "have", "had", "this", "that", "what", "how", "why", "when", "where",
  "which", "who", "with", "from", "not", "but", "can", "will", "about",
]);

function stemWord(word: string): string {
  if (word.length <= 3) return word;
  return word
    .replace(/tion$/, "t")
    .replace(/ment$/, "")
    .replace(/ing$/, "")
    .replace(/ed$/, "")
    .replace(/ies$/, "y")
    .replace(/s$/, "");
}

export function searchDocuments(query: string): KnowledgeDocument[] {
  const docs = getAllDocuments();
  const rawTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (rawTerms.length === 0) return [];

  const queryLower = query.toLowerCase();
  const meaningfulTerms = rawTerms.filter((t) => !STOP_WORDS.has(t));
  const terms = meaningfulTerms.length > 0 ? meaningfulTerms : rawTerms;
  const stemmedTerms = terms.map(stemWord);

  const scored = docs.map((doc) => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsLower = doc.tags.map((t) => t.toLowerCase());

    if (titleLower.includes(queryLower)) score += 25;

    const firstParagraph = contentLower.slice(0, 500);
    if (firstParagraph.includes(queryLower)) score += 8;

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const stem = stemmedTerms[i];

      if (titleLower.includes(term)) score += 10;
      else if (titleLower.includes(stem)) score += 6;

      if (tagsLower.some((t) => t.includes(term) || t.includes(stem))) score += 5;
      if (doc.category.toLowerCase().includes(term)) score += 3;

      const contentMatches = contentLower.split(term).length - 1;
      score += Math.min(contentMatches, 10);

      if (contentMatches === 0) {
        const stemMatches = contentLower.split(stem).length - 1;
        score += Math.min(stemMatches, 5);
      }
    }

    if (terms.some((t) => titleLower === t)) score += 20;

    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.doc);
}

export function getRelatedDocuments(doc: KnowledgeDocument, limit = 5): KnowledgeDocument[] {
  const all = getAllDocuments();
  const related: { doc: KnowledgeDocument; score: number }[] = [];

  for (const other of all) {
    if (other.slug === doc.slug) continue;
    let score = 0;

    if (doc.related.some((r) => other.slug === r || other.slug.endsWith("/" + r))) score += 10;
    if (other.related.some((r) => doc.slug === r || doc.slug.endsWith("/" + r))) score += 8;
    if (other.category === doc.category) score += 3;

    const sharedTags = doc.tags.filter((t) => other.tags.includes(t));
    score += sharedTags.length * 2;

    if (doc.genesisDay && other.genesisDay) {
      if (Math.abs(doc.genesisDay - other.genesisDay) === 1) score += 4;
      if (doc.genesisDay === other.genesisDay) score += 6;
    }

    if (score > 0) related.push({ doc: other, score });
  }

  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.doc);
}

export function getDocumentsByCategory(category: string): KnowledgeDocument[] {
  return getAllDocuments().filter((doc) => doc.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set(getAllDocuments().map((doc) => doc.category));
  return Array.from(categories).sort();
}

export function extractRelevantPassages(
  docs: KnowledgeDocument[],
  query: string,
  maxChars = 4000
): string {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const passages: string[] = [];
  let totalChars = 0;

  for (const doc of docs) {
    if (totalChars >= maxChars) break;

    const lines = doc.content.split("\n");
    const relevantLines: string[] = [];
    let inRelevantSection = false;

    for (const line of lines) {
      const lineLower = line.toLowerCase();
      const isHeading = line.startsWith("#");
      const hasMatch = terms.some((t) => lineLower.includes(t));

      if (isHeading) {
        inRelevantSection = hasMatch;
        if (hasMatch) relevantLines.push(line);
      } else if (inRelevantSection || hasMatch) {
        relevantLines.push(line);
      }
    }

    const passage = relevantLines.join("\n").trim();
    if (passage) {
      const header = `## From: ${doc.title} [${doc.evidenceLevel}]\n`;
      const chunk = header + passage.slice(0, maxChars - totalChars - header.length);
      passages.push(chunk);
      totalChars += chunk.length;
    }
  }

  return passages.join("\n\n---\n\n");
}

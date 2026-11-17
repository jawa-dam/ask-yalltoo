import { NextRequest, NextResponse } from "next/server";
import { performSearch } from "@/lib/search-engine";
import { isAIAvailable, generateAIAnswer, type AnswerSection } from "@/lib/ai-answer";

const REQUEST_LOG: number[] = [];
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function isRateLimited(): boolean {
  const now = Date.now();
  while (REQUEST_LOG.length > 0 && now - REQUEST_LOG[0] > RATE_LIMIT_WINDOW_MS) {
    REQUEST_LOG.shift();
  }
  if (REQUEST_LOG.length >= RATE_LIMIT_MAX) return true;
  REQUEST_LOG.push(now);
  return false;
}

function sanitizeQuery(raw: string): string {
  return raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
}

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited()) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 2048) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const { query: rawQuery } = body as { query?: unknown };

    if (!rawQuery || typeof rawQuery !== "string" || rawQuery.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (rawQuery.length > 500) {
      return NextResponse.json({ error: "Query too long" }, { status: 400 });
    }

    const query = sanitizeQuery(rawQuery);
    if (query.length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const searchResult = performSearch(query);

    if (searchResult.documents.length === 0) {
      return NextResponse.json({
        answer: {
          directAnswer:
            "The GEI research library does not yet contain enough documented research to answer this question. This may be because the topic has not been investigated within the current scope of Genesis Engineered Interpretation (Genesis 1–6, KJV), or because the relevant research documents have not yet been added to the library.",
          geiInterpretation: null,
          methodology: [],
          scripturalReferences: [],
          researchReferences: [],
          evidenceClassification: [],
          limitations: [
            "No matching documents found in the GEI knowledge library for this query.",
          ],
        },
        documents: [],
        relatedQuestions: searchResult.relatedQuestions,
        methodology: [],
      });
    }

    let answer: AnswerSection;

    if (isAIAvailable()) {
      try {
        answer = await generateAIAnswer(
          query,
          searchResult.context,
          searchResult.methodology,
          searchResult.documents
        );
      } catch {
        answer = generateFallbackAnswer(query, searchResult);
      }
    } else {
      answer = generateFallbackAnswer(query, searchResult);
    }

    return NextResponse.json({
      answer,
      documents: searchResult.documents.map((doc) => ({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        tags: doc.tags,
        evidenceLevel: doc.evidenceLevel,
        excerpt: doc.excerpt,
        genesisDay: doc.genesisDay,
      })),
      relatedQuestions: searchResult.relatedQuestions,
      methodology: searchResult.methodology,
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 });
  }
}

function extractSection(content: string, headings: string[]): string | null {
  for (const heading of headings) {
    const pattern = new RegExp(
      `## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`,
      "i"
    );
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

function extractEvidenceTable(
  content: string
): { claim: string; level: string }[] {
  const items: { claim: string; level: string }[] = [];
  const tableRows = content.match(/\| (.+?) \| (.+?) \|/g);
  if (!tableRows) return items;
  for (const row of tableRows) {
    const cells = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (
      cells.length >= 2 &&
      !cells[0].includes("---") &&
      !cells[0].toLowerCase().includes("claim") &&
      !cells[0].toLowerCase().includes("biblical concept") &&
      !cells[0].toLowerCase().includes("adam (genesis")
    ) {
      items.push({ claim: cells[0], level: cells[1] });
    }
  }
  return items;
}

function generateFallbackAnswer(
  query: string,
  searchResult: ReturnType<typeof performSearch>
): AnswerSection {
  const { documents } = searchResult;
  const topDoc = documents[0];

  const scripturalRefs: string[] = [];
  const evidenceItems: { claim: string; level: string }[] = [];
  const limitations: string[] = [];

  for (const doc of documents.slice(0, 5)) {
    const verseMatches = doc.content.match(/Genesis \d+:\d+(?:[–-]\d+)?/g);
    if (verseMatches) {
      for (const ref of verseMatches) {
        if (!scripturalRefs.includes(ref)) scripturalRefs.push(ref);
      }
    }

    evidenceItems.push(...extractEvidenceTable(doc.content));

    const limSection = extractSection(doc.content, [
      "Limitations",
      "Limitations & Integrity",
      "Important Distinctions",
    ]);
    if (limSection) {
      const items = limSection
        .split("\n")
        .filter((l) => l.startsWith("- "))
        .map((l) => l.replace(/^- /, "").trim());
      limitations.push(...items);
    }
  }

  let directAnswer = "";
  let geiInterpretation: string | null = null;

  const geiSectionHeadings = [
    "GEI Interpretation",
    "GEI Proposition",
    "GEI Observation",
    "GEI's Linguistic Observation",
  ];
  const overviewHeadings = [
    "Overview",
    "Scope",
    "The Core Question",
    "What Is GEI\\?",
    "Purpose",
    "Definition",
  ];

  const answerParts: string[] = [];

  for (const doc of documents.slice(0, 3)) {
    const overviewText = extractSection(doc.content, overviewHeadings);
    const geiText = extractSection(doc.content, geiSectionHeadings);

    if (overviewText) {
      const cleaned = cleanMarkdown(overviewText);
      const noQuestion = cleaned
        .split("\n")
        .filter((line) => !line.endsWith("?") || line.length > 80)
        .join(" ");
      answerParts.push(noQuestion.slice(0, 350));
    } else if (geiText) {
      answerParts.push(cleanMarkdown(geiText).slice(0, 350));
    }
  }

  if (answerParts.length > 0) {
    directAnswer = answerParts.join(" ").slice(0, 700);
  } else {
    directAnswer = topDoc.excerpt.slice(0, 400);
  }

  if (!directAnswer.trim()) {
    directAnswer =
      "The GEI research library contains documents related to this topic. Browse the research references below for details.";
  }

  for (const doc of documents.slice(0, 3)) {
    const geiText = extractSection(doc.content, geiSectionHeadings);
    if (geiText) {
      geiInterpretation = cleanMarkdown(geiText).slice(0, 800);
      break;
    }
  }

  const uniqueEvidence = new Map<string, string>();
  for (const item of evidenceItems) {
    if (!uniqueEvidence.has(item.claim)) {
      uniqueEvidence.set(item.claim, item.level);
    }
  }

  return {
    directAnswer,
    geiInterpretation,
    methodology: searchResult.methodology,
    scripturalReferences: scripturalRefs.slice(0, 10),
    researchReferences: documents.slice(0, 5).map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      evidenceLevel: doc.evidenceLevel,
    })),
    evidenceClassification: Array.from(uniqueEvidence.entries())
      .map(([claim, level]) => ({ claim, level }))
      .slice(0, 10),
    limitations: [...new Set(limitations)].slice(0, 6),
  };
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^- /gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

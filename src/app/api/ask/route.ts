import { NextRequest, NextResponse } from "next/server";
import { performSearch } from "@/lib/search-engine";
import { isAIAvailable, generateAIAnswer, type AnswerSection } from "@/lib/ai-answer";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (query.length > 500) {
      return NextResponse.json({ error: "Query too long" }, { status: 400 });
    }

    const searchResult = performSearch(query.trim());

    if (searchResult.documents.length === 0) {
      return NextResponse.json({
        answer: {
          directAnswer:
            "The GEI research library does not yet contain enough documented research to answer this question. This may be because the topic hasn't been investigated within the current scope of Genesis Engineered Interpretation, or because the relevant research documents haven't been added to the library yet.",
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
          query.trim(),
          searchResult.context,
          searchResult.methodology,
          searchResult.documents
        );
      } catch {
        answer = generateFallbackAnswer(query.trim(), searchResult);
      }
    } else {
      answer = generateFallbackAnswer(query.trim(), searchResult);
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

function generateFallbackAnswer(
  query: string,
  searchResult: ReturnType<typeof performSearch>
): AnswerSection {
  const { documents, context } = searchResult;
  const topDoc = documents[0];

  const scripturalRefs: string[] = [];
  const evidenceItems: { claim: string; level: string }[] = [];
  const limitations: string[] = [];

  for (const doc of documents) {
    const verseMatches = doc.content.match(/Genesis \d+:\d+(?:–\d+)?/g);
    if (verseMatches) {
      for (const ref of verseMatches) {
        if (!scripturalRefs.includes(ref)) scripturalRefs.push(ref);
      }
    }

    const tableRows = doc.content.match(/\| (.+?) \| (.+?) \|/g);
    if (tableRows) {
      for (const row of tableRows) {
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (
          cells.length === 2 &&
          !cells[0].includes("---") &&
          !cells[0].includes("Claim")
        ) {
          evidenceItems.push({ claim: cells[0], level: cells[1] });
        }
      }
    }

    const limSection = doc.content.match(
      /## Limitations\n([\s\S]*?)(?=\n## |$)/
    );
    if (limSection) {
      const items = limSection[1]
        .split("\n")
        .filter((l) => l.startsWith("- "))
        .map((l) => l.replace(/^- /, ""));
      limitations.push(...items);
    }
  }

  let directAnswer = "";
  let geiInterpretation: string | null = null;

  const answerParts: string[] = [];

  for (const doc of documents.slice(0, 3)) {
    const geiSection = doc.content.match(
      /## GEI Interpretation\n([\s\S]*?)(?=\n## |$)/
    );
    const overviewSection = doc.content.match(
      /## (?:Overview|The Core Question|What Is GEI\?)\n([\s\S]*?)(?=\n## |$)/
    );

    if (overviewSection) {
      answerParts.push(cleanMarkdown(overviewSection[1]).slice(0, 300));
    } else if (geiSection) {
      answerParts.push(cleanMarkdown(geiSection[1]).slice(0, 300));
    }
  }

  if (answerParts.length > 0) {
    directAnswer = answerParts.join(" ").slice(0, 600);
  } else {
    directAnswer = topDoc.excerpt.slice(0, 400);
  }

  const topGeiSection = topDoc.content.match(
    /## GEI Interpretation\n([\s\S]*?)(?=\n## |$)/
  );
  if (topGeiSection) {
    geiInterpretation = cleanMarkdown(topGeiSection[1]).slice(0, 800);
  }

  void context;

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
    evidenceClassification: evidenceItems.slice(0, 8),
    limitations: [...new Set(limitations)].slice(0, 5),
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

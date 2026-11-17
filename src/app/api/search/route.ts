import { NextRequest, NextResponse } from "next/server";
import { performSearch } from "@/lib/search-engine";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (query.length > 500) {
      return NextResponse.json({ error: "Query too long" }, { status: 400 });
    }

    const result = performSearch(query.trim());

    return NextResponse.json({
      documents: result.documents.map((doc) => ({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        tags: doc.tags,
        evidenceLevel: doc.evidenceLevel,
        excerpt: doc.excerpt,
        genesisDay: doc.genesisDay,
      })),
      context: result.context,
      relatedQuestions: result.relatedQuestions,
      methodology: result.methodology,
      totalResults: result.documents.length,
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

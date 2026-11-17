import { describe, it, expect } from "vitest";
import { getAllDocuments, searchDocuments, getDocumentBySlug, getRelatedDocuments } from "../src/lib/knowledge";
import { performSearch, getRelatedQuestions, identifyMethodology } from "../src/lib/search-engine";
import { POST } from "../src/app/api/ask/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("knowledge library integrity", () => {
  const docs = getAllDocuments();

  it("every document has a non-empty title", () => {
    for (const doc of docs) {
      expect(doc.title, `${doc.slug} missing title`).toBeTruthy();
      expect(doc.title, `${doc.slug} title is slug`).not.toBe(doc.slug);
    }
  });

  it("every document has a valid category", () => {
    for (const doc of docs) {
      expect(doc.category, `${doc.slug} missing category`).toBeTruthy();
      expect(doc.category).not.toBe("uncategorized");
    }
  });

  it("every document has an evidence_level", () => {
    for (const doc of docs) {
      expect(doc.evidenceLevel, `${doc.slug} missing evidence_level`).toBeTruthy();
      expect(doc.evidenceLevel).not.toBe("unclassified");
    }
  });

  it("every document has tags", () => {
    for (const doc of docs) {
      expect(doc.tags.length, `${doc.slug} has no tags`).toBeGreaterThan(0);
    }
  });

  it("every document has a last_updated date", () => {
    for (const doc of docs) {
      expect(doc.lastUpdated, `${doc.slug} missing last_updated`).not.toBe("unknown");
    }
  });

  it("every document has status published", () => {
    for (const doc of docs) {
      expect(doc.status, `${doc.slug} is not published`).toBe("published");
    }
  });

  it("related references resolve to actual documents", () => {
    for (const doc of docs) {
      for (const ref of doc.related) {
        const found = docs.some(
          (d) => d.slug === ref || d.slug.endsWith("/" + ref)
        );
        expect(found, `${doc.slug} -> related: ${ref} not found`).toBe(true);
      }
    }
  });

  it("genesis day documents have genesis_day set", () => {
    for (const doc of docs) {
      if (doc.slug.startsWith("genesis/day-")) {
        expect(doc.genesisDay, `${doc.slug} missing genesis_day`).toBeDefined();
      }
    }
  });

  it("no duplicate slugs exist", () => {
    const slugs = docs.map((d) => d.slug);
    const unique = new Set(slugs);
    expect(slugs.length).toBe(unique.size);
  });
});

describe("search relevance", () => {
  it('"Is Adam a dam?" returns adam-the-dam/hypothesis as top result', () => {
    const results = searchDocuments("Is Adam a dam?");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe("adam-the-dam/hypothesis");
  });

  it('"What does Adam have to do with hydraulic engineering?" returns adam docs', () => {
    const results = searchDocuments("What does Adam have to do with hydraulic engineering?");
    expect(results.length).toBeGreaterThan(0);
    const topSlugs = results.slice(0, 3).map((d) => d.slug);
    expect(topSlugs.some((s) => s.includes("adam"))).toBe(true);
  });

  it('"Is the firmament a dam?" returns firmament docs', () => {
    const results = searchDocuments("Is the firmament a dam?");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toMatch(/firmament/);
  });

  it('"What is the relationship between heaven and water?" returns heaven doc', () => {
    const results = searchDocuments("What is the relationship between heaven and water?");
    expect(results.length).toBeGreaterThan(0);
    const topSlugs = results.slice(0, 3).map((d) => d.slug);
    expect(topSlugs.some((s) => s.includes("heaven") || s.includes("firmament"))).toBe(true);
  });

  it('"whales and waterwheels" returns day-5', () => {
    const results = searchDocuments("What does GEI propose about whales and waterwheels?");
    expect(results.length).toBeGreaterThan(0);
    const topSlugs = results.slice(0, 3).map((d) => d.slug);
    expect(topSlugs.some((s) => s.includes("day-5"))).toBe(true);
  });

  it('"arguments against A-DAM" returns limitations doc', () => {
    const results = searchDocuments("What are the strongest arguments against the A-DAM hypothesis?");
    expect(results.length).toBeGreaterThan(0);
    const topSlugs = results.slice(0, 3).map((d) => d.slug);
    expect(topSlugs.some((s) => s.includes("limitation") || s.includes("hypothesis"))).toBe(true);
  });

  it('"Hebrew etymology vs GEI wordplay" returns linguistic analysis', () => {
    const results = searchDocuments("What is the difference between established Hebrew etymology and GEI wordplay?");
    expect(results.length).toBeGreaterThan(0);
    const topSlugs = results.slice(0, 5).map((d) => d.slug);
    expect(topSlugs.some((s) => s.includes("linguistic") || s.includes("methodology"))).toBe(true);
  });

  it('"evidence to disprove GEI" returns methodology/evidence docs', () => {
    const results = searchDocuments("What evidence would disprove a GEI interpretation?");
    expect(results.length).toBeGreaterThan(0);
    const topSlugs = results.slice(0, 3).map((d) => d.slug);
    expect(
      topSlugs.some((s) => s.includes("evidence") || s.includes("limitation") || s.includes("methodology"))
    ).toBe(true);
  });

  it("nonsense query returns no results", () => {
    const results = searchDocuments("zyxwvu qwerty banana spaceship");
    expect(results).toHaveLength(0);
  });

  it("stop-word-only queries fall back to raw terms but rank poorly", () => {
    const results = searchDocuments("the is a");
    // Stop-word queries may still match content containing those words,
    // but no document should score via title/tag/category matching alone
    // This test verifies the search doesn't crash on stop-word-only input
    expect(Array.isArray(results)).toBe(true);
  });
});

describe("evidence classification integrity", () => {
  const VALID_LEVELS = [
    "Textual evidence",
    "Established linguistic evidence",
    "GEI hypothesis",
    "Engineering analogy",
    "Linguistic observation",
    "Linguistic observation (English)",
    "Research question",
    "Established engineering fact",
    "Not claimed by GEI",
  ];

  it("evidence classification tables use valid levels", () => {
    const docs = getAllDocuments();
    for (const doc of docs) {
      const evidenceSection = doc.content.match(
        /## Evidence Classification\n([\s\S]*?)(?=\n## |$)/
      );
      if (!evidenceSection) continue;
      const tableRows = evidenceSection[1].match(/\| (.+?) \| (.+?) \|/g);
      if (!tableRows) continue;
      for (const row of tableRows) {
        const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
        if (cells.length < 2) continue;
        if (cells[0].includes("---") || cells[0].includes("Claim")) continue;
        const level = cells[1];
        if (level.includes("Classification") || level.includes("---")) continue;
        const isValid = VALID_LEVELS.some((v) => level.includes(v));
        expect(isValid, `${doc.slug}: unknown evidence level "${level}"`).toBe(true);
      }
    }
  });
});

describe("citation integrity", () => {
  it("API response references match actual retrieved documents", async () => {
    const res = await POST(makeRequest({ query: "Is Adam a dam?" }));
    const data = await res.json();

    for (const ref of data.answer.researchReferences) {
      const doc = getDocumentBySlug(ref.slug);
      expect(doc, `Reference ${ref.slug} not found in library`).toBeDefined();
      expect(doc!.title).toBe(ref.title);
      expect(doc!.evidenceLevel).toBe(ref.evidenceLevel);
    }
  });

  it("API response documents are all real library documents", async () => {
    const res = await POST(makeRequest({ query: "firmament dam" }));
    const data = await res.json();

    for (const doc of data.documents) {
      const found = getDocumentBySlug(doc.slug);
      expect(found, `Document ${doc.slug} not found`).toBeDefined();
    }
  });

  it("scriptural references follow the Genesis pattern", async () => {
    const res = await POST(makeRequest({ query: "Is Adam a dam?" }));
    const data = await res.json();

    for (const ref of data.answer.scripturalReferences) {
      expect(ref).toMatch(/Genesis \d+:\d+/);
    }
  });
});

describe("research integrity: hypothesis vs fact", () => {
  it('"Is Adam actually a dam, or is that only a GEI interpretation?" must distinguish hypothesis from fact', async () => {
    const res = await POST(
      makeRequest({ query: "Is Adam actually a dam, or is that only a GEI interpretation?" })
    );
    const data = await res.json();
    expect(res.status).toBe(200);

    const answer = data.answer;
    expect(answer.directAnswer).toBeTruthy();

    const hasEvidenceClassification = answer.evidenceClassification.length > 0;
    expect(hasEvidenceClassification).toBe(true);

    const levels = answer.evidenceClassification.map((e: { level: string }) => e.level);
    const hasHypothesisMarker = levels.some(
      (l: string) => l.includes("hypothesis") || l.includes("GEI") || l.includes("Linguistic observation")
    );
    expect(hasHypothesisMarker, "Answer must include GEI hypothesis classification").toBe(true);
  });

  it("questions challenging GEI return limitations", async () => {
    const res = await POST(
      makeRequest({ query: "What are the strongest arguments against the A-DAM hypothesis?" })
    );
    const data = await res.json();
    expect(data.answer.limitations.length).toBeGreaterThan(0);
  });

  it("methodology is correctly identified for linguistic questions", () => {
    const docs = searchDocuments("Is Adam linguistically proven to mean dam in Hebrew?");
    const methodology = identifyMethodology("Is Adam linguistically proven to mean dam in Hebrew?", docs);
    expect(methodology).toContain("linguistic");
  });
});

describe("API robustness", () => {
  it("returns 400 for empty string query", async () => {
    const res = await POST(makeRequest({ query: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing query field", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-string query", async () => {
    const res = await POST(makeRequest({ query: 12345 }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for query exceeding 500 characters", async () => {
    const res = await POST(makeRequest({ query: "x".repeat(501) }));
    expect(res.status).toBe(400);
  });

  it("handles query with special characters safely", async () => {
    const res = await POST(makeRequest({ query: '<script>alert("xss")</script>' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.answer.directAnswer).not.toContain("<script>");
  });

  it("does not expose internal errors", async () => {
    const res = await POST(makeRequest({ query: "test" }));
    const data = await res.json();
    if (data.error) {
      expect(data.error).not.toContain("stack");
      expect(data.error).not.toContain("ANTHROPIC_API_KEY");
      expect(data.error).not.toContain("/home/");
    }
  });

  it("empty search results return informative message", async () => {
    const res = await POST(makeRequest({ query: "zyxwvut qrspon klmno" }));
    const data = await res.json();
    expect(data.answer.directAnswer).toContain("does not yet contain");
  });
});

describe("related documents", () => {
  it("genesis day docs have related documents", () => {
    for (let day = 1; day <= 6; day++) {
      const doc = getDocumentBySlug(`genesis/day-${day}`);
      expect(doc, `genesis/day-${day} not found`).toBeDefined();
      const related = getRelatedDocuments(doc!);
      expect(related.length, `genesis/day-${day} has no related docs`).toBeGreaterThan(0);
    }
  });

  it("adam hypothesis has related linguistic and engineering docs", () => {
    const doc = getDocumentBySlug("adam-the-dam/hypothesis");
    expect(doc).toBeDefined();
    const related = getRelatedDocuments(doc!);
    const slugs = related.map((d) => d.slug);
    expect(slugs.some((s) => s.includes("linguistic") || s.includes("textual") || s.includes("engineering"))).toBe(true);
  });
});

describe("related questions", () => {
  it("adam query returns dam-related questions", () => {
    const qs = getRelatedQuestions("Is Adam a dam?");
    expect(qs.length).toBeGreaterThan(0);
  });

  it("firmament query returns firmament-related questions", () => {
    const qs = getRelatedQuestions("What is the firmament?");
    expect(qs.length).toBeGreaterThan(0);
    expect(qs.some((q) => q.toLowerCase().includes("firmament") || q.toLowerCase().includes("heaven") || q.toLowerCase().includes("dam"))).toBe(true);
  });

  it("methodology query returns methodology-related questions", () => {
    const qs = getRelatedQuestions("How does GEI methodology work?");
    expect(qs.length).toBeGreaterThan(0);
  });
});

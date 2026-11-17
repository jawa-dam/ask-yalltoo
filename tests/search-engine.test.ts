import { describe, it, expect } from "vitest";
import {
  performSearch,
  getRelatedQuestions,
  identifyMethodology,
} from "../src/lib/search-engine";
import { searchDocuments } from "../src/lib/knowledge";

describe("search engine", () => {
  it("performSearch returns all expected fields", () => {
    const result = performSearch("adam");
    expect(result.documents.length).toBeGreaterThan(0);
    expect(typeof result.context).toBe("string");
    expect(Array.isArray(result.relatedQuestions)).toBe(true);
    expect(Array.isArray(result.methodology)).toBe(true);
  });

  it('getRelatedQuestions for "adam" includes dam-related questions', () => {
    const qs = getRelatedQuestions("adam");
    expect(qs.length).toBeGreaterThan(0);
    expect(qs.some((q) => q.toLowerCase().includes("dam"))).toBe(true);
  });

  it('identifyMethodology includes "engineering" for a dam query', () => {
    const docs = searchDocuments("adam dam");
    const methodology = identifyMethodology("adam dam hypothesis", docs);
    expect(methodology).toContain("engineering");
  });

  it("distinguishes GEI wordplay from established etymology", () => {
    const result = performSearch("Is Adam linguistically proven to mean dam?");
    expect(result.documents.length).toBeGreaterThan(0);
    const hasLinguistic = result.methodology.includes("linguistic");
    expect(hasLinguistic).toBe(true);
  });
});

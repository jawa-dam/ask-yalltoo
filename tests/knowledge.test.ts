import { describe, it, expect } from "vitest";
import {
  getAllDocuments,
  getDocumentBySlug,
  searchDocuments,
  getRelatedDocuments,
} from "../src/lib/knowledge";

describe("knowledge indexing", () => {
  it("returns documents", () => {
    const docs = getAllDocuments();
    expect(docs.length).toBeGreaterThan(0);
  });

  it("every document has required fields", () => {
    for (const doc of getAllDocuments()) {
      expect(doc.title).toBeTruthy();
      expect(doc.category).toBeTruthy();
      expect(Array.isArray(doc.tags)).toBe(true);
      expect(doc.evidenceLevel).toBeTruthy();
      expect(doc.content).toBeTruthy();
    }
  });

  it('searchDocuments("adam") returns relevant results', () => {
    const results = searchDocuments("adam");
    expect(results.length).toBeGreaterThan(0);
    const slugs = results.map((r) => r.slug);
    expect(slugs.some((s) => s.includes("adam"))).toBe(true);
  });

  it('searchDocuments("firmament") returns day-2 and firmament docs', () => {
    const results = searchDocuments("firmament");
    expect(results.length).toBeGreaterThan(0);
    const slugs = results.map((r) => r.slug);
    expect(
      slugs.some((s) => s.includes("firmament") || s.includes("day-2"))
    ).toBe(true);
  });

  it("searchDocuments with nonexistent term returns empty", () => {
    const results = searchDocuments("nonexistent-gibberish-xyz");
    expect(results).toHaveLength(0);
  });

  it('getDocumentBySlug finds "genesis/day-2"', () => {
    const doc = getDocumentBySlug("genesis/day-2");
    expect(doc).toBeDefined();
    expect(doc!.title).toBeTruthy();
  });

  it("getRelatedDocuments returns results for a genesis day", () => {
    const doc = getDocumentBySlug("genesis/day-1");
    expect(doc).toBeDefined();
    const related = getRelatedDocuments(doc!);
    expect(related.length).toBeGreaterThan(0);
  });
});

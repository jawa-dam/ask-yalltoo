import { describe, it, expect } from "vitest";
import { POST } from "../src/app/api/ask/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/ask", () => {
  it('responds to "Is Adam a dam?" with structured answer', async () => {
    const res = await POST(makeRequest({ query: "Is Adam a dam?" }));
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.answer).toBeDefined();
    expect(data.answer.directAnswer).toBeTruthy();
    expect(Array.isArray(data.documents)).toBe(true);
    expect(Array.isArray(data.relatedQuestions)).toBe(true);
    expect(Array.isArray(data.methodology)).toBe(true);
  });

  it("returns 400 for empty query", async () => {
    const res = await POST(makeRequest({ query: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing query", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for too-long query", async () => {
    const res = await POST(makeRequest({ query: "x".repeat(501) }));
    expect(res.status).toBe(400);
  });
});

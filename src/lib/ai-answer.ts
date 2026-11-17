import Anthropic from "@anthropic-ai/sdk";
import type { KnowledgeDocument } from "./knowledge";

export interface AnswerSection {
  directAnswer: string;
  geiInterpretation: string | null;
  methodology: string[];
  scripturalReferences: string[];
  researchReferences: { title: string; slug: string; evidenceLevel: string }[];
  evidenceClassification: { claim: string; level: string }[];
  limitations: string[];
}

const SYSTEM_PROMPT = `You are the ASK YALLTOO research assistant for the Genesis Engineered Interpretation (GEI) framework, founded by Wilbert Bouie Jr.

Your role is to answer questions ONLY using the provided GEI research documents. You are a retrieval assistant, not an author.

STRICT RULES:
1. Answer ONLY from the provided research context. If the context does not contain enough information, say so explicitly.
2. NEVER invent citations, Hebrew definitions, archaeological discoveries, or historical confirmations.
3. NEVER fabricate sources, publications, or DOIs.
4. NEVER invent detailed technical explanations where the available research has not established them.
5. NEVER automatically treat every proposed GEI word association as an established Hebrew etymology.
6. Clearly distinguish between:
   - Textual evidence (directly stated in the Bible)
   - Established linguistic evidence (supported by standard Hebrew scholarship)
   - GEI hypotheses (proposed interpretations within GEI)
   - Engineering analogies (comparisons, not proofs)
   - Research questions (areas not yet fully investigated)
7. Always acknowledge limitations when present in the source documents.
8. Use KJV references when citing scripture.
9. Present GEI interpretations as proposed hypotheses, never as established facts.
10. If asked about something outside the GEI research library, state that plainly.

FORMAT YOUR RESPONSE AS JSON with these fields:
{
  "directAnswer": "A clear, grounded 2-4 sentence answer synthesizing the research documents",
  "geiInterpretation": "The specific GEI interpretation if applicable, or null",
  "scripturalReferences": ["Genesis X:Y", ...],
  "evidenceClassification": [{"claim": "...", "level": "Textual evidence|Established linguistic evidence|GEI hypothesis|Engineering analogy|Research question"}],
  "limitations": ["limitation 1", ...]
}

Respond ONLY with valid JSON. No markdown fences, no preamble.`;

export function isAIAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

export async function generateAIAnswer(
  query: string,
  context: string,
  methodology: string[],
  documents: KnowledgeDocument[]
): Promise<AnswerSection> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `RESEARCH QUESTION: ${query}

METHODOLOGY STAGES IDENTIFIED: ${methodology.join(", ")}

RESEARCH DOCUMENTS RETRIEVED:
${context}

Based ONLY on the above research documents, answer the question. Follow the JSON format specified in your instructions.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  let response: Anthropic.Message;
  try {
    response = await client.messages.create(
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      },
      { signal: controller.signal }
    );
  } finally {
    clearTimeout(timeout);
  }

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let parsed: Record<string, unknown>;

  try {
    let jsonText = text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    parsed = JSON.parse(jsonText);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Not a JSON object");
    }
  } catch {
    const cleanedText = text
      .replace(/```[\s\S]*?```/g, "")
      .trim()
      .slice(0, 600);
    return {
      directAnswer: cleanedText || "The AI could not generate a structured answer. See the research documents below.",
      geiInterpretation: null,
      methodology,
      scripturalReferences: [],
      researchReferences: documents.slice(0, 5).map((doc) => ({
        title: doc.title,
        slug: doc.slug,
        evidenceLevel: doc.evidenceLevel,
      })),
      evidenceClassification: [],
      limitations: [
        "AI response could not be fully structured. The research documents below contain the relevant information.",
      ],
    };
  }

  const directAnswer = typeof parsed.directAnswer === "string" && parsed.directAnswer.trim()
    ? parsed.directAnswer.trim()
    : "No answer could be generated from the available research.";

  const geiInterpretation = typeof parsed.geiInterpretation === "string"
    ? parsed.geiInterpretation.trim() || null
    : null;

  const scripturalReferences = Array.isArray(parsed.scripturalReferences)
    ? (parsed.scripturalReferences as unknown[])
        .filter((r): r is string => typeof r === "string" && r.includes("Genesis"))
        .slice(0, 10)
    : [];

  const evidenceClassification = Array.isArray(parsed.evidenceClassification)
    ? (parsed.evidenceClassification as unknown[])
        .filter(
          (e): e is { claim: string; level: string } =>
            typeof e === "object" &&
            e !== null &&
            typeof (e as Record<string, unknown>).claim === "string" &&
            typeof (e as Record<string, unknown>).level === "string"
        )
        .slice(0, 10)
    : [];

  const limitationsRaw = Array.isArray(parsed.limitations)
    ? (parsed.limitations as unknown[])
        .filter((l): l is string => typeof l === "string")
        .slice(0, 6)
    : [];

  return {
    directAnswer,
    geiInterpretation,
    methodology,
    scripturalReferences,
    researchReferences: documents.slice(0, 5).map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      evidenceLevel: doc.evidenceLevel,
    })),
    evidenceClassification,
    limitations: limitationsRaw,
  };
}

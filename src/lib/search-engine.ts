import {
  searchDocuments,
  extractRelevantPassages,
  getRelatedDocuments,
  getAllDocuments,
  type KnowledgeDocument,
} from "./knowledge";

export interface SearchResult {
  documents: KnowledgeDocument[];
  context: string;
  relatedQuestions: string[];
  methodology: string[];
}

const QUESTION_PATTERNS: Record<string, string[]> = {
  adam: [
    "What is the Adam / A-DAM hypothesis?",
    "How does GEI interpret Adam's creation?",
    "What are the limitations of the A-DAM hypothesis?",
    "What does Adam being formed from dust represent in GEI?",
  ],
  firmament: [
    "Is the firmament a dam according to GEI?",
    "What does GEI propose about heaven?",
    "How does Day 2 relate to dam construction?",
    "What is the relationship between the firmament and water?",
  ],
  dam: [
    "Is Adam a dam?",
    "What is the firmament according to GEI?",
    "How does GEI connect Genesis to hydraulic engineering?",
    "What evidence supports the dam interpretation?",
  ],
  whale: [
    "What does GEI propose about the whales?",
    "Is the whale-wheel connection based on Hebrew?",
    "How does Day 5 relate to waterwheels?",
    "What are the limitations of the whale-wheel comparison?",
  ],
  day: [
    "What are the six creation days according to GEI?",
    "How does GEI interpret each day differently from tradition?",
    "What engineering system does each day represent?",
  ],
  methodology: [
    "How does GEI analyze a biblical passage?",
    "What are the four stages of GEI methodology?",
    "How does GEI classify evidence?",
    "What are the limitations of the GEI framework?",
  ],
  water: [
    "What is the hydraulic interpretation of Genesis?",
    "How does GEI connect water and creation?",
    "What is a miqveh in GEI?",
    "What does water represent in the GEI framework?",
  ],
  engineering: [
    "What is the connection between Genesis and ancient engineering?",
    "What engineering systems does GEI compare to Genesis?",
    "How does GEI use engineering analogies?",
  ],
  levite: [
    "What is the GEI interpretation of the Levites?",
    "How does GEI connect Levites to levees?",
    "What is the evidence for the Levite-levee connection?",
  ],
  moses: [
    "How does GEI interpret Moses?",
    "What is the Moses ram-pump comparison?",
  ],
  light: [
    "What does light represent in GEI?",
    "How does GEI interpret Day 1?",
    "What is the connection between light and water in GEI?",
  ],
  heaven: [
    "What does heaven represent in GEI?",
    "Why does shamayim contain the word for water?",
    "How does GEI connect heaven to a reservoir?",
  ],
};

export function getRelatedQuestions(query: string, limit = 4): string[] {
  const terms = query.toLowerCase().split(/\s+/);
  const questions = new Set<string>();

  for (const term of terms) {
    for (const [key, qs] of Object.entries(QUESTION_PATTERNS)) {
      if (term.includes(key) || key.includes(term)) {
        for (const q of qs) {
          if (q.toLowerCase() !== query.toLowerCase()) {
            questions.add(q);
          }
        }
      }
    }
  }

  if (questions.size < limit) {
    const defaults = [
      "What is Genesis Engineered Interpretation?",
      "Is Adam a dam?",
      "What is the firmament according to GEI?",
      "How does GEI interpret the six creation days?",
      "What are the limitations of the GEI framework?",
    ];
    for (const q of defaults) {
      if (q.toLowerCase() !== query.toLowerCase()) {
        questions.add(q);
      }
      if (questions.size >= limit + 2) break;
    }
  }

  return Array.from(questions).slice(0, limit);
}

export function identifyMethodology(
  query: string,
  docs: KnowledgeDocument[]
): string[] {
  const methodology: string[] = [];
  const evidenceLevels = new Set(docs.map((d) => d.evidenceLevel));

  methodology.push("textual");

  const queryLower = query.toLowerCase();
  if (
    queryLower.includes("word") ||
    queryLower.includes("hebrew") ||
    queryLower.includes("linguist") ||
    queryLower.includes("meaning") ||
    queryLower.includes("etymolog") ||
    docs.some((d) => d.tags.includes("linguistics") || d.tags.includes("hebrew") || d.tags.includes("wordplay"))
  ) {
    methodology.push("linguistic");
  }

  if (
    queryLower.includes("engineer") ||
    queryLower.includes("dam") ||
    queryLower.includes("hydraul") ||
    queryLower.includes("water") ||
    queryLower.includes("mill") ||
    evidenceLevels.has("engineering-analogy") ||
    docs.some((d) => d.tags.includes("engineering") || d.tags.includes("dam"))
  ) {
    methodology.push("engineering");
  }

  if (
    evidenceLevels.has("hypothesis") ||
    docs.some((d) => d.evidenceLevel === "hypothesis")
  ) {
    methodology.push("synthesis");
  }

  return methodology;
}

export function performSearch(query: string): SearchResult {
  const documents = searchDocuments(query).slice(0, 8);
  const context = extractRelevantPassages(documents, query);
  const relatedQuestions = getRelatedQuestions(query);
  const methodology = identifyMethodology(query, documents);

  return { documents, context, relatedQuestions, methodology };
}

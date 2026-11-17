"use client";

import { useState } from "react";
import Link from "next/link";
import { FeedbackForm } from "./feedback-form";

interface AnswerData {
  directAnswer: string;
  geiInterpretation: string | null;
  methodology: string[];
  scripturalReferences: string[];
  researchReferences: { title: string; slug: string; evidenceLevel: string }[];
  evidenceClassification: { claim: string; level: string }[];
  limitations: string[];
}

interface AnswerDisplayProps {
  answer: AnswerData;
  documents: { slug: string; title: string; category: string; evidenceLevel: string }[];
  relatedQuestions: string[];
  methodology: string[];
  onAskRelated: (q: string) => void;
}

const methodologyLabels: Record<string, { title: string; description: string }> = {
  textual: { title: "Textual Investigation", description: "Close reading of the biblical text as written" },
  linguistic: { title: "Linguistic Investigation", description: "Examination of words, roots, and language patterns" },
  engineering: { title: "Engineering Investigation", description: "Comparison with physical or engineering systems" },
  synthesis: { title: "Interpretive Synthesis", description: "Assessment of converging textual, linguistic, and engineering observations" },
};

const evidenceBadgeColors: Record<string, string> = {
  "Textual evidence": "#059669",
  "Established linguistic evidence": "#0284c7",
  "GEI hypothesis": "#7c3aed",
  "Engineering analogy": "#d97706",
  "Linguistic observation": "#6366f1",
  "Linguistic observation (English)": "#6366f1",
  "Research question": "#94a3b8",
};

export function AnswerDisplay({ answer, documents, relatedQuestions, methodology, onAskRelated }: AnswerDisplayProps) {
  const [showMethodology, setShowMethodology] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Direct Answer */}
      <section className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
          Direct Answer
        </h3>
        <p className="leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {answer.directAnswer}
        </p>
      </section>

      {/* GEI Interpretation */}
      {answer.geiInterpretation && (
        <section className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 gradient-text">
            GEI Interpretation
          </h3>
          <p className="leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {answer.geiInterpretation}
          </p>
        </section>
      )}

      {/* Methodology (expandable) */}
      {methodology.length > 0 && (
        <section className="rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between p-5 text-left"
            aria-expanded={showMethodology}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              GEI Methodology Applied
            </h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"
              style={{ transform: showMethodology ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showMethodology && (
            <div className="px-5 pb-5 space-y-3">
              {methodology.map((m) => {
                const info = methodologyLabels[m];
                if (!info) return null;
                return (
                  <div key={m} className="flex items-start gap-3 rounded-lg p-3" style={{ background: "var(--bg-tertiary)" }}>
                    <div className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--accent)" }}>
                      {m === "textual" ? "T" : m === "linguistic" ? "L" : m === "engineering" ? "E" : "S"}
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{info.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Scriptural References */}
      {answer.scripturalReferences.length > 0 && (
        <section className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Scriptural References (KJV)
          </h3>
          <div className="flex flex-wrap gap-2">
            {answer.scripturalReferences.map((ref) => (
              <span key={ref} className="inline-block rounded-full px-3 py-1 text-sm" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                {ref}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Evidence Classification (expandable) */}
      {answer.evidenceClassification.length > 0 && (
        <section className="rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between p-5 text-left"
            aria-expanded={showEvidence}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Evidence Classification
            </h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"
              style={{ transform: showEvidence ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showEvidence && (
            <div className="px-5 pb-5 space-y-2">
              {answer.evidenceClassification.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>{item.claim}</span>
                  <span className="inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ background: evidenceBadgeColors[item.level] || "#64748b" }}>
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Research References */}
      {answer.researchReferences.length > 0 && (
        <section className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Research Documents Consulted
          </h3>
          <div className="space-y-2">
            {answer.researchReferences.map((ref) => (
              <Link key={ref.slug} href={`/library/${ref.slug}`} className="flex items-center justify-between gap-2 rounded-lg p-2.5 transition-colors hover:opacity-80" style={{ background: "var(--bg-tertiary)" }}>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{ref.title}</span>
                <span className="text-xs rounded-full px-2 py-0.5" style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-color)" }}>
                  {ref.evidenceLevel}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Limitations */}
      {answer.limitations.length > 0 && (
        <section className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Limitations
          </h3>
          <ul className="space-y-1.5">
            {answer.limitations.map((lim, i) => (
              <li key={i} className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--text-tertiary)" }}/>
                {lim}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <section className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Related Questions
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {relatedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => onAskRelated(q)}
                className="text-left rounded-lg p-3 text-sm transition-colors hover:opacity-80"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Research Feedback */}
      <section className="rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Research Feedback
          </h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"
            style={{ transform: showFeedback ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {showFeedback && (
          <div className="px-5 pb-5">
            <FeedbackForm context={answer.directAnswer.slice(0, 100)} />
          </div>
        )}
      </section>

      {/* Attribution */}
      <div className="text-center text-xs pt-2" style={{ color: "var(--text-tertiary)" }}>
        Answers generated from the GEI research library. Genesis Engineered Interpretation by Wilbert Bouie Jr.
      </div>
    </div>
  );
}

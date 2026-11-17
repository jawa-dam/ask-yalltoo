"use client";

import { useState } from "react";
import Link from "next/link";

const stages = [
  {
    id: "textual",
    number: 1,
    title: "Textual Investigation",
    question: "What does the passage actually say?",
    color: "#059669",
    description: "Close reading of the biblical text (KJV). Identify key terms, actions, relationships, and the narrative sequence. Note what is explicitly stated versus what is inferred.",
    details: [
      "Read the passage in context",
      "Identify key terms and their relationships",
      "Map the sequence of events described",
      "Distinguish explicit statements from inferences",
      "Compare with parallel passages within Genesis 1–6",
    ],
    standard: "Observations at this stage should be verifiable by any reader, regardless of interpretive framework.",
  },
  {
    id: "linguistic",
    number: 2,
    title: "Linguistic Investigation",
    question: "What words, roots, and language patterns may be relevant?",
    color: "#0284c7",
    description: "Examine Hebrew words and their ranges of meaning. Identify wordplay, homophones, homonyms, and paronomasia. Cross-reference with established lexicons.",
    details: [
      "Examine Hebrew words and semantic fields",
      "Identify wordplay and phonetic associations",
      "Distinguish established etymology from proposed connections",
      "Consider figurative language patterns",
      "Cross-reference with standard Hebrew scholarship",
    ],
    standard: "Must distinguish between established etymology (supported by scholarship), observed wordplay (phonetic associations), and proposed connections (interpretive within GEI).",
  },
  {
    id: "engineering",
    number: 3,
    title: "Engineering Investigation",
    question: "Can the proposed interpretation be compared with an identifiable physical or engineering system?",
    color: "#d97706",
    description: "Identify a specific engineering system for comparison. Assess point-by-point correspondence between the text and the system. Verify engineering facts independently.",
    details: [
      "Identify a specific engineering system or process",
      "Create point-by-point comparison with the text",
      "Count points of correspondence",
      "Verify that cited engineering facts are accurate",
      "Assess whether the parallel is specific or generic",
    ],
    standard: "Engineering facts must be independently verifiable. The comparison must be between a specific system and the actual text.",
  },
  {
    id: "synthesis",
    number: 4,
    title: "Interpretive Synthesis",
    question: "Do the textual, linguistic, and engineering observations converge?",
    color: "#7c3aed",
    description: "Assess whether the three prior stages point in the same direction. Identify strengths and weaknesses. Acknowledge alternative interpretations. Classify the evidence level.",
    details: [
      "Assess convergence of all three prior stages",
      "Identify strongest and weakest links",
      "Acknowledge alternative interpretations explicitly",
      "Classify the resulting interpretation's evidence level",
      "Identify remaining research questions",
    ],
    standard: "Strong: all three stages converge. Moderate: two of three. Preliminary: one stage only. Speculative: proposed without substantial support.",
  },
];

export default function MethodologyPage() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
        How GEI Thinks
      </h1>
      <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
        Genesis Engineered Interpretation uses a four-stage methodology to examine biblical passages.
      </p>
      <p className="text-sm mb-10" style={{ color: "var(--text-tertiary)" }}>
        Each stage builds on the previous. An interpretation is considered supported only when multiple stages converge.
      </p>

      {/* Stage Cards */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const isOpen = activeStage === stage.id;
          return (
            <div key={stage.id} className="rounded-xl overflow-hidden" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
              <button
                onClick={() => setActiveStage(isOpen ? null : stage.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                  style={{ background: stage.color }}>
                  {stage.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>{stage.title}</h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{stage.question}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 animate-fade-in">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{stage.description}</p>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>Steps</h3>
                    <ul className="space-y-1.5">
                      {stage.details.map((d, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-primary)" }}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: stage.color }}/>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg p-3" style={{ background: "var(--bg-tertiary)" }}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>Standard</h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{stage.standard}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Evidence Classification */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Evidence Classification</h2>
        <div className="space-y-2">
          {[
            { level: "Textual Evidence", color: "#059669", desc: "Directly stated in or clearly supported by the biblical text" },
            { level: "Established Linguistic Evidence", color: "#0284c7", desc: "Supported by standard Hebrew scholarship and lexicography" },
            { level: "GEI Hypothesis", color: "#7c3aed", desc: "A proposed interpretation developed within the GEI framework" },
            { level: "Engineering Analogy", color: "#d97706", desc: "A comparison between a biblical description and an engineering system" },
            { level: "Unverified Research Question", color: "#94a3b8", desc: "An area where GEI has identified a potential connection but not developed a full analysis" },
          ].map((e) => (
            <div key={e.level} className="flex items-center gap-3 rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white shrink-0" style={{ background: e.color }}>
                {e.level}
              </span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Limitations &amp; Integrity</h2>
        <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <ul className="space-y-2">
            {[
              "GEI interpretations are proposed hypotheses, not established facts",
              "The methodology is designed to be transparent and examinable",
              "Every interpretation identifies its evidence classification",
              "GEI does not claim to invalidate other interpretive frameworks",
              "English-language wordplay is distinguished from Hebrew etymology",
              "Engineering parallels demonstrate possibility, not authorial intent",
            ].map((l, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--text-tertiary)" }}/>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link href="/library" className="text-sm hover:opacity-80" style={{ color: "var(--accent)" }}>
          Browse the Knowledge Library &rarr;
        </Link>
      </div>
    </div>
  );
}

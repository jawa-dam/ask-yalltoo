"use client";

import { useState } from "react";
import Link from "next/link";

interface ConceptNode {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  connectionType: "textual" | "gei-interpretation" | "linguistic" | "engineering";
}

interface DayNode {
  id: string;
  day: number;
  title: string;
  href: string;
  color: string;
  concepts: ConceptNode[];
}

const connectionLabels: Record<string, string> = {
  textual: "Textual relationship",
  "gei-interpretation": "GEI interpretation",
  linguistic: "Linguistic proposal",
  engineering: "Engineering analogy",
};

const connectionColors: Record<string, string> = {
  textual: "#059669",
  "gei-interpretation": "#7c3aed",
  linguistic: "#0284c7",
  engineering: "#d97706",
};

const days: DayNode[] = [
  {
    id: "day1",
    day: 1,
    title: "Separation",
    href: "/library/genesis/day-1",
    color: "#059669",
    concepts: [
      { id: "light", label: "Light", sublabel: "Flowing water", href: "/library/genesis/day-1", connectionType: "gei-interpretation" },
      { id: "darkness", label: "Darkness", sublabel: "Contained water", href: "/library/genesis/day-1", connectionType: "gei-interpretation" },
    ],
  },
  {
    id: "day2",
    day: 2,
    title: "Firmament",
    href: "/library/genesis/day-2",
    color: "#0284c7",
    concepts: [
      { id: "heaven", label: "Heaven", sublabel: "Upper water", href: "/library/firmament/heaven", connectionType: "textual" },
      { id: "dam-hyp", label: "Dam Hypothesis", sublabel: "Water barrier", href: "/library/firmament/firmament", connectionType: "engineering" },
    ],
  },
  {
    id: "day3",
    day: 3,
    title: "Waters Gathered",
    href: "/library/genesis/day-3",
    color: "#2fd2ff",
    concepts: [
      { id: "earth", label: "Dry Land", sublabel: "Earth", href: "/library/genesis/day-3", connectionType: "textual" },
      { id: "millpond", label: "Millpond", sublabel: "Gathered waters", href: "/library/creation-symbolism/miqveh", connectionType: "engineering" },
    ],
  },
  {
    id: "day4",
    day: 4,
    title: "Lights",
    href: "/library/genesis/day-4",
    color: "#d97706",
    concepts: [
      { id: "sun", label: "Sun", sublabel: "Sluice gate", href: "/library/genesis/day-4", connectionType: "engineering" },
      { id: "moon", label: "Moon", sublabel: "Headrace", href: "/library/genesis/day-4", connectionType: "engineering" },
      { id: "stars", label: "Stars", sublabel: "Controls", href: "/library/genesis/day-4", connectionType: "engineering" },
    ],
  },
  {
    id: "day5",
    day: 5,
    title: "Creatures",
    href: "/library/genesis/day-5",
    color: "#f310ba",
    concepts: [
      { id: "whales", label: "Whales", sublabel: "Waterwheels", href: "/library/genesis/day-5", connectionType: "linguistic" },
      { id: "fish", label: "Fish", sublabel: "Water mechanisms", href: "/library/genesis/day-5", connectionType: "engineering" },
    ],
  },
  {
    id: "day6",
    day: 6,
    title: "Completion",
    href: "/library/genesis/day-6",
    color: "#7c3aed",
    concepts: [
      { id: "adam", label: "Adam", sublabel: "A-DAM", href: "/library/adam-the-dam/hypothesis", connectionType: "linguistic" },
      { id: "dominion", label: "Dominion", sublabel: "System governance", href: "/library/genesis/day-6", connectionType: "gei-interpretation" },
    ],
  },
];

export default function KnowledgeMapPage() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeLegend, setActiveLegend] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
        Knowledge Map
      </h1>
      <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
        Interactive visualization of GEI concepts and their relationships across the six days of creation.
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
        Click any node to explore the research document. Connection colors indicate the type of relationship.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.entries(connectionLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveLegend(activeLegend === key ? null : key)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity"
            style={{
              background: "var(--bg-secondary)",
              border: `2px solid ${connectionColors[key]}`,
              color: "var(--text-primary)",
              opacity: activeLegend && activeLegend !== key ? 0.3 : 1,
            }}
          >
            <span className="w-3 h-0.5 rounded" style={{ background: connectionColors[key] }} />
            {label}
          </button>
        ))}
      </div>

      {/* Genesis Root */}
      <div className="text-center mb-8">
        <Link
          href="/library/genesis/overview"
          className="inline-block rounded-2xl px-8 py-4 font-bold text-lg transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #2fd2ff, #3d3dea, #f310ba)",
            color: "white",
            boxShadow: "0 4px 20px rgba(47, 210, 255, 0.3)",
          }}
          onMouseEnter={() => setActiveNode("genesis")}
          onMouseLeave={() => setActiveNode(null)}
        >
          GENESIS 1-6 (KJV)
        </Link>
        <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
          The creation narrative examined through hydraulic engineering
        </p>
      </div>

      {/* Connecting line from genesis to days */}
      <div className="flex justify-center mb-4">
        <div className="w-0.5 h-8" style={{ background: "var(--border-color)" }} />
      </div>

      {/* Day grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => {
          const dayActive = activeNode === day.id;
          return (
            <div
              key={day.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: "var(--bg-secondary)",
                border: dayActive ? `2px solid ${day.color}` : "1px solid var(--border-color)",
                boxShadow: dayActive ? `0 4px 20px ${day.color}33` : "none",
              }}
              onMouseEnter={() => setActiveNode(day.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {/* Day header */}
              <Link href={day.href} className="block p-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: day.color }}
                  >
                    {day.day}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      Day {day.day}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {day.title}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Concept nodes */}
              <div className="p-3 space-y-2">
                {day.concepts.map((concept) => {
                  const dimmed = activeLegend && concept.connectionType !== activeLegend;
                  return (
                    <Link
                      key={concept.id}
                      href={concept.href}
                      className="flex items-center gap-3 rounded-lg p-2.5 transition-all hover:scale-[1.01]"
                      style={{
                        background: "var(--bg-tertiary)",
                        borderLeft: `3px solid ${connectionColors[concept.connectionType]}`,
                        opacity: dimmed ? 0.3 : 1,
                      }}
                      onMouseEnter={() => setActiveNode(concept.id)}
                      onMouseLeave={() => setActiveNode(day.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                          {concept.label}
                        </p>
                        {concept.sublabel && (
                          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                            {concept.sublabel}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-[10px] rounded-full px-2 py-0.5 shrink-0 font-medium text-white"
                        style={{ background: connectionColors[concept.connectionType] }}
                      >
                        {connectionLabels[concept.connectionType].split(" ")[0]}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-references */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Cross-Day Connections
        </h2>
        <div className="space-y-2">
          {[
            { from: "Day 2 (Firmament)", to: "Day 6 (Adam)", label: "Dam structure → A-DAM naming", type: "linguistic" as const },
            { from: "Day 1 (Light/Dark)", to: "Day 4 (Sun/Moon)", label: "Water flow → Control mechanisms", type: "engineering" as const },
            { from: "Day 3 (Gathered waters)", to: "Day 5 (Whales)", label: "Millpond → Waterwheels", type: "engineering" as const },
            { from: "Day 2 (Heaven)", to: "Day 3 (Earth)", label: "Upper water → Lower water division", type: "textual" as const },
          ].map((conn, i) => {
            const dimmed = activeLegend && conn.type !== activeLegend;
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl p-4 transition-opacity"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  opacity: dimmed ? 0.3 : 1,
                }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{conn.from}</span>
                <span className="hidden sm:block" style={{ color: connectionColors[conn.type] }}>&rarr;</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{conn.to}</span>
                <span className="text-xs rounded-full px-2 py-0.5 ml-auto font-medium text-white shrink-0"
                  style={{ background: connectionColors[conn.type] }}>
                  {connectionLabels[conn.type]}
                </span>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{conn.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl p-4 text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Connection types reflect the GEI evidence classification. Textual relationships are directly supported by scripture.
          GEI interpretations, linguistic proposals, and engineering analogies are research hypotheses under investigation.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/methodology" className="text-sm hover:opacity-80" style={{ color: "var(--accent)" }}>
          Learn how GEI classifies evidence &rarr;
        </Link>
      </div>
    </div>
  );
}

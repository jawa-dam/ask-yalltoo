"use client";

import { useState, useCallback } from "react";
import { SearchBar, getSearchHistory, clearSearchHistory } from "@/components/search-bar";
import { AnswerDisplay } from "@/components/answer-display";

const SUGGESTED_QUESTIONS = [
  "Is Adam a dam?",
  "What is Genesis Engineered Interpretation?",
  "What is the firmament according to GEI?",
  "How does GEI interpret Genesis Day 2?",
  "What is the connection between whales and waterwheels?",
  "How does the hydraulic model work?",
];

const TOPICS = [
  { label: "The Adam / A-DAM Hypothesis", query: "Adam dam hypothesis" },
  { label: "The Firmament as a Dam", query: "firmament dam structure" },
  { label: "Six Days of Creation", query: "six creation days GEI" },
  { label: "Whales and Waterwheels", query: "whales waterwheels Day 5" },
  { label: "GEI Methodology", query: "GEI methodology four stages" },
  { label: "Heaven and Water", query: "heaven shamayim water" },
];

export default function Home() {
  const [result, setResult] = useState<{
    answer: Parameters<typeof AnswerDisplay>[0]["answer"];
    documents: Parameters<typeof AnswerDisplay>[0]["documents"];
    relatedQuestions: string[];
    methodology: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    setShowHistory(false);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleHistory = () => {
    if (!showHistory) setHistory(getSearchHistory());
    setShowHistory(!showHistory);
  };

  const isHome = !result && !loading;

  return (
    <div className="water-pattern min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Hero */}
        {isHome && (
          <div className="pt-16 sm:pt-24 pb-8 text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
              <span className="gradient-text">ASK</span>{" "}
              <span style={{ color: "var(--text-primary)" }}>YALLTOO</span>
            </h1>
            <p className="text-lg mb-1" style={{ color: "var(--text-secondary)" }}>
              Ask the Questions. Explore the Connections.
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Your Gateway to Genesis Engineered Interpretation
            </p>
          </div>
        )}

        {/* Search */}
        <div className={isHome ? "py-6" : "py-6 sticky top-14 z-40"} style={isHome ? {} : { background: "var(--bg-primary)" }}>
          {!isHome && currentQuery && (
            <button onClick={() => { setResult(null); setCurrentQuery(""); setError(null); }} className="mb-3 text-sm hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
              &larr; New search
            </button>
          )}
          <SearchBar onSearch={handleSearch} initialQuery={currentQuery} large={isHome} loading={loading} key={currentQuery} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center animate-fade-in">
            <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
            <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>Searching the GEI research library...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="py-8 text-center animate-fade-in">
            <p className="text-sm" style={{ color: "#dc2626" }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="pb-16">
            <AnswerDisplay
              answer={result.answer}
              documents={result.documents}
              relatedQuestions={result.relatedQuestions}
              methodology={result.methodology}
              onAskRelated={handleSearch}
            />
          </div>
        )}

        {/* Home content */}
        {isHome && (
          <div className="pb-16 space-y-10 animate-fade-in">
            {/* Suggested Questions */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                Suggested Questions
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className="text-left rounded-xl p-4 text-sm transition-all hover:scale-[1.01]"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                  >
                    <span style={{ color: "var(--accent)" }}>&ldquo;</span> {q} <span style={{ color: "var(--accent)" }}>&rdquo;</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Popular Topics */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                Explore GEI Topics
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => handleSearch(t.query)}
                    className="text-left rounded-xl p-4 transition-all hover:scale-[1.01]"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                  >
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{t.label}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section className="grid gap-3 sm:grid-cols-3">
              <a href="/methodology" className="rounded-xl p-5 text-center transition-all hover:scale-[1.01] gradient-border"
                style={{ background: "var(--bg-secondary)" }}>
                <div className="text-2xl mb-2">&#x2699;</div>
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>How GEI Thinks</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Explore the methodology</p>
              </a>
              <a href="/library" className="rounded-xl p-5 text-center transition-all hover:scale-[1.01] gradient-border"
                style={{ background: "var(--bg-secondary)" }}>
                <div className="text-2xl mb-2">&#x1F4DA;</div>
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Knowledge Library</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Browse all research</p>
              </a>
              <a href="/about" className="rounded-xl p-5 text-center transition-all hover:scale-[1.01] gradient-border"
                style={{ background: "var(--bg-secondary)" }}>
                <div className="text-2xl mb-2">&#x1F4D6;</div>
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>About GEI</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Framework &amp; founder</p>
              </a>
            </section>

            {/* Search History */}
            <section className="text-center">
              <button onClick={toggleHistory} className="text-xs hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
                {showHistory ? "Hide" : "Show"} search history
              </button>
              {showHistory && history.length > 0 && (
                <div className="mt-3 space-y-1">
                  {history.map((h, i) => (
                    <button key={i} onClick={() => handleSearch(h)} className="block mx-auto text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
                      {h}
                    </button>
                  ))}
                  <button onClick={() => { clearSearchHistory(); setHistory([]); }} className="text-xs mt-2 hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
                    Clear history
                  </button>
                </div>
              )}
              {showHistory && history.length === 0 && (
                <p className="mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>No search history yet</p>
              )}
            </section>

            {/* Attribution */}
            <footer className="text-center pt-6 pb-4 space-y-2" style={{ borderTop: "1px solid var(--border-color)" }}>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Genesis Engineered Interpretation (GEI) &mdash; Founded by Wilbert Bouie Jr.
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                &ldquo;Don&apos;t just accept the answer. Explore the methodology.&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <a href="https://www.yalltoo.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">YALLTOO</a>
                <a href="https://zenodo.org/records/17316846" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">Zenodo</a>
                <a href="https://github.com/jawa-dam/GEI-Open-Research-Initiative" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">GitHub</a>
                <a href="https://youtu.be/8mYq2A_fgTA" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">YouTube</a>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

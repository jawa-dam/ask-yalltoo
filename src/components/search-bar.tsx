"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  large?: boolean;
  loading?: boolean;
}

export function SearchBar({ onSearch, initialQuery = "", large = false, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (large && inputRef.current) {
      inputRef.current.focus();
    }
  }, [large]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      saveToHistory(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search" aria-label="Search GEI research library">
      <div className={`search-glow rounded-2xl flex items-center gap-3 ${large ? "px-5 py-4" : "px-4 py-3"}`}
        style={{ background: "var(--bg-secondary)" }}>
        <svg width={large ? "22" : "18"} height={large ? "22" : "18"} viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about Genesis Engineered Interpretation..."
          className={`flex-1 bg-transparent outline-none ${large ? "text-lg" : "text-base"}`}
          style={{ color: "var(--text-primary)" }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="rounded-xl px-5 py-2 font-medium text-white transition-all disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              Searching
            </span>
          ) : "Ask"}
        </button>
      </div>
    </form>
  );
}

function saveToHistory(query: string) {
  try {
    const key = "ask-yalltoo-history";
    const raw = localStorage.getItem(key);
    const history: string[] = raw ? JSON.parse(raw) : [];
    const filtered = history.filter((h) => h !== query);
    filtered.unshift(query);
    localStorage.setItem(key, JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem("ask-yalltoo-history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearSearchHistory() {
  try { localStorage.removeItem("ask-yalltoo-history"); } catch {}
}

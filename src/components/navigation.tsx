"use client";

import Link from "next/link";
import { useTheme } from "./theme-provider";
import { useState } from "react";

export function Navigation() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: "1px solid var(--border-color)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--text-primary)" }}>
            <span className="gradient-text">ASK</span>
            <span>YALLTOO</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Link href="/" className="hover:opacity-80 transition-opacity">Search</Link>
            <Link href="/library" className="hover:opacity-80 transition-opacity">Knowledge Library</Link>
            <Link href="/knowledge-map" className="hover:opacity-80 transition-opacity">Knowledge Map</Link>
            <Link href="/methodology" className="hover:opacity-80 transition-opacity">How GEI Thinks</Link>
            <Link href="/about" className="hover:opacity-80 transition-opacity">About GEI</Link>
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ color: "var(--text-secondary)" }}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "var(--text-secondary)" }}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Search</Link>
            <Link href="/library" onClick={() => setMenuOpen(false)}>Knowledge Library</Link>
            <Link href="/knowledge-map" onClick={() => setMenuOpen(false)}>Knowledge Map</Link>
            <Link href="/methodology" onClick={() => setMenuOpen(false)}>How GEI Thinks</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About GEI</Link>
            <button onClick={() => { toggle(); setMenuOpen(false); }} className="text-left">
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

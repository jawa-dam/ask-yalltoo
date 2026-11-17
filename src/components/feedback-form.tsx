"use client";

import { useState } from "react";

const FEEDBACK_TYPES = [
  { value: "correction", label: "Submit a correction" },
  { value: "challenge", label: "Challenge an interpretation" },
  { value: "reference", label: "Suggest a reference" },
  { value: "question", label: "Ask a research question" },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

interface FeedbackEntry {
  type: FeedbackType;
  message: string;
  name: string;
  email: string;
  timestamp: string;
}

function saveFeedback(entry: FeedbackEntry) {
  try {
    const existing = JSON.parse(localStorage.getItem("ask-yalltoo-feedback") || "[]");
    existing.push(entry);
    localStorage.setItem("ask-yalltoo-feedback", JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

export function FeedbackForm({ context }: { context?: string }) {
  const [type, setType] = useState<FeedbackType>("correction");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const entry: FeedbackEntry = {
      type,
      message: context ? `[Context: ${context}] ${message}` : message,
      name: name.trim(),
      email: email.trim(),
      timestamp: new Date().toISOString(),
    };

    if (saveFeedback(entry)) {
      setSubmitted(true);
      setMessage("");
      setName("");
      setEmail("");
    } else {
      setError(true);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl p-5 text-center" style={{ background: "var(--bg-tertiary)" }}>
        <p className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
          Thank you for your feedback
        </p>
        <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
          Your submission has been saved locally. It will be reviewed when a backend system is available.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Disclaimer */}
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        Feedback is stored in your browser&apos;s local storage. When a backend review system is available,
        submissions will be forwarded for review by the GEI research team.
      </p>

      {/* Feedback type */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
          Feedback Type
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {FEEDBACK_TYPES.map((ft) => (
            <label
              key={ft.value}
              className="flex items-center gap-2 rounded-lg p-2.5 cursor-pointer text-sm transition-colors"
              style={{
                background: type === ft.value ? "var(--bg-tertiary)" : "transparent",
                border: type === ft.value ? "1px solid var(--accent)" : "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <input
                type="radio"
                name="feedback-type"
                value={ft.value}
                checked={type === ft.value}
                onChange={() => setType(ft.value)}
                className="sr-only"
              />
              <span
                className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: type === ft.value ? "var(--accent)" : "var(--text-tertiary)" }}
              >
                {type === ft.value && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                )}
              </span>
              {ft.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
          Message <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder={
            type === "correction"
              ? "Describe the error and the correction you suggest..."
              : type === "challenge"
              ? "Which interpretation do you challenge, and why?"
              : type === "reference"
              ? "What source or reference would you like to suggest?"
              : "What research question would you like GEI to investigate?"
          }
          className="w-full rounded-lg p-3 text-sm resize-y"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
            Name <span className="font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg p-2.5 text-sm"
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
            Email <span className="font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg p-2.5 text-sm"
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs" style={{ color: "#dc2626" }}>
          Unable to save feedback. Local storage may be unavailable.
        </p>
      )}

      <button
        type="submit"
        disabled={!message.trim()}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
      >
        Submit Feedback
      </button>
    </form>
  );
}

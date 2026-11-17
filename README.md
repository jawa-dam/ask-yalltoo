# ASK YALLTOO

**The GEI Knowledge & Discovery Engine**

> Ask the Questions. Explore the Connections.

ASK YALLTOO is a searchable knowledge engine for [Genesis Engineered Interpretation (GEI)](https://zenodo.org/records/17316846) — an independent research framework that examines the Genesis creation narrative through the lens of hydraulic engineering.

## What Is GEI?

Genesis Engineered Interpretation (GEI), founded by **Wilbert Bouie Jr.**, proposes that the six days of creation in Genesis 1-6 (KJV) may correspond to stages in the design, construction, and commissioning of a water-management system such as a dam, millpond, and associated hydraulic machinery.

GEI uses a four-stage methodology:
1. **Textual Investigation** - What does the passage say?
2. **Linguistic Investigation** - What language patterns are relevant?
3. **Engineering Investigation** - Can it be compared to an engineering system?
4. **Interpretive Synthesis** - Do the observations converge?

## Features

- Natural-language question search
- Structured answers grounded in GEI research documents
- Evidence classification for every claim
- Interactive methodology explorer
- Searchable knowledge library with 20+ research documents
- Scriptural references (KJV)
- Related questions for continued exploration
- Light/dark theme
- Mobile-responsive design

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Knowledge System**: Markdown with frontmatter metadata
- **Search**: Keyword-based retrieval with relevance scoring
- **Deployment**: Vercel-ready

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
ask-yalltoo/
├── knowledge/          # GEI research documents (Markdown)
│   ├── genesis/        # Day-by-day creation analysis
│   ├── adam-the-dam/   # Adam/A-DAM hypothesis
│   ├── firmament/      # Firmament and heaven
│   └── creation-symbolism/
├── methodology/        # GEI methodology documents
├── sources/            # Source registry and references
├── src/
│   ├── app/            # Next.js pages and API routes
│   ├── components/     # React components
│   └── lib/            # Knowledge indexing and search
└── tests/              # Test files
```

## Attribution

- **Framework**: Genesis Engineered Interpretation (GEI)
- **Founder**: Wilbert Bouie Jr.
- **Publication**: [DOI 10.5281/zenodo.17316845](https://doi.org/10.5281/zenodo.17316845)
- **Platform**: [YALLTOO](https://www.yalltoo.com/)

---

*"Don't just accept the answer. Explore the methodology."*

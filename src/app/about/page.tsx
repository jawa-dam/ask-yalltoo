import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6" style={{ color: "var(--text-primary)" }}>
        About Genesis Engineered Interpretation
      </h1>

      {/* Origin */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Origin</h2>
        <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Genesis Engineered Interpretation (GEI) is an independent research framework founded by{" "}
            <strong style={{ color: "var(--text-primary)" }}>Wilbert Bouie Jr.</strong> GEI proposes that the creation
            narrative in Genesis chapters 1 through 6 (King James Version) can be examined through the lens of hydraulic
            engineering and ancient water-management systems.
          </p>
          <p className="leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
            GEI does not claim to replace traditional theological, literary, or historical interpretations of Genesis.
            It offers an alternative analytical framework that investigates whether the language, sequence, and imagery
            of the creation account may describe or parallel the construction and operation of a water-management system.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Founder</h2>
        <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <p className="font-medium text-lg mb-1" style={{ color: "var(--text-primary)" }}>Wilbert Bouie Jr.</p>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Independent Researcher</p>
          <p className="leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
            Wilbert Bouie Jr. is the creator and primary researcher of the Genesis Engineered Interpretation framework.
            GEI represents his independent investigation into the potential connections between the Genesis creation
            narrative and hydraulic engineering concepts.
          </p>
        </div>
      </section>

      {/* Research Scope */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Research Scope</h2>
        <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <ul className="space-y-2">
            {[
              "Genesis chapters 1 through 6, King James Version",
              "The six days of creation and their proposed engineering parallels",
              "Key figures and concepts: Adam, the firmament, heaven, whales, and others",
              "Four-stage methodology: textual, linguistic, engineering, and interpretive synthesis",
              "Transparent evidence classification system",
            ].map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }}/>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Research Limitations */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Research Limitations</h2>
        <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <ul className="space-y-2">
            {[
              "GEI is an independent research framework, not a peer-reviewed academic discipline",
              "GEI interpretations are proposed hypotheses, not established facts",
              "Several key observations rely on English phonetics rather than Hebrew etymology",
              "Engineering parallels demonstrate possibility, not proven authorial intent",
              "GEI does not invalidate established theological, literary, or historical interpretations",
              "The framework invites independent examination, challenge, and verification",
            ].map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--text-tertiary)" }}/>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Publications & References */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Publications &amp; References</h2>
        <div className="space-y-2">
          {[
            { title: "Zenodo Publication", url: "https://zenodo.org/records/17316846", desc: "DOI: 10.5281/zenodo.17316845" },
            { title: "GEI Open Research Initiative", url: "https://github.com/jawa-dam/GEI-Open-Research-Initiative", desc: "GitHub research repository" },
            { title: "Research Portfolio", url: "https://jawa-dam.github.io/Research/", desc: "Research portfolio website" },
            { title: "YALLTOO", url: "https://www.yalltoo.com/", desc: "Educational platform" },
            { title: "YouTube Presentation", url: "https://youtu.be/8mYq2A_fgTA", desc: "Video presentation" },
          ].map((pub) => (
            <a key={pub.title} href={pub.url} target="_blank" rel="noopener noreferrer"
              className="block rounded-xl p-4 hover:opacity-80 transition-opacity"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
              <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{pub.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{pub.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Invitation */}
      <section className="text-center rounded-xl p-8 gradient-border" style={{ background: "var(--bg-secondary)" }}>
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Examine the Evidence
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          GEI is an open research framework. Examine the methodology, challenge the interpretations,
          and form your own conclusions.
        </p>
        <p className="text-sm italic mb-6" style={{ color: "var(--text-tertiary)" }}>
          &ldquo;Don&apos;t just accept the answer. Explore the methodology.&rdquo;
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-xl px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}>
            Ask a Question
          </Link>
          <Link href="/methodology" className="rounded-xl px-5 py-2.5 text-sm font-medium"
            style={{ color: "var(--text-primary)", border: "1px solid var(--border-color)" }}>
            Explore Methodology
          </Link>
        </div>
      </section>
    </div>
  );
}

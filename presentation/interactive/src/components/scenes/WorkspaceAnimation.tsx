import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function WorkspaceAnimation(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Project tree builds progressively
      tl.fromTo(".ws-tree-root", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 });
      tl.fromTo(".ws-tree-line", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.08 }, "-=0.1");

      // Highlight .claude/ and workspace/
      tl.fromTo(".ws-highlight", { backgroundColor: "transparent" }, { backgroundColor: "rgba(59,130,246,0.15)", duration: 0.4, stagger: 0.15 }, "+=0.2");

      // Connector
      tl.fromTo(".ws-connector", { scaleX: 0 }, { scaleX: 1, duration: 0.4, transformOrigin: "left center" }, "+=0.1");

      // Stage cards
      tl.fromTo(".ws-card", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.22 }, "-=0.1");

      // Tagline
      tl.fromTo(".ws-tagline", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, "+=0.2");
      tl.to(".ws-tagline", { opacity: 0.6, yoyo: true, repeat: 1, duration: 0.4 }, "+=0.3");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full h-full flex flex-col items-center justify-center gap-5 px-8 py-4">
      <div className="flex items-start gap-6 w-full max-w-5xl">
        {/* Project tree */}
        <div className="font-mono text-xs shrink-0 bg-scene-bg border border-scene-border rounded-xl p-4 min-w-[280px]">
          <div className="ws-tree-root text-scene-accent font-semibold text-sm mb-2">📁 my-app/</div>
          {TREE_LINES.map((line, i) => (
            <div
              key={i}
              className={`ws-tree-line flex items-center gap-1.5 py-0.5 px-1 rounded ${line.highlight ? "ws-highlight" : ""}`}
              style={{ marginLeft: line.indent * 14 }}
            >
              <span className="text-scene-border">{line.prefix}</span>
              <span className={line.highlight ? "text-scene-accent font-semibold" : line.dim ? "text-scene-border" : "text-scene-muted"}>
                {line.icon} {line.name}
              </span>
            </div>
          ))}
        </div>

        {/* Connector */}
        <div className="ws-connector self-center flex-1 h-0.5 bg-scene-border rounded-full" />

        {/* Stage cards */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {STAGE_CARDS.map((card) => (
            <div key={card.id} className="ws-card rounded-xl border border-scene-border bg-scene-bg p-4">
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: card.badgeBg, color: card.badgeText }}
                >
                  {card.id}
                </span>
                <div className="min-w-0">
                  <p className="text-scene-text font-semibold text-sm leading-snug">{card.title}</p>
                  <p className="font-mono text-xs text-scene-muted mt-0.5">{card.filename}</p>
                  <p className="text-scene-muted text-xs mt-1 leading-snug">{card.description}</p>
                  <p className="text-xs mt-1.5">
                    <span className="text-scene-border">agente: </span>
                    <span className="text-scene-accent-light font-mono">{card.agent}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="ws-tagline text-sm text-scene-muted border border-scene-border rounded-full px-5 py-1.5 font-mono tracking-wide">
        Auditable · reproducible · revisable en PR
      </p>
    </div>
  );
}

const TREE_LINES = [
  { indent: 0, prefix: "├─", icon: "📁", name: ".claude/", highlight: true, dim: false },
  { indent: 1, prefix: "├─", icon: "📄", name: "agents/", highlight: false, dim: true },
  { indent: 1, prefix: "└─", icon: "📄", name: "settings.json", highlight: false, dim: true },
  { indent: 0, prefix: "├─", icon: "📁", name: "src/", highlight: false, dim: false },
  { indent: 1, prefix: "├─", icon: "📁", name: "components/", highlight: false, dim: true },
  { indent: 1, prefix: "├─", icon: "📁", name: "services/", highlight: false, dim: true },
  { indent: 1, prefix: "├─", icon: "📄", name: "app.ts", highlight: false, dim: true },
  { indent: 1, prefix: "└─", icon: "📄", name: "index.ts", highlight: false, dim: true },
  { indent: 0, prefix: "├─", icon: "📁", name: "tests/", highlight: false, dim: false },
  { indent: 1, prefix: "└─", icon: "📄", name: "app.test.ts", highlight: false, dim: true },
  { indent: 0, prefix: "├─", icon: "📄", name: "package.json", highlight: false, dim: true },
  { indent: 0, prefix: "├─", icon: "📄", name: "CLAUDE.md", highlight: true, dim: false },
  { indent: 0, prefix: "├─", icon: "📄", name: "README.md", highlight: true, dim: false },
  { indent: 0, prefix: "├─", icon: "📄", name: "CHANGELOG.md", highlight: false, dim: false },
  { indent: 0, prefix: "└─", icon: "📁", name: "workspace/", highlight: true, dim: false },
  { indent: 1, prefix: "└─", icon: "📁", name: "{feature}/", highlight: true, dim: false },
  { indent: 2, prefix: "├─", icon: "📄", name: "01-plan.md", highlight: false, dim: false },
  { indent: 2, prefix: "├─", icon: "📄", name: "02-implementation.md", highlight: false, dim: false },
  { indent: 2, prefix: "└─", icon: "📄", name: "03-review.md", highlight: false, dim: false },
] as const;

const STAGE_CARDS = [
  {
    id: "01",
    title: "Plan",
    filename: "01-plan.md",
    description: "User story, criterios de aceptación, task list y enfoque técnico.",
    agent: "Planner",
    badgeBg: "#166534",
    badgeText: "#86efac",
  },
  {
    id: "02",
    title: "Implementación",
    filename: "02-implementation.md",
    description: "Bitácora de cambios por tarea, decisiones y notas técnicas.",
    agent: "Implementer",
    badgeBg: "#854d0e",
    badgeText: "#fde68a",
  },
  {
    id: "03",
    title: "Review",
    filename: "03-review.md",
    description: "Hallazgos de testing, QA contra criterios y validación de seguridad.",
    agent: "Tester · QA · Security",
    badgeBg: "#581c87",
    badgeText: "#d8b4fe",
  },
] as const;

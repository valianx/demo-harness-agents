import { useRef, useEffect } from "react";
import gsap from "gsap";

// Fixed artistic layout for the vector space dots (x, y in SVG coords within a 360x220 canvas)
const VECTOR_DOTS: Array<{ id: string; x: number; y: number; type: "process" | "arch" | "pattern" }> = [
  { id: "d1",  x: 50,  y: 40,  type: "process"  },
  { id: "d2",  x: 110, y: 80,  type: "arch"      },
  { id: "d3",  x: 60,  y: 140, type: "pattern"   },
  { id: "d4",  x: 160, y: 30,  type: "process"   },
  { id: "d5",  x: 200, y: 90,  type: "arch"      },
  { id: "d6",  x: 140, y: 165, type: "pattern"   },
  { id: "d7",  x: 240, y: 50,  type: "process"   },
  { id: "d8",  x: 290, y: 110, type: "arch"      },
  { id: "d9",  x: 260, y: 170, type: "pattern"   },
  { id: "d10", x: 310, y: 40,  type: "process"   },
  { id: "d11", x: 80,  y: 185, type: "arch"      },
  { id: "d12", x: 330, y: 185, type: "pattern"   },
  { id: "d13", x: 190, y: 195, type: "process"   },
  { id: "d14", x: 20,  y: 100, type: "arch"      },
  { id: "d15", x: 350, y: 130, type: "pattern"   },
];

// Query dot position (the "architect searching")
const QUERY = { x: 210, y: 135 };

// Nearest neighbors indices (0-based into VECTOR_DOTS)
const NEAREST = [4, 5, 8]; // d5, d6, d9

const DOT_COLORS: Record<string, string> = {
  process: "#3b82f6",
  arch:    "#22c55e",
  pattern: "#a78bfa",
};

/**
 * Two-part GSAP animation for Slide 13.
 *
 * Part 1 (0–4s): Knowledge flow — task A → delivery → KG → architect → task B
 * Part 2 (4–10s): Vector space zoom — semantic similarity search visualization
 */
export default function VectorDBDemo(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, repeat: -1, repeatDelay: 1.5 });

      // Reset state at the top of each loop iteration so repeat starts clean
      tl.set(".kf-panel", { opacity: 1 });
      tl.set(".vd-panel", { opacity: 0 });

      // ── Part 1: Knowledge Flow ──────────────────────────────────────────────

      // Task A appears
      tl.fromTo(".kf-task-a", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.45 });

      // Delivery agent appears below Task A
      tl.fromTo(".kf-delivery", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, "+=0.1");

      // Arrow from delivery to KG draws in
      tl.fromTo(
        ".kf-arrow-left",
        { strokeDashoffset: 120 },
        { strokeDashoffset: 0, duration: 0.55, ease: "none" },
        "+=0.15",
      );

      // Dot traveling left→right on arrow
      tl.fromTo(".kf-dot-left", { opacity: 1, cx: 168, }, { cx: 258, duration: 0.55, ease: "none" }, "<");

      // KG circle pulses (insight arrives)
      tl.fromTo(".kf-kg", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, transformOrigin: "center" });
      tl.to(".kf-kg", { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: "center" });

      // KG label
      tl.fromTo(".kf-kg-label", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.1");

      // Arrow from KG to architect draws in
      tl.fromTo(
        ".kf-arrow-right",
        { strokeDashoffset: 120 },
        { strokeDashoffset: 0, duration: 0.55, ease: "none" },
        "+=0.2",
      );

      // Dot traveling KG→architect
      tl.fromTo(".kf-dot-right", { opacity: 1, cx: 358 }, { cx: 448, duration: 0.55, ease: "none" }, "<");

      // Architect + Task B appear
      tl.fromTo(".kf-architect", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, "+=0.1");
      tl.fromTo(".kf-task-b", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35 }, "+=0.05");

      // Caption line
      tl.fromTo(".kf-caption", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "+=0.2");

      // ── Part 2: Vector DB zoom ──────────────────────────────────────────────

      tl.addLabel("part2", "+=0.6");

      // Fade out knowledge flow
      tl.to(".kf-panel", { opacity: 0, duration: 0.4 }, "part2");

      // Vector space panel fades in
      tl.fromTo(".vd-panel", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "part2+=0.3");

      // Dots appear with stagger
      tl.fromTo(
        ".vd-dot",
        { opacity: 0, scale: 0 },
        { opacity: 0.7, scale: 1, duration: 0.3, stagger: 0.05, transformOrigin: "center" },
        "part2+=0.5",
      );

      // Legend appears
      tl.fromTo(".vd-legend", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "part2+=1.4");

      // Query dot materializes
      tl.fromTo(
        ".vd-query",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", transformOrigin: "center" },
        "part2+=1.8",
      );

      // Query label
      tl.fromTo(".vd-query-label", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "part2+=2.1");

      // Similarity lines draw in one by one
      NEAREST.forEach((idx, i) => {
        tl.fromTo(
          `.vd-line-${idx}`,
          { strokeDashoffset: 200 },
          { strokeDashoffset: 0, duration: 0.5, ease: "none" },
          `part2+=${2.4 + i * 0.35}`,
        );
      });

      // Nearest dots pulse and brighten; others fade
      tl.to(
        ".vd-dot-nearest",
        { opacity: 1, scale: 1.5, duration: 0.35, stagger: 0.1, transformOrigin: "center" },
        "part2+=3.6",
      );
      tl.to(
        ".vd-dot-far",
        { opacity: 0.15, duration: 0.4 },
        "part2+=3.6",
      );

      // Tooltip fades in
      tl.fromTo(".vd-tooltip", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, "part2+=4.0");

      // Hold for 2s then fade out the vector panel before looping back to Part 1
      tl.to(".vd-panel", { opacity: 0, duration: 0.5 }, "+=2");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Compute SVG line length for stroke-dasharray (approximate per segment)
  function lineLen(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  return (
    <div
      ref={rootRef}
      className="w-full h-full flex flex-col items-center justify-center px-6 py-4 relative"
    >
      {/* ── Part 1 panel ── */}
      <div className="kf-panel absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-4">
        <p className="text-sm font-mono text-scene-muted uppercase tracking-widest mb-1">
          Flujo de conocimiento
        </p>

        {/* Flow row */}
        <svg
          viewBox="0 0 620 220"
          className="w-full max-w-4xl"
          style={{ overflow: "visible" }}
        >
          {/* Task A box */}
          <g className="kf-task-a">
            <rect x="10" y="70" width="130" height="56" rx="10"
              fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <text x="75" y="96" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">
              Task A
            </text>
            <text x="75" y="113" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Completa
            </text>
          </g>

          {/* Delivery box */}
          <g className="kf-delivery">
            <rect x="10" y="145" width="130" height="48" rx="8"
              fill="#0f1f0f" stroke="#166534" strokeWidth="1.5" />
            <text x="75" y="167" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="600">
              Delivery Agent
            </text>
            <text x="75" y="183" textAnchor="middle" fill="#4ade80" fontSize="9.5">
              captura insight
            </text>
          </g>

          {/* Arrow left (delivery → KG) */}
          <line
            className="kf-arrow-left"
            x1="168" y1="155" x2="258" y2="110"
            stroke="#3b82f6" strokeWidth="2"
            strokeDasharray="120" strokeDashoffset="120"
            markerEnd="url(#arrowBlue)"
          />
          {/* Moving dot left */}
          <circle className="kf-dot-left" cx="168" cy="110" r="4" fill="#3b82f6" opacity="0" />

          {/* KG circle */}
          <g className="kf-kg">
            <circle cx="310" cy="110" r="44" fill="#1a1a2e" stroke="#6d28d9" strokeWidth="2" />
            <text x="310" y="106" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700">
              Knowledge
            </text>
            <text x="310" y="121" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700">
              Graph
            </text>
          </g>
          <g className="kf-kg-label">
            <text x="310" y="166" textAnchor="middle" fill="#7c3aed" fontSize="9">
              nodo process-insight
            </text>
          </g>

          {/* Arrow right (KG → architect) */}
          <line
            className="kf-arrow-right"
            x1="358" y1="110" x2="448" y2="140"
            stroke="#3b82f6" strokeWidth="2"
            strokeDasharray="120" strokeDashoffset="120"
            markerEnd="url(#arrowBlue)"
          />
          {/* Moving dot right */}
          <circle className="kf-dot-right" cx="358" cy="110" r="4" fill="#3b82f6" opacity="0" />

          {/* Architect box */}
          <g className="kf-architect">
            <rect x="460" y="118" width="130" height="48" rx="8"
              fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <text x="525" y="140" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="600">
              Architect
            </text>
            <text x="525" y="156" textAnchor="middle" fill="#94a3b8" fontSize="9.5">
              lee contexto
            </text>
          </g>

          {/* Task B box */}
          <g className="kf-task-b">
            <rect x="460" y="50" width="130" height="56" rx="10"
              fill="#14291a" stroke="#166534" strokeWidth="1.5" />
            <text x="525" y="76" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="600">
              Task B
            </text>
            <text x="525" y="93" textAnchor="middle" fill="#4ade80" fontSize="10">
              mejor plan
            </text>
          </g>

          {/* SVG arrow marker */}
          <defs>
            <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>

        {/* Caption */}
        <p className="kf-caption text-sm text-scene-muted text-center max-w-lg leading-relaxed">
          Cada delivery captura un insight en el KG. El próximo architect lo lee y genera mejores planes.
        </p>
      </div>

      {/* ── Part 2 panel ── */}
      <div className="vd-panel absolute inset-0 flex flex-col items-center justify-center px-6 py-4" style={{ opacity: 0 }}>
        <p className="text-sm font-mono text-scene-muted uppercase tracking-widest mb-4">
          Búsqueda por similitud semántica
        </p>

        <div className="flex items-start gap-8 w-full max-w-4xl">
          {/* Vector space SVG */}
          <svg viewBox="0 0 380 230" className="flex-1 rounded-xl border border-scene-border bg-scene-bg" style={{ minWidth: 0 }}>
            {/* Background grid lines (subtle) */}
            {[60, 120, 180, 240, 300].map((x) => (
              <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="230" stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {[57, 114, 171].map((y) => (
              <line key={`gy-${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#1e293b" strokeWidth="0.5" />
            ))}

            {/* Similarity lines (drawn before query so they appear behind dots) */}
            {NEAREST.map((idx) => {
              const dot = VECTOR_DOTS[idx];
              const len = lineLen(QUERY.x, QUERY.y, dot.x, dot.y);
              return (
                <line
                  key={`vd-line-${idx}`}
                  className={`vd-line-${idx}`}
                  x1={QUERY.x} y1={QUERY.y}
                  x2={dot.x} y2={dot.y}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray={len}
                  strokeDashoffset={len}
                  opacity="0.7"
                />
              );
            })}

            {/* Scattered dots */}
            {VECTOR_DOTS.map((dot, idx) => {
              const isNearest = NEAREST.includes(idx);
              return (
                <circle
                  key={dot.id}
                  className={`vd-dot ${isNearest ? "vd-dot-nearest" : "vd-dot-far"}`}
                  cx={dot.x} cy={dot.y} r="6"
                  fill={DOT_COLORS[dot.type]}
                  opacity="0"
                />
              );
            })}

            {/* Query dot */}
            <circle
              className="vd-query"
              cx={QUERY.x} cy={QUERY.y} r="8"
              fill="#fbbf24"
              opacity="0"
            />
            {/* Query label */}
            <text
              className="vd-query-label"
              x={QUERY.x + 12} y={QUERY.y - 10}
              fill="#fde68a" fontSize="9.5" fontWeight="600"
              opacity="0"
            >
              query
            </text>
          </svg>

          {/* Legend + tooltip */}
          <div className="flex flex-col gap-3 w-44 shrink-0">
            <div className="vd-legend flex flex-col gap-2 bg-scene-bg border border-scene-border rounded-xl p-4" style={{ opacity: 0 }}>
              <p className="text-xs font-mono text-scene-muted uppercase tracking-wider mb-1">Tipos de nodo</p>
              {[
                { color: "#3b82f6", label: "process-insight" },
                { color: "#22c55e", label: "architecture"    },
                { color: "#a78bfa", label: "pattern"         },
                { color: "#fbbf24", label: "query actual"    },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-scene-muted">{label}</span>
                </div>
              ))}
            </div>

            <div
              className="vd-tooltip bg-scene-surface border border-yellow-500/40 rounded-xl p-4"
              style={{ opacity: 0 }}
            >
              <p className="text-xs text-yellow-300 font-semibold mb-1">Similitud semántica</p>
              <p className="text-xs text-scene-muted leading-relaxed">
                Los 3 insights más relevantes se inyectan como contexto al Architect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

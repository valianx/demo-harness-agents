import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

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

const QUERY = { x: 210, y: 135 };
const NEAREST = [4, 5, 8];

const DOT_COLORS: Record<string, string> = {
  process: "#3b82f6",
  arch:    "#22c55e",
  pattern: "#a78bfa",
};

const STAGES = [
  { id: 0, label: "Flujo de conocimiento" },
  { id: 1, label: "Búsqueda semántica" },
];

export default function VectorDBDemo(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const playStage = useCallback((stage: number) => {
    if (!rootRef.current) return;
    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }

    const ctx = gsap.context(() => {
      // Reset both panels
      gsap.set(".kf-panel", { opacity: stage === 0 ? 1 : 0 });
      gsap.set(".vd-panel", { opacity: stage === 1 ? 1 : 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tlRef.current = tl;

      if (stage === 0) {
        // Reset Part 1 elements
        gsap.set([".kf-task-a", ".kf-delivery", ".kf-kg", ".kf-kg-label", ".kf-architect", ".kf-task-b", ".kf-caption"], { opacity: 0 });
        gsap.set([".kf-arrow-left", ".kf-arrow-right"], { strokeDashoffset: 165 });

        tl.fromTo(".kf-task-a", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.45 });
        tl.fromTo(".kf-delivery", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, "+=0.1");
        tl.fromTo(".kf-arrow-left", { strokeDashoffset: 165 }, { strokeDashoffset: 0, duration: 0.55, ease: "none" }, "+=0.15");
        tl.fromTo(".kf-dot-left", { opacity: 1, cx: 135, cy: 80 }, { cx: 285, cy: 80, duration: 0.55, ease: "none" }, "<");
        tl.fromTo(".kf-kg", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, transformOrigin: "center" });
        tl.to(".kf-kg", { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: "center" });
        tl.fromTo(".kf-kg-label", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.1");
        tl.fromTo(".kf-arrow-right", { strokeDashoffset: 165 }, { strokeDashoffset: 0, duration: 0.55, ease: "none" }, "+=0.2");
        tl.fromTo(".kf-dot-right", { opacity: 1, cx: 410, cy: 80 }, { cx: 555, cy: 80, duration: 0.55, ease: "none" }, "<");
        tl.fromTo(".kf-architect", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, "+=0.1");
        tl.fromTo(".kf-task-b", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35 }, "+=0.05");
        tl.fromTo(".kf-caption", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "+=0.2");
      } else {
        // Reset Part 2 elements
        gsap.set(".vd-dot", { opacity: 0, scale: 0 });
        gsap.set(".vd-query", { opacity: 0, scale: 0 });
        gsap.set([".vd-query-label", ".vd-legend", ".vd-tooltip"], { opacity: 0 });
        NEAREST.forEach((idx) => {
          const dot = VECTOR_DOTS[idx];
          const len = lineLen(QUERY.x, QUERY.y, dot.x, dot.y);
          gsap.set(`.vd-line-${idx}`, { strokeDashoffset: len });
        });

        tl.fromTo(".vd-dot", { opacity: 0, scale: 0 }, { opacity: 0.7, scale: 1, duration: 0.3, stagger: 0.05, transformOrigin: "center" });
        tl.fromTo(".vd-legend", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "+=0.3");
        tl.fromTo(".vd-query", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", transformOrigin: "center" }, "+=0.4");
        tl.fromTo(".vd-query-label", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "+=0.1");

        NEAREST.forEach((idx, i) => {
          tl.fromTo(`.vd-line-${idx}`, { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 0.5, ease: "none" }, `>+=${i === 0 ? 0.3 : 0.2}`);
        });

        tl.to(".vd-dot-nearest", { opacity: 1, scale: 1.5, duration: 0.35, stagger: 0.1, transformOrigin: "center" }, "+=0.2");
        tl.to(".vd-dot-far", { opacity: 0.15, duration: 0.4 }, "<");
        tl.fromTo(".vd-tooltip", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, "+=0.3");
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    playStage(activeStage);
  }, [activeStage, playStage]);

  useEffect(() => {
    return () => { if (tlRef.current) tlRef.current.kill(); };
  }, []);

  function lineLen(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  return (
    <div ref={rootRef} className="w-full h-full flex flex-col items-center justify-center px-6 py-4 relative">
      {/* Stage controls */}
      <div className="absolute top-14 right-5 z-40 flex items-center gap-2 bg-scene-bg/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-scene-border/30">
        {STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStage(s.id)}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              activeStage === s.id
                ? "bg-scene-accent text-white"
                : "bg-scene-surface text-scene-muted hover:text-scene-text hover:bg-scene-border border border-scene-border"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Part 1 panel */}
      <div className="kf-panel absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-4">
        <p className="text-sm font-mono text-scene-muted uppercase tracking-widest mb-1">
          Flujo de conocimiento
        </p>
        <svg viewBox="0 0 700 160" className="w-full max-w-4xl" style={{ overflow: "visible" }}>
          <defs>
            <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
            </marker>
          </defs>
          {/* Row: Task A + Delivery | → KG → | Architect + Task B */}
          {/* Task A */}
          <g className="kf-task-a">
            <rect x="0" y="10" width="120" height="50" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <text x="60" y="32" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">Task A</text>
            <text x="60" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">Completa</text>
          </g>
          {/* Delivery */}
          <g className="kf-delivery">
            <rect x="0" y="80" width="120" height="50" rx="8" fill="#0f1f0f" stroke="#166534" strokeWidth="1.5" />
            <text x="60" y="102" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="600">Delivery Agent</text>
            <text x="60" y="118" textAnchor="middle" fill="#4ade80" fontSize="9.5">captura insight</text>
          </g>
          {/* Arrow: Delivery → KG */}
          <line className="kf-arrow-left" x1="130" y1="80" x2="295" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="165" strokeDashoffset="165" markerEnd="url(#arrowBlue)" />
          <circle className="kf-dot-left" cx="130" cy="80" r="4" fill="#3b82f6" opacity="0" />
          {/* KG */}
          <g className="kf-kg">
            <circle cx="390" cy="80" r="50" fill="#1a1a2e" stroke="#6d28d9" strokeWidth="2" />
            <text x="390" y="75" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="700">Knowledge</text>
            <text x="390" y="91" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="700">Graph</text>
          </g>
          <g className="kf-kg-label" />
          {/* Arrow: KG → Architect */}
          <line className="kf-arrow-right" x1="405" y1="80" x2="565" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="165" strokeDashoffset="165" markerEnd="url(#arrowBlue)" />
          <circle className="kf-dot-right" cx="405" cy="80" r="4" fill="#3b82f6" opacity="0" />
          {/* Task B */}
          <g className="kf-task-b">
            <rect x="570" y="10" width="120" height="50" rx="10" fill="#14291a" stroke="#166534" strokeWidth="1.5" />
            <text x="630" y="32" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="600">Task B</text>
            <text x="630" y="48" textAnchor="middle" fill="#4ade80" fontSize="10">mejor plan</text>
          </g>
          {/* Architect */}
          <g className="kf-architect">
            <rect x="570" y="80" width="120" height="50" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <text x="630" y="102" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">Architect</text>
            <text x="630" y="118" textAnchor="middle" fill="#94a3b8" fontSize="10">lee contexto</text>
          </g>
        </svg>
        <p className="kf-caption text-sm text-scene-muted text-center max-w-lg leading-relaxed">
          Cada delivery captura un insight en el KG. El próximo architect lo lee y genera mejores planes.
        </p>
      </div>

      {/* Part 2 panel */}
      <div className="vd-panel absolute inset-0 flex flex-col items-center justify-center px-6 py-4" style={{ opacity: 0 }}>
        <p className="text-sm font-mono text-scene-muted uppercase tracking-widest mb-4">
          Búsqueda por similitud semántica
        </p>
        <div className="flex items-start gap-8 w-full max-w-4xl">
          <svg viewBox="0 0 380 230" className="flex-1 rounded-xl border border-scene-border bg-scene-bg" style={{ minWidth: 0 }}>
            {[60, 120, 180, 240, 300].map((x) => (
              <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="230" stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {[57, 114, 171].map((y) => (
              <line key={`gy-${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {NEAREST.map((idx) => {
              const dot = VECTOR_DOTS[idx];
              const len = lineLen(QUERY.x, QUERY.y, dot.x, dot.y);
              return (
                <line key={`vd-line-${idx}`} className={`vd-line-${idx}`}
                  x1={QUERY.x} y1={QUERY.y} x2={dot.x} y2={dot.y}
                  stroke="#fbbf24" strokeWidth="1.5" strokeDasharray={len} strokeDashoffset={len} opacity="0.7" />
              );
            })}
            {VECTOR_DOTS.map((dot, idx) => (
              <circle key={dot.id} className={`vd-dot ${NEAREST.includes(idx) ? "vd-dot-nearest" : "vd-dot-far"}`}
                cx={dot.x} cy={dot.y} r="6" fill={DOT_COLORS[dot.type]} opacity="0" />
            ))}
            <circle className="vd-query" cx={QUERY.x} cy={QUERY.y} r="8" fill="#fbbf24" opacity="0" />
            <text className="vd-query-label" x={QUERY.x + 12} y={QUERY.y - 10} fill="#fde68a" fontSize="9.5" fontWeight="600" opacity="0">query</text>
          </svg>
          <div className="flex flex-col gap-3 w-44 shrink-0">
            <div className="vd-legend flex flex-col gap-2 bg-scene-bg border border-scene-border rounded-xl p-4" style={{ opacity: 0 }}>
              <p className="text-xs font-mono text-scene-muted uppercase tracking-wider mb-1">Tipos de nodo</p>
              {[
                { color: "#3b82f6", label: "process-insight" },
                { color: "#22c55e", label: "architecture" },
                { color: "#a78bfa", label: "pattern" },
                { color: "#fbbf24", label: "query actual" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-scene-muted">{label}</span>
                </div>
              ))}
            </div>
            <div className="vd-tooltip bg-scene-surface border border-yellow-500/40 rounded-xl p-4" style={{ opacity: 0 }}>
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

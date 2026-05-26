import { MarkerType } from "@xyflow/react";
import type { PresentationConfig } from "../types";

// Grid helper for React Flow node positioning
// Pipeline grid helper for Slide 10 (wider spacing, 3 stage columns)
const PGS = { x: 240, y: 130 };
function PG(col: number, row: number) {
  return { x: col * PGS.x, y: row * PGS.y };
}

// Node style presets for Slide 10
const PN = {
  background: "#1e293b",
  color: "#f1f5f9",
  border: "2px solid #475569",
  borderRadius: "12px",
  padding: "14px 22px",
  fontSize: "13px",
  fontWeight: 600,
  minWidth: "150px",
};

// Parallel agents (green tint to indicate parallel execution)
const PP = {
  ...PN,
  border: "2px solid #22c55e",
};

// Gate nodes (blue accent — mandatory human stop)
const PG_GATE = {
  background: "#172554",
  color: "#60a5fa",
  border: "2.5px solid #3b82f6",
  borderRadius: "12px",
  padding: "14px 22px",
  fontSize: "13px",
  fontWeight: 700,
  minWidth: "160px",
};

// Optional gate (dashed border — skippable with approve-autonomous)
const PG_GATE_OPT = {
  ...PG_GATE,
  border: "2px dashed #3b82f6",
};

// KG node (purple — knowledge graph)
const PK = {
  background: "#1a1a2e",
  color: "#c4b5fd",
  border: "2px solid #7c3aed",
  borderRadius: "12px",
  padding: "14px 22px",
  fontSize: "13px",
  fontWeight: 600,
  minWidth: "150px",
};

// Shared edge marker
const arrow = { type: MarkerType.ArrowClosed, color: "#3b82f6" };

export const config: PresentationConfig = {
  title: "Agentic Development · Demo Técnico",
  scenes: [
    // ─── Slide 1 — Title ────────────────────────────────────────────
    {
      id: "titulo",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col items-center justify-center h-full gap-7 text-center">
          <p class="text-base font-mono tracking-widest text-scene-accent uppercase">Demo Técnico</p>
          <h1 class="text-7xl font-bold text-scene-text leading-tight">Agentic Development</h1>
          <p class="text-2xl text-scene-muted max-w-2xl">
            Una nueva forma de construir software con IA
          </p>
          <p class="text-lg text-scene-muted max-w-xl mt-2 leading-relaxed">
            Hoy vemos el concepto y una prueba de concepto con un harness.<br/>
            A continuación presentaremos cómo lo aplicamos en nuestro sistema real.
          </p>
          <div class="mt-8 flex items-center gap-3 text-scene-muted text-base border border-scene-border/50 rounded-full px-6 py-2 backdrop-blur-sm">
            <span>Mario Gutiérrez</span>
            <span class="text-scene-border">·</span>
            <span>Equipo Zippy</span>
          </div>
        </div>
      `,
    },

    // ─── Slide 2 — ¿Qué es el desarrollo agéntico? ──────────────────
    {
      id: "definicion",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-8 w-full max-w-5xl mx-auto">
          <div>
            <p class="text-sm font-mono text-scene-accent tracking-widest uppercase mb-2">00</p>
            <h2 class="text-4xl font-bold text-scene-text">¿Qué es el desarrollo agéntico?</h2>
            <p class="text-lg text-scene-muted mt-2">Un cambio de paradigma: la IA pasa de sugerir a ejecutar.</p>
          </div>

          <div class="rounded-xl border border-scene-accent/40 bg-scene-accent/5 p-6">
            <p class="text-sm font-mono text-scene-accent uppercase tracking-widest mb-3">Definición</p>
            <p class="text-lg text-scene-text leading-relaxed">
              Paradigma donde la IA ejecuta tareas multi-paso de forma autónoma, planifica,
              usa herramientas y toma decisiones iterativas — no solo responde a un prompt.
            </p>
            <p class="text-base text-scene-muted mt-3">
              El dev pasa de escribir cada línea a dirigir agentes que la escriben por él.
            </p>
          </div>

          <div>
            <p class="text-sm font-mono text-scene-muted uppercase tracking-widest mb-4">La evolución</p>
            <div class="flex gap-4">
              ${evolutionCard("1", "Autocomplete", "Sugiere la siguiente línea o función.", "Intellisense, primer Copilot", "opacity-60")}
              <div class="self-center text-scene-border">→</div>
              ${evolutionCard("2", "Chat assistant", "Conversación pregunta-respuesta sobre código.", "ChatGPT, Claude chat", "opacity-75")}
              <div class="self-center text-scene-border">→</div>
              ${evolutionCard("3", "Agentes autónomos", "Planifica, ejecuta y valida tareas completas.", "", "border-scene-accent/60 bg-scene-accent/10")}
            </div>
          </div>
        </div>
      `,
    },

    // ─── Slide 3 — El problema ───────────────────────────────────────
    {
      id: "problema",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-8 w-full max-w-5xl mx-auto">
          <div>
            <p class="text-sm font-mono text-scene-accent tracking-widest uppercase mb-2">01</p>
            <h2 class="text-4xl font-bold text-scene-text">El problema que queremos resolver</h2>
            <p class="text-lg text-scene-muted mt-2">Chatear con un LLM, sin estructura, no escala a un equipo de desarrollo.</p>
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div class="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
              <p class="text-base font-semibold text-red-400 mb-4">Sin harness <span class="text-sm font-normal text-scene-muted">(Chat libre con el LLM)</span></p>
              ${crossItem("Código inconsistente, sin trazabilidad")}
              ${crossItem("Planificación, implementación y QA mezcladas")}
              ${crossItem("Sin gate humano antes de ejecutar")}
              ${crossItem("Contexto se pierde entre sesiones")}
              ${crossItem("Difícil de revisar y auditar en PR")}
            </div>
            <div class="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
              <p class="text-base font-semibold text-green-400 mb-4">Con harness <span class="text-sm font-normal text-scene-muted">(Pipeline estructurado de agentes)</span></p>
              ${checkItem("Roles especializados y predecibles")}
              ${checkItem("Separación clara: planear, codear, validar")}
              ${checkItem("Gates humanos en puntos críticos")}
              ${checkItem("Estado en archivos versionables en git")}
              ${checkItem("Auditable y reproducible en PRs")}
            </div>
          </div>
        </div>
      `,
    },

    // ─── Slide 4 — ¿Qué es un Harness? (FlowScene) ──────────────────
    {
      id: "harness",
      type: "flow",
      title: "¿Qué es un Harness?",
      subtitle: "Usa 'Next step' para ver cada stage del flujo",
      nodes: [
        {
          id: "usuario", type: "solid", position: { x: 480, y: 0 },
          data: { label: "👤  Usuario", bg: "#172554", fg: "#93c5fd", border: "2px solid #3b82f6", tooltip: "Da requests y aprueba gates. El humano mantiene el control en los puntos críticos." },
        },
        {
          id: "orchestrator", type: "solid", position: { x: 455, y: 180 },
          data: { label: "🧠  Orchestrator", bg: "#1e3a5f", fg: "#60a5fa", border: "2.5px solid #3b82f6", tooltip: "Hub central. Recibe el request, clasifica el task, despacha agentes, enforza gates, y devuelve resultados al usuario." },
        },
        {
          id: "planner", type: "solid", position: { x: 80, y: 340 },
          data: { label: "📐  Architect", bg: "#111827", fg: "#f1f5f9", border: "2px solid #475569", tooltip: "Analiza el request, propone arquitectura, genera el plan con criterios de aceptación (01-plan.md)." },
        },
        {
          id: "implementer", type: "solid", position: { x: 440, y: 340 },
          data: { label: "🔨  Implementer", bg: "#111827", fg: "#f1f5f9", border: "2px solid #475569", tooltip: "Escribe el código tarea por tarea según el plan aprobado por el usuario." },
        },
        {
          id: "tester", type: "solid", position: { x: 760, y: 300 },
          data: { label: "🧪  Tester", bg: "#0a1a0a", fg: "#86efac", border: "2px solid #22c55e", tooltip: "Genera y ejecuta tests unitarios para validar la implementación." },
        },
        {
          id: "qa", type: "solid", position: { x: 930, y: 300 },
          data: { label: "✅  QA", bg: "#0a1a0a", fg: "#86efac", border: "2px solid #22c55e", tooltip: "Valida cada criterio de aceptación contra la implementación." },
        },
        {
          id: "security", type: "solid", position: { x: 760, y: 400 },
          data: { label: "🛡️  Security", bg: "#0a1a0a", fg: "#86efac", border: "2px solid #22c55e", tooltip: "Auditoría OWASP/CWE. Se activa en bugs y cuando security-sensitive=true." },
        },
        {
          id: "delivery", type: "solid", position: { x: 930, y: 400 },
          data: { label: "🚀  Delivery", bg: "#0a1a0a", fg: "#86efac", border: "2px solid #22c55e", tooltip: "Documenta, crea branch, commit, abre PR. Captura insight en el Knowledge Graph." },
        },
        {
          id: "workspace", type: "solid", position: { x: 455, y: 520 },
          data: { label: "📁  Workspace", bg: "#14291a", fg: "#86efac", border: "2px solid #166534", tooltip: "Archivos .md versionables donde cada agente deja el resultado de su trabajo. Auditable en git." },
        },
        {
          id: "label-s1", type: "solid", position: { x: 55, y: 200 },
          data: { label: "STAGE 1 · ANALYSIS", bg: "transparent", fg: "#60a5fa", border: "none" },
          selectable: false, draggable: false,
        },
        {
          id: "label-s2", type: "solid", position: { x: 420, y: 270 },
          data: { label: "STAGE 2 · IMPLEMENT", bg: "transparent", fg: "#60a5fa", border: "none" },
          selectable: false, draggable: false,
        },
        {
          id: "label-s3", type: "solid", position: { x: 930, y: 190 },
          data: { label: "STAGE 3 · VERIFY + DELIVER", bg: "transparent", fg: "#22c55e", border: "none" },
          selectable: false, draggable: false,
        },
      ],
      edges: [
        // Usuario ↔ Orchestrator
        { id: "e-user-orch", source: "usuario", sourceHandle: "bottom", target: "orchestrator", targetHandle: "top", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, markerEnd: arrow },
        { id: "e-orch-user", source: "orchestrator", sourceHandle: "top-src", target: "usuario", targetHandle: "bottom-tgt", style: { stroke: "#3b82f6", strokeWidth: 1.5, strokeDasharray: "6 3" }, markerEnd: arrow },
        // Orchestrator → Agents
        { id: "e-orch-planner", source: "orchestrator", target: "planner", markerEnd: arrow, style: { stroke: "#475569", strokeWidth: 2 } },
        { id: "e-orch-impl", source: "orchestrator", target: "implementer", markerEnd: arrow, style: { stroke: "#475569", strokeWidth: 2 } },
        { id: "e-orch-tester", source: "orchestrator", target: "tester", markerEnd: arrow, style: { stroke: "#475569", strokeWidth: 2 } },
        { id: "e-orch-qa", source: "orchestrator", target: "qa", markerEnd: arrow, style: { stroke: "#475569", strokeWidth: 2 } },
        { id: "e-orch-sec", source: "orchestrator", target: "security", markerEnd: arrow, style: { stroke: "#475569", strokeWidth: 2 } },
        { id: "e-orch-del", source: "orchestrator", target: "delivery", markerEnd: arrow, style: { stroke: "#475569", strokeWidth: 2 } },
        // Agents → Workspace
        { id: "e-planner-ws", source: "planner", target: "workspace", markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" }, style: { stroke: "#166534", strokeWidth: 1.5 }, label: "01-plan.md", labelStyle: { fill: "#86efac", fontSize: 10 }, labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 } },
        { id: "e-impl-ws", source: "implementer", sourceHandle: "bottom", target: "workspace", targetHandle: "top", markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" }, style: { stroke: "#166534", strokeWidth: 1.5 }, label: "02-impl.md", labelStyle: { fill: "#86efac", fontSize: 10 }, labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 } },
        { id: "e-tester-ws", source: "tester", target: "workspace", markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" }, style: { stroke: "#166534", strokeWidth: 1.5 } },
        { id: "e-qa-ws", source: "qa", target: "workspace", markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" }, style: { stroke: "#166534", strokeWidth: 1.5 } },
        { id: "e-sec-ws", source: "security", target: "workspace", markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" }, style: { stroke: "#166534", strokeWidth: 1.5 } },
        { id: "e-del-ws", source: "delivery", target: "workspace", markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" }, style: { stroke: "#166534", strokeWidth: 1.5 }, label: "PR + commit", labelStyle: { fill: "#86efac", fontSize: 10 }, labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 } },
      ],
      highlightSteps: [
        // Step 0: Overview — all visible
        ["usuario", "orchestrator", "workspace"],
        // Step 1: Stage 1 — Analysis
        ["usuario", "orchestrator", "planner", "workspace"],
        // Step 2: Stage 2 — Implementation
        ["usuario", "orchestrator", "implementer", "workspace"],
        // Step 3: Stage 3 — Verify + Deliver
        ["usuario", "orchestrator", "tester", "qa", "security", "delivery", "workspace"],
      ],
    },

    // ─── Slide 5 — El workspace documentado (AnimatedScene) ───────────
    {
      id: "workspace",
      type: "animated",
      title: "",
      subtitle: "",
      component: "WorkspaceAnimation",
    },

    // ─── Slide 6 — De Desarrollador Individual a One-Person Squad ─────
    {
      id: "potencia",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-7 w-full max-w-5xl mx-auto">
          <div>
            <p class="text-sm font-mono text-scene-accent tracking-widest uppercase mb-2">04</p>
            <h2 class="text-4xl font-bold text-scene-text">De Desarrollador Individual a <span class="text-scene-accent">One-Person Squad</span></h2>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl border border-scene-border bg-scene-surface/40 p-5 flex items-center gap-5 opacity-60">
              <span class="text-6xl font-bold text-scene-muted shrink-0">+55%</span>
              <div>
                <p class="text-scene-muted font-semibold text-sm">IA Asistida</p>
                <p class="text-scene-muted text-xs mt-1">Autocompletado pasivo. Sugiere líneas, el dev decide todo.</p>
                <p class="text-scene-border text-xs mt-1">Estudio GitHub Copilot</p>
              </div>
            </div>
            <div class="rounded-xl border border-scene-accent/50 bg-scene-accent/10 p-5 flex items-center gap-5">
              <span class="text-6xl font-bold text-scene-accent shrink-0">5x</span>
              <div>
                <p class="text-scene-accent-light font-semibold text-sm">Agentes Autónomos</p>
                <p class="text-scene-muted text-xs mt-1">Un harness de agentes trabajando en paralelo. El dev dirige, no tipea.</p>
                <p class="text-scene-accent/60 text-xs mt-1">Lo que venimos a mostrar</p>
              </div>
            </div>
          </div>

          <div>
            <p class="text-sm font-mono text-scene-muted uppercase tracking-widest mb-3">El rol evoluciona</p>
            <div class="flex flex-col gap-3">
              ${roleEvolution("Escribir cada línea", "Revisor Activo (Code Reviewer)", "El código lo generan los agentes; el humano valida intención y flujo")}
              ${roleEvolution("Resolver bugs básicos", "Diseñar el Auto-Healing", "Los agentes pre-evalúan y corrigen sus propios tests antes de pedir revisión")}
              ${roleEvolution("Implementación mecánica", "Decisiones de alto impacto", "El enfoque se mueve 100% al diseño de arquitectura y topología")}
            </div>
          </div>
        </div>
      `,
    },

    // ─── Slide 8 — Cierre ────────────────────────────────────────────
    {
      id: "cierre",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-6 w-full max-w-3xl mx-auto">
          <div>
            <p class="text-xs font-mono text-scene-accent tracking-widest uppercase mb-1">
              Cierre del demo
            </p>
            <h2 class="text-3xl font-bold text-scene-text">Hasta aquí, el concepto</h2>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl border border-scene-border bg-scene-surface p-5">
              <p class="text-sm font-semibold text-scene-text mb-3">Lo que vimos</p>
              ${checkItem("Qué es el desarrollo agéntico")}
              ${checkItem("Por qué necesitamos un harness")}
              ${checkItem("Cómo se ve un pipeline estructurado")}
              ${checkItem("El workspace como contrato versionado")}
            </div>

            <div class="rounded-xl border border-scene-accent/30 bg-scene-accent/5 p-5">
              <p class="text-sm font-semibold text-scene-accent mb-3">A continuación</p>
              <p class="text-scene-text font-semibold text-sm">Demo en vivo</p>
              <p class="text-scene-muted text-sm mt-2 leading-relaxed">
                Vamos a ejecutar el harness sobre una app simple (Todo API) para ver
                el pipeline corriendo en tiempo real: agentes, workspace, y gates.
              </p>
            </div>
          </div>

          <div class="flex items-center justify-center gap-2 text-scene-muted text-sm border border-scene-border rounded-full px-4 py-1.5 self-center">
            <span>Mario Gutiérrez</span>
            <span class="text-scene-border">·</span>
            <span>Equipo Zippy</span>
          </div>
        </div>
      `,
    },

    // ─── Nuestro sistema real ──────────────────────────────────────────
    {
      id: "nuestro-sistema",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-6 w-full max-w-3xl mx-auto">
          <div>
            <p class="text-xs font-mono text-scene-accent tracking-widest uppercase mb-1">06</p>
            <h2 class="text-3xl font-bold text-scene-text">Nuestro sistema real</h2>
            <p class="text-scene-muted mt-1">Team Harness + Context Harness</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl border border-scene-accent/30 bg-scene-accent/5 p-5">
              <p class="text-xs font-mono text-scene-accent uppercase tracking-widest mb-2">team-harness</p>
              <p class="text-scene-text font-semibold text-sm mb-2">Orquestador de agentes</p>
              <p class="text-scene-muted text-sm leading-relaxed">
                Distribuye roles, enforza gates, y mantiene trazabilidad en cada feature.
                20 agentes especializados · 37 skills · coordinados por un orchestrator central.
              </p>
            </div>
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5">
              <p class="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">context-harness</p>
              <p class="text-scene-text font-semibold text-sm mb-2">Knowledge Graph persistente</p>
              <p class="text-scene-muted text-sm leading-relaxed">
                Captura aprendizajes del equipo y los inyecta como contexto en futuros tasks.
                Memoria semántica que crece con cada delivery.
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-scene-border bg-scene-surface p-4 flex items-center gap-4">
            <span class="text-scene-accent text-2xl shrink-0">⚡</span>
            <p class="text-scene-muted text-sm leading-relaxed">
              Juntos forman un dev-team orquestado: uno estructura el proceso,
              el otro acumula el conocimiento entre sesiones.
            </p>
          </div>
        </div>
      `,
    },

    // ─── Knowledge Graph en acción ─────────────────────────────────────
    {
      id: "vector-db",
      type: "animated",
      title: "",
      subtitle: "",
      component: "VectorDBDemo",
    },

    // ─── Pipeline completo con stages y agentes (FlowScene) ─────────
    {
      id: "pipeline-real",
      type: "flow",
      title: "El pipeline real: stages y agentes",
      subtitle: "3 stages · 20 agentes · 3 gates humanos. Click en nodos o usa 'Next step'.",
      nodes: [
        // ── Stage label nodes (decorative, non-interactive) ───────────
        {
          id: "stage-1-label",
          position: PG(0, -0.7),
          data: { label: "STAGE 1 · ANALYSIS" },
          style: {
            fontSize: "11px",
            fontWeight: 700,
            color: "#60a5fa",
            background: "transparent",
            border: "none",
            padding: "4px 12px",
            letterSpacing: "0.1em",
          },
          selectable: false,
          draggable: false,
        },
        {
          id: "stage-2-label",
          position: PG(3, -0.7),
          data: { label: "STAGE 2 · IMPLEMENTATION" },
          style: {
            fontSize: "11px",
            fontWeight: 700,
            color: "#60a5fa",
            background: "transparent",
            border: "none",
            padding: "4px 12px",
            letterSpacing: "0.1em",
          },
          selectable: false,
          draggable: false,
        },
        {
          id: "stage-3-label",
          position: PG(5, -0.7),
          data: { label: "STAGE 3 · DELIVERY" },
          style: {
            fontSize: "11px",
            fontWeight: 700,
            color: "#60a5fa",
            background: "transparent",
            border: "none",
            padding: "4px 12px",
            letterSpacing: "0.1em",
          },
          selectable: false,
          draggable: false,
        },

        // ── KG Read (above orchestrator, reads context at intake) ────
        {
          id: "kg-read",
          position: PG(0, 1),
          data: {
            label: "KG\nRead Context",
            tooltip:
              "El orchestrator consulta el Knowledge Graph al inicio: busca insights de tasks anteriores y los inyecta como contexto al architect.",
          },
          style: { ...PK, whiteSpace: "pre-line", textAlign: "center" },
        },

        // ── Stage 1 — Analysis (cols 0-1) ────────────────────────────
        {
          id: "orchestrator-intake",
          position: PG(0, 0),
          data: {
            label: "Orchestrator\nIntake + Specify",
            tooltip:
              "Clasifica el task, detecta idioma, consulta el Knowledge Graph, lee CLAUDE.md, construye los criterios de aceptación.",
          },
          style: {
            ...PN,
            whiteSpace: "pre-line",
            textAlign: "center",
          },
        },
        {
          id: "architect",
          position: PG(0, 2),
          data: {
            label: "Architect\nDesign",
            tooltip:
              "Propone la arquitectura, divide en tareas por PR, define AC en formato Given/When/Then.",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "qa-ratify",
          position: PG(0, 3),
          data: {
            label: "QA\nPlan Ratify",
            tooltip:
              "Valida que los criterios de aceptación sean completos y testeables.",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "plan-reviewer",
          position: PG(0, 4),
          data: {
            label: "Plan Reviewer\nAudit",
            tooltip:
              "Audita la forma del plan contra 8 reglas de calidad. Emite pass/concerns/fail.",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "gate-1",
          position: PG(0, 5),
          data: {
            label: "STAGE-GATE-1\nAprobación humana",
            tooltip:
              "STOP obligatorio. El developer revisa el plan completo antes de que se escriba código.",
          },
          style: { ...PG_GATE, whiteSpace: "pre-line", textAlign: "center" },
        },

        // ── Stage 2 — Implementation (cols 2-4) ──────────────────────
        {
          id: "implementer",
          position: PG(2, 2),
          data: {
            label: "Implementer\nCode",
            tooltip:
              "Escribe código tarea por tarea. En bug-fixes opera con scope-discipline (sin refactors tangenciales).",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "tester",
          position: PG(2, 3.3),
          data: {
            label: "Tester\nTests",
            tooltip:
              "Genera y ejecuta tests. Valida que el código funciona correctamente.",
          },
          style: { ...PP, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "qa-validate",
          position: PG(3, 3.3),
          data: {
            label: "QA\nValidate AC",
            tooltip:
              "Valida cada criterio de aceptación contra la implementación. Pass/fail con detalle.",
          },
          style: { ...PP, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "security",
          position: PG(4, 3.3),
          data: {
            label: "Security\nAudit",
            tooltip:
              "Auditoría OWASP/CWE. Se activa siempre en bugs y cuando security-sensitive=true.",
          },
          style: { ...PP, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "acceptance",
          position: PG(3, 4.6),
          data: {
            label: "Acceptance\nGate",
            tooltip:
              "Verifica que todos los AC pasaron. Si falla, el implementer itera (máx 3 intentos).",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "gate-2",
          position: PG(3, 5.7),
          data: {
            label: "STAGE-GATE-2",
            tooltip:
              "STOP entre PRs. Se salta si el developer dio 'approve autonomous' en Gate 1.",
          },
          style: { ...PG_GATE_OPT, whiteSpace: "pre-line", textAlign: "center" },
        },

        // ── Stage 3 — Delivery (cols 5-6) ────────────────────────────
        {
          id: "delivery",
          position: PG(5, 2),
          data: {
            label: "Delivery\nPR + Commit",
            tooltip:
              "Documenta cambios, bumps versión, actualiza CHANGELOG, crea branch, commit, y abre PR.",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "reviewer",
          position: PG(5, 3.3),
          data: {
            label: "Reviewer\nInternal Review",
            tooltip:
              "Review interno del PR. Condicional según tamaño del diff.",
          },
          style: { ...PN, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "kg-save",
          position: PG(5, 4.6),
          data: {
            label: "KG\nSave Insight",
            tooltip:
              "Captura pasiva: persiste un nodo process-insight en el Knowledge Graph con lo aprendido.",
          },
          style: { ...PK, whiteSpace: "pre-line", textAlign: "center" },
        },
        {
          id: "gate-3",
          position: PG(5, 5.7),
          data: {
            label: "STAGE-GATE-3\nShip / Amend / Abort",
            tooltip:
              "STOP final obligatorio. El developer aprueba el PR. Opciones: ship / amend / abort.",
          },
          style: { ...PG_GATE, whiteSpace: "pre-line", textAlign: "center" },
        },
      ],
      edges: [
        // Orchestrator → KG Read
        { id: "e-oi-kg", source: "orchestrator-intake", target: "kg-read", markerEnd: arrow, style: { stroke: "#7c3aed", strokeWidth: 2 } },
        // Stage 1 chain: KG → Architect
        { id: "e-kg-arch", source: "kg-read", target: "architect", markerEnd: arrow },
        { id: "e-arch-qar",   source: "architect",           target: "qa-ratify",       markerEnd: arrow },
        { id: "e-qar-pr",     source: "qa-ratify",           target: "plan-reviewer",   markerEnd: arrow },
        { id: "e-pr-g1",      source: "plan-reviewer",       target: "gate-1",          markerEnd: arrow },
        // Gate 1 → Stage 2
        { id: "e-g1-impl",    source: "gate-1",              target: "implementer",     markerEnd: arrow },
        // Parallel fan-out
        { id: "e-impl-test",  source: "implementer",         target: "tester",          markerEnd: arrow },
        { id: "e-impl-qa",    source: "implementer",         target: "qa-validate",     markerEnd: arrow },
        { id: "e-impl-sec",   source: "implementer",         target: "security",        markerEnd: arrow },
        // Fan-in to acceptance
        { id: "e-test-acc",   source: "tester",              target: "acceptance",      markerEnd: arrow },
        { id: "e-qa-acc",     source: "qa-validate",         target: "acceptance",      markerEnd: arrow },
        { id: "e-sec-acc",    source: "security",            target: "acceptance",      markerEnd: arrow },
        // Acceptance → Gate 2 → Stage 3
        { id: "e-acc-g2",     source: "acceptance",          target: "gate-2",          markerEnd: arrow },
        { id: "e-g2-del",     source: "gate-2",              target: "delivery",        markerEnd: arrow },
        // AC fail loop
        {
          id: "e-acc-impl-loop",
          source: "acceptance",
          target: "implementer",
          label: "AC fail → itera",
          labelStyle: { fill: "#94a3b8", fontSize: 9 },
          labelBgStyle: { fill: "#1e293b" },
          style: { stroke: "#64748b", strokeDasharray: "4 3" },
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        },
        // Stage 3 chain
        { id: "e-del-rev",   source: "delivery",  target: "reviewer", markerEnd: arrow },
        { id: "e-rev-kg",    source: "reviewer",  target: "kg-save",  markerEnd: arrow },
        { id: "e-kg-g3",     source: "kg-save",   target: "gate-3",   markerEnd: arrow },
      ],
      highlightSteps: [
        // Stage 1 — Analysis (includes KG read at intake)
        ["kg-read", "orchestrator-intake", "architect", "qa-ratify", "plan-reviewer", "gate-1"],
        // Stage 2 — Implementation
        ["implementer", "tester", "qa-validate", "security", "acceptance", "gate-2"],
        // Stage 3 — Delivery
        ["delivery", "reviewer", "kg-save", "gate-3"],
      ],
    },

    // ─── Slide 11 — Pipelines disponibles ───────────────────────────
    {
      id: "pipelines",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-5 w-full max-w-3xl mx-auto">
          <div>
            <p class="text-xs font-mono text-scene-accent tracking-widest uppercase mb-1">08</p>
            <h2 class="text-3xl font-bold text-scene-text">Pipelines disponibles</h2>
            <p class="text-scene-muted mt-1">El orchestrator detecta el tipo de task y adapta el pipeline</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            ${pipelineCard(
              "Standard (default)",
              "Feature completa. Architect → Implementer → Tester + QA + Security → Delivery. El pipeline que acabamos de ver.",
              "#3b82f6",
              "#60a5fa",
            )}
            ${pipelineCard(
              "Bug-fix",
              "Corrige un bug. Tier system (1-4) determina profundidad. Regression test obligatorio ANTES de codear.",
              "#f97316",
              "#fb923c",
            )}
            ${pipelineCard(
              "Hotfix",
              "Fix urgente. Salta Phase 1 (sin root-cause analysis). El orchestrator genera un mini-plan inline.",
              "#ef4444",
              "#f87171",
            )}
            ${pipelineCard(
              "Research",
              "Investiga tecnología o approach. Solo el Architect en modo research. Output: 00-research.md.",
              "#a78bfa",
              "#c4b5fd",
            )}
            ${pipelineCard(
              "Docs",
              "Documentación. Architect (research) → Documenter → Diagrammer → QA. Output: páginas Obsidian.",
              "#22c55e",
              "#4ade80",
            )}
            ${pipelineCard(
              "Spike",
              "Prototipo rápido. Prueba una hipótesis técnica. Output: código descartable + aprendizaje.",
              "#eab308",
              "#facc15",
            )}
          </div>
        </div>
      `,
    },

    // ─── Instalación ──────────────────────────────────────────────────
    {
      id: "instalacion",
      type: "slide",
      title: "",
      content: `
        ${animatedBg()}
        <div class="relative z-10 flex flex-col gap-6 w-full max-w-3xl mx-auto">
          <div>
            <p class="text-xs font-mono text-scene-accent tracking-widest uppercase mb-1">09</p>
            <h2 class="text-3xl font-bold text-scene-text">Instalación en 30 segundos</h2>
            <p class="text-scene-muted mt-1">Plugin marketplace. Zero config manual.</p>
          </div>

          <div class="flex flex-col gap-3">
            ${installStep("1", "/plugin marketplace add valianx/team-harness", "Registra el plugin en Claude Code")}
            ${installStep("2", "/plugin install th", "Instala agents, skills, y hooks en ~/.claude/")}
            ${installStep("3", "/th:setup", "Configura MCP servers, workspace mode, y reglas de dispatch")}
          </div>

          <div class="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
            <p class="text-xs font-mono text-green-400 uppercase tracking-widest mb-2">Resultado</p>
            <p class="text-scene-text text-sm">
              20 agentes · 37 skills · hooks de notificación · Knowledge Graph conectado
            </p>
          </div>
        </div>
      `,
    },

    // ─── Cierre final ─────────────────────────────────────────────────
    {
      id: "gracias",
      type: "animated",
      title: "",
      subtitle: "",
      component: "GraciasAnimation",
    },
  ],
};

// ─── HTML fragment helpers ────────────────────────────────────────────────────

function crossItem(text: string): string {
  return `
    <div class="flex items-start gap-3 mb-3">
      <span class="text-red-400 shrink-0 mt-0.5 text-lg">✕</span>
      <span class="text-scene-muted text-base">${text}</span>
    </div>
  `;
}

function checkItem(text: string): string {
  return `
    <div class="flex items-start gap-3 mb-3">
      <span class="text-green-400 shrink-0 mt-0.5 text-lg">✓</span>
      <span class="text-scene-muted text-base">${text}</span>
    </div>
  `;
}

function evolutionCard(
  num: string,
  title: string,
  desc: string,
  example: string,
  extraClass = "",
): string {
  return `
    <div class="flex-1 rounded-xl border border-scene-border bg-scene-surface p-5 ${extraClass}">
      <p class="text-sm font-mono text-scene-accent mb-1">${num}</p>
      <p class="text-scene-text font-semibold text-base">${title}</p>
      <p class="text-scene-muted text-sm mt-1.5">${desc}</p>
      ${example ? `<p class="text-scene-border text-sm mt-1">Ej: ${example}</p>` : ""}
    </div>
  `;
}

function roleEvolution(from: string, to: string, note: string): string {
  return `
    <div class="flex items-center gap-3 rounded-xl border border-scene-border bg-scene-surface p-3">
      <span class="text-scene-muted text-sm line-through shrink-0">${from}</span>
      <span class="text-scene-border">→</span>
      <span class="text-scene-accent-light font-semibold text-sm shrink-0">${to}</span>
      <span class="text-scene-muted text-xs ml-auto text-right max-w-xs">${note}</span>
    </div>
  `;
}

/**
 * Pipeline card for the "Pipelines disponibles" slide.
 * Renders a card with a colored left border and a description.
 */
function pipelineCard(
  name: string,
  desc: string,
  borderColor: string,
  textColor: string,
): string {
  return `
    <div class="rounded-xl border border-scene-border bg-scene-surface p-4 border-l-4" style="border-left-color: ${borderColor}">
      <p class="text-sm font-semibold mb-1" style="color: ${textColor}">${name}</p>
      <p class="text-scene-muted text-xs leading-relaxed">${desc}</p>
    </div>
  `;
}

/**
 * Step card for the "Instalación" slide.
 * Renders a numbered step with a monospaced command and a subtitle.
 */
function installStep(num: string, cmd: string, subtitle: string): string {
  return `
    <div class="flex items-start gap-4 rounded-xl border border-scene-border bg-scene-surface p-4">
      <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
           style="background: #1e3a5f; color: #60a5fa; border: 1.5px solid #3b82f6">
        ${num}
      </div>
      <div>
        <p class="font-mono text-scene-accent text-sm">${cmd}</p>
        <p class="text-scene-muted text-xs mt-1">${subtitle}</p>
      </div>
    </div>
  `;
}

function animatedBg(includeAtom = true): string {
  const stars = [
    "width:2px;height:2px;background:#94a3b8;left:5%;top:12%;animation-duration:4s;animation-delay:0s",
    "width:1px;height:1px;background:#cbd5e1;left:12%;top:35%;animation-duration:6s;animation-delay:1.2s",
    "width:2px;height:2px;background:#60a5fa;left:18%;top:8%;animation-duration:5s;animation-delay:0.5s",
    "width:1px;height:1px;background:#94a3b8;left:25%;top:62%;animation-duration:7s;animation-delay:2s",
    "width:2px;height:2px;background:#cbd5e1;left:32%;top:22%;animation-duration:4.5s;animation-delay:0.8s",
    "width:1px;height:1px;background:#a78bfa;left:40%;top:78%;animation-duration:6.5s;animation-delay:1.5s",
    "width:2px;height:2px;background:#94a3b8;left:48%;top:15%;animation-duration:5.5s;animation-delay:3s",
    "width:1px;height:1px;background:#cbd5e1;left:55%;top:45%;animation-duration:4s;animation-delay:0.3s",
    "width:3px;height:3px;background:#60a5fa;left:62%;top:88%;animation-duration:7s;animation-delay:2.5s",
    "width:1px;height:1px;background:#94a3b8;left:70%;top:30%;animation-duration:5s;animation-delay:1s",
    "width:2px;height:2px;background:#cbd5e1;left:78%;top:55%;animation-duration:6s;animation-delay:0.7s",
    "width:1px;height:1px;background:#a78bfa;left:85%;top:10%;animation-duration:4.5s;animation-delay:2.2s",
    "width:2px;height:2px;background:#94a3b8;left:90%;top:70%;animation-duration:5.5s;animation-delay:1.8s",
    "width:1px;height:1px;background:#cbd5e1;left:95%;top:40%;animation-duration:6.5s;animation-delay:3.5s",
    "width:1px;height:1px;background:#60a5fa;left:8%;top:85%;animation-duration:5s;animation-delay:0.2s",
    "width:2px;height:2px;background:#94a3b8;left:37%;top:52%;animation-duration:7s;animation-delay:1.3s",
    "width:1px;height:1px;background:#cbd5e1;left:52%;top:92%;animation-duration:4s;animation-delay:2.8s",
    "width:1px;height:1px;background:#94a3b8;left:72%;top:82%;animation-duration:6s;animation-delay:0.6s",
    "width:2px;height:2px;background:#a78bfa;left:15%;top:55%;animation-duration:5.5s;animation-delay:3.2s",
    "width:1px;height:1px;background:#cbd5e1;left:82%;top:25%;animation-duration:4.5s;animation-delay:1.7s",
  ];
  const starDivs = stars.map((s) => `<div class="star" style="${s}"></div>`).join("\n      ");
  const atom = includeAtom ? atomLogo() : "";
  return `<div class="slide-bg-animated absolute inset-0">${starDivs}</div>${atom}`;
}

function atomLogo(): string {
  return `
    <div class="absolute bottom-8 right-8 z-10 pointer-events-none" style="width:220px;height:220px">
      <svg viewBox="0 0 200 200" class="w-full h-full" style="overflow:visible">
        <!-- Glow -->
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="50" fill="url(#core-glow)" style="animation:glow-pulse 4s ease-in-out infinite"/>
        <!-- Core -->
        <circle cx="100" cy="100" r="8" fill="#f59e0b" opacity="0.9"/>
        <circle cx="100" cy="100" r="4" fill="#fbbf24"/>
        <!-- Orbit 1 — horizontal ellipse -->
        <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(148,163,184,0.2)" stroke-width="0.8"/>
        <g style="animation:orbit 8s linear infinite;transform-origin:100px 100px">
          <circle cx="170" cy="100" r="4" fill="#94a3b8" opacity="0.8"/>
        </g>
        <!-- Orbit 2 — tilted 60deg -->
        <ellipse cx="100" cy="100" rx="65" ry="28" fill="none" stroke="rgba(148,163,184,0.15)" stroke-width="0.8" transform="rotate(60 100 100)"/>
        <g style="animation:orbit 12s linear infinite;transform-origin:100px 100px;transform:rotate(60deg)">
          <circle cx="165" cy="100" r="3" fill="#818cf8" opacity="0.7"/>
        </g>
        <!-- Orbit 3 — tilted -60deg -->
        <ellipse cx="100" cy="100" rx="75" ry="32" fill="none" stroke="rgba(148,163,184,0.15)" stroke-width="0.8" transform="rotate(-60 100 100)"/>
        <g style="animation:orbit-reverse 10s linear infinite;transform-origin:100px 100px;transform:rotate(-60deg)">
          <circle cx="175" cy="100" r="3.5" fill="#94a3b8" opacity="0.7"/>
        </g>
        <!-- Orbit 4 — vertical-ish -->
        <ellipse cx="100" cy="100" rx="60" ry="25" fill="none" stroke="rgba(148,163,184,0.1)" stroke-width="0.8" stroke-dasharray="4 3" transform="rotate(120 100 100)"/>
        <g style="animation:orbit 15s linear infinite;transform-origin:100px 100px;transform:rotate(120deg)">
          <circle cx="160" cy="100" r="2.5" fill="#818cf8" opacity="0.5"/>
        </g>
        <!-- Orbit 5 — wide dashed -->
        <ellipse cx="100" cy="100" rx="80" ry="35" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="0.8" stroke-dasharray="6 4" transform="rotate(-30 100 100)"/>
        <g style="animation:orbit-reverse 18s linear infinite;transform-origin:100px 100px;transform:rotate(-30deg)">
          <circle cx="180" cy="100" r="3" fill="#94a3b8" opacity="0.5"/>
        </g>
      </svg>
    </div>
  `;
}

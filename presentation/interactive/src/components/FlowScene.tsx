import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeProps,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import type { FlowSceneData } from "../types";

function SolidNode({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const hasTooltip = !!d.tooltip;
  return (
    <div
      style={{
        background: d.bg as string || "#111827",
        color: d.fg as string || "#f1f5f9",
        border: d.border as string || "2px solid #475569",
        borderRadius: "12px",
        padding: "14px 24px",
        fontSize: "15px",
        fontWeight: 600,
        minWidth: "140px",
        textAlign: "center" as const,
        whiteSpace: "pre-line" as const,
        cursor: hasTooltip ? "zoom-in" : "default",
      }}
    >
      <Handle id="top" type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle id="top-src" type="source" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      {data.label as string}
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle id="bottom-tgt" type="target" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

const nodeTypes = { solid: SolidNode };

interface FlowSceneProps {
  scene: FlowSceneData;
}

/**
 * React Flow scene wrapper.
 *
 * Features:
 * - Dark-themed graph with custom node styles
 * - Optional highlight steps: click nodes or press Enter to advance
 *   through an ordered sequence of highlighted node groups
 * - Tooltips on node hover (reads `data.tooltip` from node data)
 * - Animated edges between highlighted nodes
 */
export function FlowScene({ scene }: FlowSceneProps) {
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const hasHighlights = scene.highlightSteps && scene.highlightSteps.length > 0;
  const currentHighlight = hasHighlights
    ? new Set(scene.highlightSteps![highlightIndex] ?? [])
    : new Set<string>();

  const styledNodes: Node[] = useMemo(
    () =>
      scene.nodes.map((node) => ({
        ...node,
        zIndex: 1000,
        className: currentHighlight.has(node.id) ? "highlighted" : "",
        style: {
          ...node.style,
          opacity: hasHighlights && currentHighlight.size > 0 && !currentHighlight.has(node.id) ? 0.4 : 1,
          transition: "opacity 0.3s ease, border-color 0.3s ease",
        },
      })),
    [scene.nodes, currentHighlight, hasHighlights],
  );

  const styledEdges: Edge[] = useMemo(
    () =>
      scene.edges.map((edge) => ({
        ...edge,
        animated: currentHighlight.has(edge.source) && currentHighlight.has(edge.target),
        style: {
          ...edge.style,
          stroke:
            currentHighlight.has(edge.source) && currentHighlight.has(edge.target)
              ? "#3b82f6"
              : "#64748b",
          strokeWidth: 2,
        },
      })),
    [scene.edges, currentHighlight],
  );

  const advanceHighlight = useCallback(() => {
    if (!hasHighlights) return;
    setHighlightIndex((i) => (i + 1) % scene.highlightSteps!.length);
  }, [hasHighlights, scene.highlightSteps]);

  const prevHighlight = useCallback(() => {
    if (!hasHighlights) return;
    setHighlightIndex((i) => (i - 1 + scene.highlightSteps!.length) % scene.highlightSteps!.length);
  }, [hasHighlights, scene.highlightSteps]);

  const onNodeClick: NodeMouseHandler = useCallback(() => {
    advanceHighlight();
  }, [advanceHighlight]);

  const onNodeMouseEnter: NodeMouseHandler = useCallback((_event, node) => {
    setHoveredNode(node.id);
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const tooltipNode = scene.nodes.find((n) => n.id === hoveredNode);
  const tooltipText = tooltipNode?.data?.tooltip as string | undefined;

  return (
    <div className="relative w-full h-full">
      {/* Scene title overlay */}
      <div className="absolute top-14 left-5 z-20">
        <h2 className="text-lg font-semibold text-scene-text">{scene.title}</h2>
        {scene.subtitle && (
          <p className="text-sm text-scene-muted mt-0.5">{scene.subtitle}</p>
        )}
      </div>

      {/* Highlight step indicator */}
      {hasHighlights && (
        <div className="absolute top-14 right-5 z-40 flex items-center gap-2 bg-scene-bg/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-scene-border/30">
          <button
            onClick={prevHighlight}
            className="px-3 py-1.5 text-xs rounded bg-scene-surface text-scene-muted hover:text-scene-text hover:bg-scene-border transition-colors border border-scene-border"
          >
            Prev
          </button>
          <span className="text-xs text-scene-muted font-mono px-1">
            {highlightIndex + 1}/{scene.highlightSteps!.length}
          </span>
          <button
            onClick={advanceHighlight}
            className="px-3 py-1.5 text-xs rounded bg-scene-accent text-white hover:bg-scene-accent-light transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0c0e1a 0%, #08090f 50%, #050507 100%)" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={0} color="transparent" />
      </ReactFlow>

      {/* Tooltip */}
      {tooltipText && hoveredNode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg bg-scene-surface border border-scene-border shadow-xl text-sm text-scene-text max-w-sm animate-fade-in">
          {tooltipText}
        </div>
      )}

      {/* Atom logo */}
      <div className="absolute bottom-8 right-8 z-10 pointer-events-none" style={{ width: 220, height: 220 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="flow-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="50" fill="url(#flow-glow)" style={{ animation: "glow-pulse 4s ease-in-out infinite" }} />
          <circle cx="100" cy="100" r="8" fill="#f59e0b" opacity="0.9" />
          <circle cx="100" cy="100" r="4" fill="#fbbf24" />
          <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="0.8" />
          <ellipse cx="100" cy="100" rx="65" ry="28" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="100" rx="75" ry="32" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" transform="rotate(-60 100 100)" />
          <ellipse cx="100" cy="100" rx="60" ry="25" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="0.8" strokeDasharray="4 3" transform="rotate(120 100 100)" />
          <ellipse cx="100" cy="100" rx="80" ry="35" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.8" strokeDasharray="6 4" transform="rotate(-30 100 100)" />
          <g style={{ animation: "orbit 8s linear infinite", transformOrigin: "100px 100px" }}><circle cx="170" cy="100" r="4" fill="#94a3b8" opacity="0.8" /></g>
          <g style={{ animation: "orbit 12s linear infinite", transformOrigin: "100px 100px", transform: "rotate(60deg)" }}><circle cx="165" cy="100" r="3" fill="#818cf8" opacity="0.7" /></g>
          <g style={{ animation: "orbit-reverse 10s linear infinite", transformOrigin: "100px 100px", transform: "rotate(-60deg)" }}><circle cx="175" cy="100" r="3.5" fill="#94a3b8" opacity="0.7" /></g>
        </svg>
      </div>
    </div>
  );
}

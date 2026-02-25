"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
  Handle,
  BackgroundVariant,
  MarkerType,
  useNodesState,
  useEdgesState,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ─── Custom Node Types ─── */

function ResourceNode({
  data,
}: {
  data: { label: string; type: string; color: string };
}) {
  return (
    <div
      className="relative px-5 py-3 rounded-xl border-2 shadow-lg min-w-[150px] text-center backdrop-blur-sm"
      style={{
        borderColor: data.color,
        background: `${data.color}12`,
        boxShadow: `0 4px 24px ${data.color}18`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="top"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="bottom"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="right"
      />
      {/* Also allow source from top and target from bottom for reverse edges */}
      <Handle
        type="source"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="top-src"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="bottom-tgt"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="right-tgt"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="left-src"
      />
      <div
        className="text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{ color: data.color, opacity: 0.85 }}
      >
        {data.type}
      </div>
      <div className="text-sm font-semibold text-foreground">{data.label}</div>
    </div>
  );
}

function SearchResultNode({ data }: { data: { label: string } }) {
  return (
    <div className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-teal text-white text-sm font-bold shadow-xl min-w-[170px] text-center">
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="bottom"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="top"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="left-src"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !border-0 !w-0 !h-0"
        id="right-src"
      />
      {data.label}
    </div>
  );
}

function LabelNode({
  data,
}: {
  data: { label: string; color: string };
}) {
  return (
    <div
      className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
      style={{
        borderColor: data.color,
        color: data.color,
        background: `${data.color}10`,
      }}
    >
      {data.label}
    </div>
  );
}

const nodeTypes = {
  resource: ResourceNode,
  searchResult: SearchResultNode,
  label: LabelNode,
};

/* ─── shared edge helpers ─── */
const C = {
  purple: "#7133AE",
  teal: "#38B8B3",
  revinclude: "#8E56CD",
  iterate: "#61D7CF",
};

function mkEdge(
  id: string,
  source: string,
  target: string,
  color: string,
  opts?: Partial<Edge> & { label?: string },
): Edge {
  return {
    id,
    source,
    target,
    type: "bezier",
    animated: true,
    style: { stroke: color, strokeWidth: 2, strokeDasharray: "6 3" },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 12, height: 12 },
    ...(opts?.label
      ? {
          label: opts.label,
          labelStyle: { fill: color, fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: "transparent" },
        }
      : {}),
    ...opts,
  } as Edge;
}

/* ─────────────────────────────────────────────────
   1 · _include & _revinclude Diagram
   Compact layout — all coords within 480×380
   Row A  y=0     Provenance×3
   Row B  y=120   Search Results pill (centred)
   Row C  y=220   Observation×3 (matches)
   Row D  y=340   Patient×2 + labels
   ──────────────────────────────────────────────── */
const IX = [20, 180, 340]; // 3-column x (160px gap)

const includeNodes: Node[] = [
  // Row A — Provenances (_revinclude)
  { id: "prov1", type: "resource", position: { x: IX[0], y: 0 }, data: { label: "Provenance/1", type: "RevInclude", color: C.revinclude } },
  { id: "prov2", type: "resource", position: { x: IX[1], y: 0 }, data: { label: "Provenance/2", type: "RevInclude", color: C.revinclude } },
  { id: "prov3", type: "resource", position: { x: IX[2], y: 0 }, data: { label: "Provenance/3", type: "RevInclude", color: C.revinclude } },
  // Row B — Search Results
  { id: "search-label", type: "searchResult", position: { x: 155, y: 120 }, data: { label: "Search Results" } },
  // Row C — Observations
  { id: "obs1", type: "resource", position: { x: IX[0], y: 230 }, data: { label: "Observation/1", type: "Match", color: C.purple } },
  { id: "obs2", type: "resource", position: { x: IX[1], y: 230 }, data: { label: "Observation/2", type: "Match", color: C.purple } },
  { id: "obs3", type: "resource", position: { x: IX[2], y: 230 }, data: { label: "Observation/3", type: "Match", color: C.purple } },
  // Row D — Patients
  { id: "pt1", type: "resource", position: { x: 80, y: 360 }, data: { label: "Patient/1", type: "Include", color: C.teal } },
  { id: "pt2", type: "resource", position: { x: 300, y: 360 }, data: { label: "Patient/2", type: "Include", color: C.teal } },
  // Labels
  { id: "rev-label", type: "label", position: { x: -80, y: 15 }, data: { label: "_revinclude", color: C.revinclude } },
  { id: "inc-label", type: "label", position: { x: -60, y: 375 }, data: { label: "_include", color: C.teal } },
];

const includeEdges: Edge[] = [
  // Search → Observations ↓
  mkEdge("s-o1", "search-label", "obs1", C.purple, { sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("s-o2", "search-label", "obs2", C.purple, { sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("s-o3", "search-label", "obs3", C.purple, { sourceHandle: "bottom", targetHandle: "top" }),
  // Provenances → Observations ↓
  mkEdge("pv1-o1", "prov1", "obs1", C.revinclude, { label: "target", sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("pv2-o2", "prov2", "obs2", C.revinclude, { label: "target", sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("pv3-o3", "prov3", "obs3", C.revinclude, { label: "target", sourceHandle: "bottom", targetHandle: "top" }),
  // Observations → Patients ↓
  mkEdge("o1-p1", "obs1", "pt1", C.teal, { label: "patient", sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("o2-p1", "obs2", "pt1", C.teal, { label: "patient", sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("o3-p2", "obs3", "pt2", C.teal, { label: "patient", sourceHandle: "bottom", targetHandle: "top" }),
];

/* ─────────────────────────────────────────────────
   2 · :iterate Modifier Diagram  (horizontal L→R)
   All within 420×60
   ──────────────────────────────────────────────── */

const iterateNodes: Node[] = [
  { id: "obs-it", type: "resource", position: { x: 0, y: 0 }, data: { label: "Observation/1", type: "Match", color: C.purple } },
  { id: "pt-it", type: "resource", position: { x: 200, y: 0 }, data: { label: "Patient/1", type: "Include", color: C.teal } },
  { id: "pract-it", type: "resource", position: { x: 400, y: 0 }, data: { label: "Practitioner/1", type: "Include:iterate", color: C.iterate } },
];

const iterateEdges: Edge[] = [
  mkEdge("it-1", "obs-it", "pt-it", C.teal, {
    label: "_include patient",
    sourceHandle: "right",
    targetHandle: "left",
  }),
  mkEdge("it-2", "pt-it", "pract-it", C.iterate, {
    label: "_include:iterate GP",
    sourceHandle: "right",
    targetHandle: "left",
  }),
];

/* ─────────────────────────────────────────────────
   3 · Forward Chaining  (two horizontal rows)
   All within 450×170
   ──────────────────────────────────────────────── */

const chainNodes: Node[] = [
  // Row 1
  { id: "ch-obs", type: "resource", position: { x: 0, y: 0 }, data: { label: "Observation", type: "Search Target", color: C.purple } },
  { id: "ch-pt", type: "resource", position: { x: 240, y: 0 }, data: { label: "Patient", type: "Chained", color: C.teal } },
  // Row 2
  { id: "ch-enc", type: "resource", position: { x: 0, y: 120 }, data: { label: "Observation", type: "Search Target", color: C.purple } },
  { id: "ch-enc2", type: "resource", position: { x: 210, y: 120 }, data: { label: "Encounter", type: "Chained", color: C.teal } },
  { id: "ch-org", type: "resource", position: { x: 410, y: 120 }, data: { label: "Organization", type: "Deep Chain", color: C.iterate } },
];

const chainEdges: Edge[] = [
  mkEdge("ce-1", "ch-obs", "ch-pt", C.teal, {
    label: "patient.name=homer",
    sourceHandle: "right",
    targetHandle: "left",
  }),
  mkEdge("ce-2", "ch-enc", "ch-enc2", C.teal, {
    label: "encounter",
    sourceHandle: "right",
    targetHandle: "left",
  }),
  mkEdge("ce-3", "ch-enc2", "ch-org", C.iterate, {
    label: "service-provider.name",
    sourceHandle: "right",
    targetHandle: "left",
  }),
];

/* ─────────────────────────────────────────────────
   4 · Reverse Chaining (_has)
   Compact V-shape within 400×200
   Patient top-centre, Obs bottom-left, DR bottom-right
   ──────────────────────────────────────────────── */

const revChainNodes: Node[] = [
  { id: "rc-pt", type: "resource", position: { x: 140, y: 0 }, data: { label: "Patient", type: "Search Target", color: C.purple } },
  { id: "rc-obs", type: "resource", position: { x: 0, y: 140 }, data: { label: "Observation", type: "_has", color: C.teal } },
  { id: "rc-dr", type: "resource", position: { x: 280, y: 140 }, data: { label: "DiagnosticReport", type: "_has", color: C.revinclude } },
];

const revChainEdges: Edge[] = [
  // Observation.subject → Patient  (arrow points up ↑)
  mkEdge("rce-1", "rc-obs", "rc-pt", C.teal, {
    label: "subject",
    sourceHandle: "top-src",
    targetHandle: "bottom-tgt",
  }),
  // DiagnosticReport.subject → Patient (arrow points up ↑)
  mkEdge("rce-2", "rc-dr", "rc-pt", C.revinclude, {
    label: "subject",
    sourceHandle: "top-src",
    targetHandle: "bottom-tgt",
  }),
];

/* ─────────────────────────────────────────────────
   5 · GraphQL Query Flow
   Compact within 460×300
   ──────────────────────────────────────────────── */

const graphqlNodes: Node[] = [
  { id: "gql-client", type: "searchResult", position: { x: 155, y: 0 }, data: { label: "GraphQL Query" } },
  { id: "gql-pt", type: "resource", position: { x: 0, y: 130 }, data: { label: "Patient", type: "Query", color: C.purple } },
  { id: "gql-obs", type: "resource", position: { x: 170, y: 130 }, data: { label: "Observation", type: "Mutation", color: C.teal } },
  { id: "gql-enc", type: "resource", position: { x: 340, y: 130 }, data: { label: "Encounter", type: "Query", color: C.purple } },
  { id: "gql-res", type: "resource", position: { x: 150, y: 270 }, data: { label: "JSON Response", type: "Result", color: C.iterate } },
];

const graphqlEdges: Edge[] = [
  // Query → Resources ↓
  mkEdge("ge-1", "gql-client", "gql-pt", C.purple, { sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("ge-2", "gql-client", "gql-obs", C.teal, { sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("ge-3", "gql-client", "gql-enc", C.purple, { sourceHandle: "bottom", targetHandle: "top" }),
  // Resources → JSON ↓
  mkEdge("ge-4", "gql-pt", "gql-res", C.iterate, { sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("ge-5", "gql-obs", "gql-res", C.iterate, { sourceHandle: "bottom", targetHandle: "top" }),
  mkEdge("ge-6", "gql-enc", "gql-res", C.iterate, { sourceHandle: "bottom", targetHandle: "top" }),
];

/* ─── Exported Diagram Component ─── */

type DiagramType = "include" | "iterate" | "chain" | "revchain" | "graphql";

const diagramData: Record<
  DiagramType,
  { nodes: Node[]; edges: Edge[]; height: number }
> = {
  include: { nodes: includeNodes, edges: includeEdges, height: 520 },
  iterate: { nodes: iterateNodes, edges: iterateEdges, height: 120 },
  chain: { nodes: chainNodes, edges: chainEdges, height: 280 },
  revchain: { nodes: revChainNodes, edges: revChainEdges, height: 280 },
  graphql: { nodes: graphqlNodes, edges: graphqlEdges, height: 420 },
};

export function FlowDiagram({
  type,
  title,
}: {
  type: DiagramType;
  title?: string;
}) {
  const { nodes: initialNodes, edges: initialEdges, height } = diagramData[type];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setRfInstance(instance);
      setTimeout(() => instance.fitView({ padding: 0.35 }), 100);
    },
    [],
  );

  const handleFitView = useCallback(() => {
    rfInstance?.fitView({ padding: 0.35, duration: 300 });
  }, [rfInstance]);

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => rfInstance?.fitView({ padding: 0.35, duration: 300 }), 50);
  }, [rfInstance, initialNodes, initialEdges, setNodes, setEdges]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="group/flow my-6 rounded-2xl border border-border/50 dark:border-brand-purple/10 overflow-hidden bg-muted/20 dark:bg-white/[0.02] backdrop-blur-sm">
      {title && (
        <div className="px-5 py-3 border-b border-border/50 dark:border-brand-purple/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-brand-purple to-brand-teal" />
          <span className="text-xs font-semibold text-foreground font-[family-name:var(--font-poppins)]">
            {title}
          </span>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-1 px-3 py-1.5 border-b border-border/30 dark:border-brand-purple/5 bg-muted/30 dark:bg-white/[0.01]">
        <span className="text-[10px] text-muted-foreground mr-auto">Drag nodes &middot; Scroll to zoom &middot; Click &amp; drag to pan</span>
        <button
          onClick={handleFitView}
          className="px-2 py-1 rounded-md text-[10px] font-medium bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple dark:text-brand-purple-light transition-colors"
        >
          Fit View
        </button>
        <button
          onClick={handleReset}
          className="px-2 py-1 rounded-md text-[10px] font-medium bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
        >
          Reset
        </button>
      </div>
      <div style={{ height }} className="w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={onInit}
          proOptions={proOptions}
          fitView
          fitViewOptions={{ padding: 0.35 }}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          preventScrolling={false}
          minZoom={0.3}
          maxZoom={2}
          snapToGrid
          snapGrid={[10, 10]}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            className="opacity-30"
          />
          <Controls
            showInteractive={false}
            className="!bg-background/80 !backdrop-blur-sm !border-border/50 !shadow-lg !rounded-xl [&>button]:!bg-transparent [&>button]:!border-border/30 [&>button:hover]:!bg-brand-purple/10 [&>button]:!rounded-lg [&>button]:!w-7 [&>button]:!h-7 [&>button>svg]:!fill-foreground"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

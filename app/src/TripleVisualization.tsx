import type { Quad } from '@rdfjs/types';
import { useMemo } from 'react';
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';

interface VizNode {
  id: string;
  x: number;
  y: number;
}

interface VizEdge {
  source: VizNode;
  target: VizNode;
  label: string;
  triple: Quad;
}

interface TripleVisualizationProps {
  triples: Quad[];
  onTripleClick?: (triple: Quad) => void;
  focusNode?: string;
}

export default function TripleVisualization({
  triples,
  onTripleClick,
  focusNode,
}: TripleVisualizationProps) {
  const width = 600;
  const height = 400;

  const { nodes, edges } = useMemo<{ nodes: VizNode[]; edges: VizEdge[] }>(() => {
    const nodeIds = Array.from(
      new Set(triples.flatMap((t) => [t.subject.value, t.object.value]))
    );
    const nodes: VizNode[] = nodeIds.map((id) => ({
      id,
      x: width / 2,
      y: height / 2,
    }));
    const edges = triples.map((t) => ({
      source: t.subject.value,
      target: t.object.value,
      label: t.predicate.value,
      triple: t,
    }));

    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink(edges)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(width / 2, height / 2))
      .stop();

    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    const positionedEdges: VizEdge[] = edges.map((e) => ({
      ...e,
      source: e.source as unknown as VizNode,
      target: e.target as unknown as VizNode,
    }));

    return { nodes, edges: positionedEdges };
  }, [triples]);

  return (
    <div>
      <h2>Triple Visualization</h2>
      <svg width={width} height={height} data-testid="triple-visualization">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            fill="black"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        {edges.map((e, i) => (
          <g
            key={i}
            className="triple-edge"
            data-testid={`triple-edge-${i}`}
            onClick={() => onTripleClick?.(e.triple)}
          >
            <line
              x1={e.source.x}
              y1={e.source.y}
              x2={e.target.x}
              y2={e.target.y}
              stroke="black"
              markerEnd="url(#arrowhead)"
            />
            <text
              x={(e.source.x + e.target.x) / 2}
              y={(e.source.y + e.target.y) / 2 - 5}
              textAnchor="middle"
              fontSize="10"
            >
              {e.label}
            </text>
          </g>
        ))}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={20}
              fill={n.id === focusNode ? 'yellow' : 'white'}
              stroke="black"
            />
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
            >
              {n.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

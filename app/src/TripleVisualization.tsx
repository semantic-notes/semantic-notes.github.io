import type { Quad } from '@rdfjs/types';

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
  const nodeIds = Array.from(
    new Set(triples.flatMap((t) => [t.subject.value, t.object.value]))
  );
  const nodes = nodeIds.map((id, idx) => ({
    id,
    x: 100 + (idx % 5) * 150,
    y: 100 + Math.floor(idx / 5) * 100,
  }));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edges = triples.map((t) => ({
    source: nodeMap.get(t.subject.value)!,
    target: nodeMap.get(t.object.value)!,
    label: t.predicate.value,
    triple: t,
  }));
  const width = Math.min(5, nodeIds.length) * 150 + 100;
  const height = Math.ceil(nodeIds.length / 5) * 100 + 100;

  return (
    <div>
      <h2>Triple Visualization</h2>
      <svg width={width} height={height} data-testid="triple-visualization">
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

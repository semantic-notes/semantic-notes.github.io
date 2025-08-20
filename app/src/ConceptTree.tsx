import { useEffect, useState } from 'react';
import { Store } from 'n3';
import type { Quad } from '@rdfjs/types';
import { QueryEngine } from '@comunica/query-sparql';

interface ConceptTreeProps {
  triples: Quad[];
  onSelect?: (iri: string) => void;
}

interface Tree {
  [parent: string]: string[];
}

export default function ConceptTree({ triples, onSelect }: ConceptTreeProps) {
  const [tree, setTree] = useState<Tree>({});

  useEffect(() => {
    const build = async () => {
      if (triples.length === 0) {
        setTree({});
        return;
      }
      const store = new Store(triples);
      const engine = new QueryEngine();
      const query = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT ?child ?parent WHERE {
          ?child skos:broader ?parent .
        }`;
      try {
        const result = await engine.queryBindings(query, { sources: [store] });
        const bindings = await result.toArray();
        const children: Tree = {};
        for (const b of bindings) {
          const child = b.get('child')!.value;
          const parent = b.get('parent')!.value;
          if (!children[parent]) children[parent] = [];
          children[parent].push(child);
          if (!children[child]) children[child] = [];
        }
        setTree(children);
      } catch (err) {
        console.error(err);
      }
    };
    build();
  }, [triples]);

  const roots = Object.keys(tree).filter(
    (iri) => !Object.values(tree).some((kids) => kids.includes(iri))
  );

  const renderNode = (iri: string) => (
    <li key={iri}>
      <button type="button" onClick={() => onSelect?.(iri)}>
        {iri}
      </button>
      {tree[iri] && tree[iri].length > 0 && (
        <ul>
          {tree[iri].map((c) => renderNode(c))}
        </ul>
      )}
    </li>
  );

  if (roots.length === 0) return null;

  return (
    <div data-testid="concept-tree">
      <h2>Concepts</h2>
      <ul>
        {roots.map((r) => renderNode(r))}
      </ul>
    </div>
  );
}


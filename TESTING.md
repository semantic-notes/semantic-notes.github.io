# Testing & Validation

Semantic Notes uses multiple layers of testing to protect against regressions:

1. **Unit tests** — implemented with Vitest. These cover utilities such as namespace rewriting, RDF store helpers and React components.
2. **SHACL validation** — the script in `scripts/run-shacl.mjs` loads the ontology and runs SHACL validation against the shapes defined in `content/shapes/`. This catches missing labels, wrong ranges and other schema violations.
3. **SPARQL invariants** — ASK queries in `scripts/invariants.spec.sparql` specify logical invariants that must always hold (e.g. every OWL class has a linked SKOS concept). The script `scripts/run-invariants.mjs` executes these queries and fails if any return false.
4. **Golden inference tests** (optional) — when rule packs are introduced, input datasets can be checked against expected inferred triples.

All of the above run via `pnpm test` and are executed in continuous integration. Pull requests are blocked if any checks fail.

## Example invariant

This ASK query ensures that every OWL class is associated with a SKOS concept via `ex:denotesConcept`:

```sparql
ASK WHERE {
  FILTER NOT EXISTS {
    ?c a <http://www.w3.org/2002/07/owl#Class> .
    FILTER NOT EXISTS { ?c <https://w3id.org/biosyncare/ont#denotesConcept> ?cc . }
  }
}
```

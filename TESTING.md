# Testing & Validation

Semantic Notes uses multiple layers of testing to protect against regressions:

1. **Unit tests** — implemented with Vitest. These cover utilities such as namespace rewriting, RDF store helpers and React components.
2. **SHACL validation** — the script in `scripts/run-shacl.mjs` loads the ontology and runs SHACL validation against the shapes defined in `content/shapes/`. This catches missing labels, wrong ranges and other schema violations.
3. **SPARQL invariants** — ASK queries in `scripts/invariants.spec.sparql` specify logical invariants that must always hold (e.g. every OWL class has a linked SKOS concept). The script `scripts/run-invariants.mjs` executes these queries and fails if any return false.
4. **Golden inference tests** (optional) — when rule packs are introduced, input datasets can be checked against expected inferred triples.

All of the above run via `pnpm test` and are executed in continuous integration. Pull requests are blocked if any checks fail.

## Running checks directly

To run individual layers without the full test suite:

- `node scripts/run-shacl.mjs` — validate the RDF data in `content/` against SHACL shapes in `content/shapes/`.
- `node scripts/run-invariants.mjs` — execute SPARQL ASK queries from `scripts/invariants.spec.sparql` (or files passed as arguments) and report any that return `false`.



## New feature checklist

When introducing new functionality, ensure:

- [ ] Unit tests cover the feature.
- [ ] SHACL shapes validate affected data.
- [ ] SPARQL invariants capture expected logical constraints.

Automation scripts in [`scripts/`](scripts/) can help run these checks consistently.

## Example invariants

### Dual IRIs remain synchronized

```sparql
ASK WHERE {
  FILTER NOT EXISTS {
    ?c a <http://www.w3.org/2002/07/owl#Class> .
    FILTER NOT EXISTS {
      ?c <https://w3id.org/biosyncare/ont#denotesConcept> ?cc .
      ?cc <http://www.w3.org/2004/02/skos/core#exactMatch> ?c .
    }
  }
}
```

### Note attachments are complete

```sparql
ASK WHERE {
  FILTER NOT EXISTS {
    ?ann a <http://www.w3.org/ns/oa#Annotation> .
    FILTER (
      ! EXISTS { ?ann <http://www.w3.org/ns/oa#hasTarget> ?t } ||
      ! EXISTS { ?ann <http://www.w3.org/ns/oa#hasBody> ?b }
    )
  }
}
```

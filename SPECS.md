# Specifications

## Functional

- Create/edit OWL classes, properties and individuals; build restrictions (some, only, min/max/qualified cardinality).
- Mirror SKOS concepts for each OWL class (dual IRIs) and link them via `ex:denotesConcept` and `skos:exactMatch`.
- Add annotations through RDF triples using dedicated annotation properties.
- Import/export TriG datasets as whole or per-graph; exports include a manifest recording each named graph’s IRI, type, and checksum. `scripts/import-dataset.ts` validates and merges data while enforcing SHACL and SPARQL invariants.
- AI assistance (local-first) provides label suggestions, natural language to SPARQL drafts and mapping hints.
- The home page shows all existing notes with both an RDF graph visualization and a
  tree view for navigation, and includes a form for inserting new notes.

## Non-functional

- Serverless PWA compiled with Vite; runs entirely in the browser; offline-first with Firestore/Storage sync.
- SPARQL queries executed client-side via Comunica; validation via SHACL.
- Mobile-first UI with command palette and editable entity sheets.
- Security via Firebase Auth and App Check; per-workspace access control rules in Firestore and Storage.

> **Note**: The base IRI is configurable. See the [README](README.md#base-iri)
> for setting `BASE_IRI` and choosing a stable prefix. The
> [Modeling&nbsp;Guide](MODELING_GUIDE.md#changing-the-base-iri) details the
> namespace rewrite workflow and redirect setup.

## Data layout

- **Ontology**: `content/ontology/*.trig` contains OWL classes, properties and individuals.
- **SKOS**: `content/skos/*.trig` contains corresponding SKOS concepts and taxonomy.
- **Shapes**: `content/shapes/*.ttl` contains SHACL node and property shapes for validation.
- **Rules**: `content/rules/*.n3` contains custom inference rules (EYE or Notation3).
- **Contexts**: `content/contexts/*.jsonld` contains generated JSON-LD contexts.

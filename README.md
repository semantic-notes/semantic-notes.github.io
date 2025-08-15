# Semantic Notes (OWL/SKOS · PWA · Firebase)

Semantic, AI‑assisted note‑taking for ontologies and vocabularies.

This project is a proof‑of‑concept for a client‑side web application that lets you
create and manage ontologies and vocabularies using OWL and SKOS. Notes are
stored as Web Annotations and attached directly to classes, properties and
individuals. A pluggable reasoning layer provides basic RDFS/SHACL checks and
rule‑based suggestions, and the user can opt into richer OWL RL inference. A
Firebase backend offers synchronization and offline persistence, while the
application is deployed as a static Progressive Web App via GitHub Pages.

## Quickstart
```bash
pnpm install
cp .env.example .env          # add your Firebase configuration
pnpm dev                      # runs Vite dev server
pnpm test                     # runs unit tests, SHACL validation and SPARQL invariants
pnpm run build                # produces static assets into `dist/`
```

## Repository layout

| Path | Purpose |
|------|---------|
| `app/` | React + TypeScript PWA (Vite) |
| `content/ontology/` | OWL classes/properties (TriG/TTL) |
| `content/skos/` | SKOS concepts (TriG/TTL) |
| `content/shapes/` | SHACL shapes |
| `content/rules/` | Custom reasoning rules (N3) |
| `content/notes/` | Markdown notes with embedded Turtle |
| `scripts/` | Build/validation helpers |
| `tests/` | Vitest tests and SPARQL invariants |

For more information see `SPECS.md`, `MODELING_GUIDE.md` and `AI_DEV.md`.

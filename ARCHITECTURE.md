# Architecture

Semantic Notes is organized into three main layers:

1. **Frontend (PWA)** — Located in the `app/` folder. A React application built with Vite and TypeScript provides the user interface. Core modules include:
   - `src/index.tsx` and `src/App.tsx`: entry point and root component.
   - `src/lib/`: utilities for RDF storage, SPARQL querying, SHACL validation and reasoning.
   - `src/components/`: reusable UI pieces such as Entity sheets, Restriction builders and Note editors.

2. **Semantic data** — Located in the `content/` folder. This folder contains the authoritative ontology files and related artefacts:
   - `ontology/`: OWL classes, properties and restrictions.
   - `skos/`: SKOS concepts that mirror the classes.
   - `shapes/`: SHACL shapes used to validate the data.
   - `rules/`: rule packs for inference and suggestions.

3. **Tooling** — Located in the `scripts/` and `tests/` folders. These contain scripts for dataset export/import, context generation and automated tests. Continuous integration is configured via GitHub Actions in `.github/workflows/`.

## Reasoning and validation

- Lightweight RDFS reasoning runs in the browser.
- Optional OWL 2 RL materialization via HyLAR.
- Custom EYE rule packs execute client-side.
- No server-side reasoning.

## Scripts and automation

The following scripts run in CI and locally:

- `scripts/export-dataset.ts`
- `scripts/import-dataset.ts`
- `scripts/build-contexts.ts`
- `scripts/rewriteNamespace.ts`
- `scripts/run-shacl.mjs`
- `scripts/run-invariants.mjs`

Refer to `MODELING_GUIDE.md` for modeling conventions and `AI_DEV.md` for AI assistance policy.

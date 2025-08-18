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

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   - Create a Firebase project and enable Firestore and Storage.
   - In *Project settings → General*, register a web app and copy the configuration values into `.env` (`VITE_FIREBASE_*`).
   - Set `BASE_IRI` to the namespace you want for minted IRIs (see [Base IRI](#base-iri)).

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Run tests**

   ```bash
   pnpm test
   ```

5. **Build static assets**

   ```bash
   pnpm run build
   ```

## Base IRI

Administrators can configure the namespace used when minting new IRIs via the
`BASE_IRI` environment variable. Add `BASE_IRI` to your `.env` file or hosting
configuration:

```bash
BASE_IRI="https://example.org/iri#"
```

If unset, the application falls back to `https://{app-url}/iri#`, where
`{app-url}` is the deployed origin. For long‑term stability, prefer a
`https://w3id.org/` prefix that redirects to your deployment; this decouples the
published IRIs from the underlying domain and eases future migrations.

## Repository layout

Some directories may contain placeholder implementations; features are under active development.

| Path | Purpose |
|------|---------|
| `app/` | React + TypeScript PWA (frontend) |
| `content/ontology/` | OWL classes, properties and individuals (TriG/TTL) |
| `content/skos/` | SKOS concepts and taxonomy (TriG/TTL) |
| `content/shapes/` | SHACL shapes used for validation |
| `content/rules/` | Rule packs for inference and suggestions (N3/EYE) |
| `content/notes/` | Markdown notes with embedded Turtle |
| `scripts/` | Build and validation helpers (dataset import/export, context generation, namespace rewrite, SHACL & SPARQL checks) |
| `tests/` | Vitest tests, SHACL validation and SPARQL invariants |
| `docs/` | Documentation and ADRs |

For more information see `SPECS.md`, `MODELING_GUIDE.md`, `ARCHITECTURE.md`, `AI_DEV.md`, `TESTING.md` and `AGENTS.md`.

This project is licensed under the [MIT License](LICENSE).


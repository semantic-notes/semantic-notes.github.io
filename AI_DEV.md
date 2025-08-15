# AI Development Policy

## Default mode: Local-first

- Use on-device models for suggestions, such as generating labels, drafting SPARQL queries from natural language and proposing mappings. These models run in the browser via WebAssembly/WebGPU.
- Do not automatically commit AI-generated changes. All suggestions must be validated via SHACL, pass tests and be confirmed by a user before being saved.

## Cloud APIs (optional)

Cloud providers such as OpenAI and Anthropic may be enabled per workspace when needed. When enabled:

- Specify a daily token budget to control cost.
- Log provenance for each AI-generated change, including the model name, prompt hash and timestamp.
- Never send personal or sensitive data; all ontology data is considered sensitive.

## Guardrails for Copilot/LLMs

When using GitHub Copilot or other LLMs for code generation:

- Do **not** modify files outside intended module boundaries. Respect the architecture defined in `ARCHITECTURE.md`.
- When adding a class or property, update both the OWL file (`content/ontology/`) and the corresponding SKOS file (`content/skos/`). Update SHACL shapes if constraints change.
- Always run tests (`pnpm test`) locally before opening a pull request.

# Agent Guidelines

Follow these rules when working on this repository:

- **Respect dual IRIs**: preserve both canonical and alternate IRIs when editing.
- **Keep OWL and SKOS in sync**: update parallel ontology representations together.
- **Run `pnpm test` before submitting pull requests**.
- **Avoid cross-module edits**: confine changes to a single module at a time.
- **Cast form values to literal types**: when updating React state from form inputs, cast `e.target.value` to the expected literal union type (e.g. `as NoteTarget`) to prevent TypeScript build errors.
- **Review [SPECS.md](SPECS.md) and [TESTING.md](TESTING.md)**: avoid removing existing features or invariants; coordinate with maintainers if a feature must be deprecated.

Quick references:
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [MODELING_GUIDE.md](MODELING_GUIDE.md)
- [TESTING.md](TESTING.md)


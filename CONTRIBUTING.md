# Contributing

Thank you for your interest in contributing to Semantic Notes! Contributions are welcome from anyone.

## Workflow

1. **Fork** the repository and create a new branch for your work. Use the prefix `feat/` for new features, `fix/` for bug fixes and `docs/` for documentation.
2. **Make your changes**. Follow the modeling guidelines in `MODELING_GUIDE.md` and update both OWL and SKOS files where appropriate.
3. **Add tests**. If you add or change behavior, include corresponding unit tests, SHACL shapes and SPARQL invariants.
4. **Run tests** locally with `pnpm test`. Ensure all checks pass.
5. **Update documentation**. If you add a new feature or change existing behavior, update the relevant sections in the documentation.
6. **Open a pull request**. Use Conventional Commit messages (`feat:`, `fix:`, `docs:` etc.) and fill out the PR template. Explain what you’ve done and why.

## Pull request checklist

- [ ] Updated OWL and SKOS files (dual IRIs).
- [ ] Updated SHACL shapes if constraints changed.
- [ ] Added or updated tests (unit, invariants).
- [ ] Updated documentation (README/SPECS/MODEL/ARCH).

Please remember to be respectful and constructive in all interactions. Together we can build a powerful and user-friendly semantic note-taking tool!

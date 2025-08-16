# Security Policy

## Overview

Semantic Notes is a client-side application that synchronizes data via Firebase. Ensuring the security and privacy of user data is paramount. The following measures are in place:

1. **App Check**: Firebase App Check is enabled to ensure that only authorized apps can access the backend. App Check tokens are required for Firestore and Storage access.
2. **Firestore/Storage rules**: Access is controlled via per-workspace rules that restrict reads and writes to authenticated users. Rules are defined in `firestore.rules` and `storage.rules`.
3. **Environment variables**: API keys and other secrets are provided via environment variables (`.env`). Never commit secrets to the repository. An example `.env.example` file is provided.
4. **Offline persistence**: Firestore is used with offline persistence enabled; data is cached locally and synced when connectivity is restored. No sensitive data is transmitted to external APIs by default.
5. **AI services**: Cloud AI integrations are opt-in and disabled by default. When enabled, they include provenance metadata and respect configured budgets.
6. **Stable base IRIs**: Use a stable, redirectable base IRI (e.g., a `w3id.org` prefix) to protect consumers from link rot and support long-term IRI persistence.

## Reporting vulnerabilities

If you discover a security vulnerability, please report it via a private issue. Do not disclose it publicly until it has been addressed.

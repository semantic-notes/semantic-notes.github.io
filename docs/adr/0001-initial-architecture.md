# ADR 0001: Initial Architecture and Modeling Approach

## Status

Accepted

## Context

We need to define the initial architecture and modeling conventions for the Semantic Notes project. The application is a client-side PWA built with React and TypeScript, using OWL and SKOS for semantic modeling. We must decide on the dual IRI pattern and the use of Firebase for storage.

## Decision

We adopt a dual IRI pattern where each conceptual idea has both an OWL class and a SKOS concept linked via `ex:denotesConcept` and `skos:exactMatch`. We will implement the application as a serverless PWA built with Vite and React, storing semantic data in RDF (TriG) under `/content/` and using Firebase (Firestore + Storage) for persistence and synchronization.

## Consequences

- Ontology modeling uses both OWL and SKOS, ensuring clear separation between logical types and lexical concepts.
- All developers must update both OWL and SKOS files when adding or modifying entities.
- The PWA can run offline with Firestore sync, but large graphs are stored in Storage to respect Firestore document size limits.
- Further ADRs should document additional architectural decisions such as rule engine choices and UI patterns.

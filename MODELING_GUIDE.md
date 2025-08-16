# Modeling Guide

## Dual IRIs (default)

For each conceptual idea you model, create **two IRIs**:

- **OWL class** — used for logical modeling and classification. Example:
  ```ttl
  ex:BreathingTechnique a owl:Class ;
    rdfs:label "Breathing Technique"@en ;
    rdfs:subClassOf ex:Neuromodulation .
  ```
- **SKOS concept** — used for terminology, labels and navigation. Example:
  ```ttl
  ex:BreathingTechniqueConcept a skos:Concept ;
    skos:prefLabel "Breathing Technique"@en .
  ```
- **Bridge** — link the two:
  ```ttl
  ex:BreathingTechnique ex:denotesConcept ex:BreathingTechniqueConcept ;
    skos:exactMatch ex:BreathingTechniqueConcept .
  ```

## When to use

- **OWL Class**: Use when you intend to classify instances or need reasoning and constraints.
- **SKOS Concept**: Use for human-readable names, multilingual labels, controlled vocabularies and lightweight taxonomies.
- **Both**: When the same idea functions both as a formal type and a lexical term.
- **Individuals (instances)**: Concrete things or events. Attach them to classes via `rdf:type`.
- **Object vs Datatype properties**: Use object properties for relationships between individuals, and datatype properties for values like strings, numbers and dates.
- **Annotation properties**: Use these for metadata such as definitions, sources and editorial notes.

## Restrictions (examples)

- **Some values**: require at least one value from the given class or datatype.
  ```ttl
  ex:Stimulus rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty ex:hasTempo ;
    owl:someValuesFrom xsd:decimal
  ] .
  ```
- **Only values**: all values must come from the given class/datatype. Use sparingly; over-constraining types can make ontologies brittle.

## Mappings

- Prefer `skos:exactMatch` or `skos:closeMatch` for aligning concepts to external vocabularies.
- Reserve `owl:equivalentClass` or `owl:sameAs` for situations where logical equivalence is rigorously established.

## Provenance

Record provenance using PROV-O:
`prov:wasDerivedFrom`, `prov:generatedAtTime`, `prov:wasAssociatedWith` and related properties. This helps trace who made what change and when.

## Annotations

Markdown notes can carry Web Annotations with Turtle describing their semantics:

```markdown
Breathing slowly eases anxiety.
```

```ttl
[] a oa:Annotation ;
   oa:hasTarget ex:BreathingTechnique,
               ex:BreathingTechniqueConcept ;
   oa:hasBody [
     a cnt:ContentAsText ;
     cnt:chars "Breathing slowly eases anxiety."@en ;
   ] .
```

The annotation links the note to the OWL class `ex:BreathingTechnique` and its SKOS concept `ex:BreathingTechniqueConcept`.

Store each annotation as a Markdown file (e.g., under `content/notes/`) with the text and Turtle blocks together. During `pnpm test`, the Turtle is extracted and validated through SHACL shapes and SPARQL invariants to ensure annotations remain consistent and dual IRIs stay synchronized.

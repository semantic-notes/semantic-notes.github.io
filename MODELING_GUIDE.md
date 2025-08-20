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

Record notes and other metadata directly with annotation properties. For example:

```ttl
ex:BreathingTechnique rdfs:comment "Breathing slowly eases anxiety."@en .
```

These annotations live in the ontology graphs and are validated during `pnpm test` alongside the rest of the data, keeping dual IRIs synchronized.

## Domains and ranges

When modeling object or datatype properties, specify their domain and range to describe the classes of subjects and objects they connect. Use `rdfs:domain` to indicate the expected subject type and `rdfs:range` to indicate the expected value type. Avoid over‑constraining: domain and range assertions cause inferences about every use of the property. If a property applies to several classes, either leave the domain unspecified or use multiple `rdfs:domain` statements. Prefer SHACL shapes for editorial constraints when domain/range semantics are not strictly logical.

Example:

```ttl
ex:hasTempo a owl:DatatypeProperty ;
  rdfs:domain ex:Stimulus ;
  rdfs:range xsd:decimal .
```

## Inverse properties

Use `owl:inverseOf` to define pairs of object properties that are inverses of one another. For example, if `x ex:hasPart y` then `y ex:isPartOf x`. Defining inverses helps the reasoner infer relationships automatically. Only declare inverses for one‑to‑one or one‑to‑many relationships that are truly reciprocal. Do not declare inverse properties for datatype properties.

Example:

```ttl
ex:hasPart a owl:ObjectProperty ;
  owl:inverseOf ex:isPartOf .

ex:isPartOf a owl:ObjectProperty .
```

## Property characteristics

OWL provides property characteristics that influence reasoning:

- **Functional** (`owl:FunctionalProperty`): a subject has at most one value for this property.
- **Inverse functional** (`owl:InverseFunctionalProperty`): a value identifies at most one subject (useful for unique identifiers).
- **Symmetric** (`owl:SymmetricProperty`): if `x P y` then `y P x`.
- **Transitive** (`owl:TransitiveProperty`): if `x P y` and `y P z` then `x P z`.
- **Reflexive** (`owl:ReflexiveProperty`): each individual is related to itself.
- **Irreflexive** (`owl:IrreflexiveProperty`): no individual is related to itself.
- **Asymmetric** (`owl:AsymmetricProperty`): if `x P y` then `y P x` is prohibited.

Use these characteristics only when they reflect real invariants. Misusing them can lead to unintended inferences or inconsistency.

## Disjoint classes

To assert that two classes share no individuals in common, use `owl:disjointWith`. Declaring disjointness helps detect modeling errors and improves reasoning efficiency. For example, a chemical stimulus and an electrical stimulus are mutually exclusive categories.

```ttl
ex:ChemicalStimulation owl:disjointWith ex:ElectricalStimulation .
```

You can also declare disjoint unions (`owl:disjointUnionOf`) when a class is partitioned into a set of disjoint subclasses whose union exhausts the parent class.

## Cardinality restrictions

Cardinality restrictions constrain the number of times a property may occur. The common forms are:

- `owl:minCardinality` / `owl:minQualifiedCardinality`: at least _n_ values (optionally of a given class).
- `owl:maxCardinality` / `owl:maxQualifiedCardinality`: at most _n_ values.
- `owl:cardinality` / `owl:qualifiedCardinality`: exactly _n_ values.

Qualified cardinality restrictions (e.g. `owl:minQualifiedCardinality`) allow you to specify both the number and the type of the value. Use cardinality restrictions judiciously: they express necessary conditions, not editorial advice. For user interface guidance, prefer SHACL shapes.

Example:

```ttl
ex:Session rdfs:subClassOf [
  a owl:Restriction ;
  owl:onProperty ex:primaryDevice ;
  owl:maxQualifiedCardinality "1"^^xsd:nonNegativeInteger ;
  owl:onClass ex:Device
] .
```

## Changing the base IRI

All internal IRIs are minted under a configurable base prefix (e.g.
`https://w3id.org/biosyncare/ont#`). To migrate the namespace:

1. Decide on the new base IRI. For long‑lived vocabularies, pick a
   `https://w3id.org/...` prefix that can redirect elsewhere.
2. Update the `BASE_IRI` environment variable (e.g. in `.env`).
3. Rewrite the dataset:

   ```bash
   pnpm tsx scripts/rewriteNamespace.ts [files]
   ```

   Omit `[files]` to use the default ontology and SKOS graphs. The script
   rewrites IRIs, updates `owl:versionIRI`, and logs the change to
   `scripts/migration.log`.
4. Commit the rewritten files and deploy the new namespace.
5. Configure HTTP redirects from the old base IRI to the new one so existing
   links continue to resolve.
6. Run `pnpm test` to verify the migration.

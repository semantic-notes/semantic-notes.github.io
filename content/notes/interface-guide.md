# Interface Guide

This note provides an overview of how to use the Semantic Notes web interface.

## Note

A **Note** captures free-form text about an ontology or vocabulary resource. Notes are stored as [W3C Web Annotations](https://www.w3.org/TR/annotation-model/) so they can reference multiple targets and be exchanged across systems. Use a note to record observations, definitions or links to related material.

## Semantic Structure

The **Semantic Structure** field accepts JSON-LD or other structured data that adds machine-readable context to a note. Include triples or shapes describing relationships between the targets so automated tools can reason over your annotations.

```ttl
@prefix oa: <http://www.w3.org/ns/oa#> .
@prefix cnt: <http://www.w3.org/2011/content#> .

[] a oa:Annotation ;
   oa:hasTarget <https://example.org/ontology/InterfaceGuide>,
                <https://example.org/skos/InterfaceGuideConcept> ;
   oa:hasBody [
     a cnt:ContentAsText ;
     cnt:chars "This note documents how to use the Semantic Notes interface."@en ;
   ] .
```

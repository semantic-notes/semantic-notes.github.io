# Example Note

This note references an example concept for annotation workflows.

```ttl
@prefix oa: <http://www.w3.org/ns/oa#> .
@prefix cnt: <http://www.w3.org/2011/content#> .

[] a oa:Annotation ;
   oa:hasTarget <https://example.org/ontology/Example>,
                <https://example.org/skos/ExampleConcept> ;
   oa:hasBody [
     a cnt:ContentAsText ;
     cnt:chars "This note references an example concept for annotation workflows."@en ;
   ] .
```

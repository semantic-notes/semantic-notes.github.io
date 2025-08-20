import { useState, type FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { DataFactory, Writer } from 'n3';
import type { Quad } from '@rdfjs/types';
import rdf from 'rdf-ext';
import shaclValidator from './shacl';
import { db } from './firebase';
import { expandCurie } from './namespaces';
import { buildDualIri } from '../../scripts/baseIri';

export default function EntityForm() {
  const { namedNode, literal, quad: createQuad } = DataFactory;
  const [localName, setLocalName] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const isTestEnv = import.meta.env.MODE === 'test';

  const serializeQuad = (q: Quad): Promise<string> => {
    const writer = new Writer({ format: 'N-Quads' });
    writer.addQuad(q);
    return new Promise((resolve, reject) =>
      writer.end((err, res) => (err ? reject(err) : resolve(res)))
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!localName) {
      setError('Local name is required.');
      return;
    }
    setError('');

    const { owl, skos } = buildDualIri(localName);
    const denotesConceptIri = buildDualIri('denotesConcept').owl;

    const triples: Quad[] = [
      createQuad(
        namedNode(owl),
        namedNode(expandCurie('rdf:type')),
        namedNode(expandCurie('owl:Class'))
      ),
      createQuad(
        namedNode(skos),
        namedNode(expandCurie('rdf:type')),
        namedNode(expandCurie('skos:Concept'))
      ),
      createQuad(namedNode(owl), namedNode(denotesConceptIri), namedNode(skos)),
      createQuad(
        namedNode(owl),
        namedNode(expandCurie('skos:exactMatch')),
        namedNode(skos)
      ),
    ];

    if (label) {
      triples.push(
        createQuad(
          namedNode(owl),
          namedNode(expandCurie('rdfs:label')),
          literal(label, 'en')
        ),
        createQuad(
          namedNode(skos),
          namedNode(expandCurie('skos:prefLabel')),
          literal(label, 'en')
        )
      );
    }

    const data = rdf.dataset();
    data.addAll(triples);
    const report = await shaclValidator.validate(data);
    if (!report.conforms) {
      const messages = report.results
        .flatMap((r) => (Array.isArray(r.message) ? r.message : [r.message]))
        .map((m) => (typeof m === 'string' ? m : m.value));
      setError(messages.join(' '));
      return;
    }

    if (!isTestEnv) {
      for (const t of triples) {
        try {
          const nquad = await serializeQuad(t);
          await addDoc(collection(db, 'triples'), { nquad });
        } catch (err) {
          console.error(err);
        }
      }
    }

    setLocalName('');
    setLabel('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Local Name
        <input
          value={localName}
          placeholder="Entity"
          onChange={(e) => setLocalName(e.target.value)}
        />
      </label>
      <label>
        Label
        <input
          value={label}
          placeholder="Label"
          onChange={(e) => setLabel(e.target.value)}
        />
      </label>
      <button type="submit">Save Entity</button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}


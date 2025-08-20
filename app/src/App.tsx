import { useState, type FormEvent, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { expandCurie } from './namespaces';
import rdf from 'rdf-ext';
import shaclValidator from './shacl';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import TripleVisualization from './TripleVisualization';
import EntityForm from './EntityForm';
import ConceptTree from './ConceptTree';
import { DataFactory, Parser, Writer } from 'n3';
import type { Quad } from '@rdfjs/types';

function Home() {
  const { namedNode, literal, quad: createQuad } = DataFactory;
  const parser = new Parser({ format: 'N-Quads' });
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('');
  const [object, setObject] = useState('');
  const [error, setError] = useState('');
  interface TripleEntry {
    id: string;
    quad: Quad;
  }
  const [triples, setTriples] = useState<TripleEntry[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [predicates, setPredicates] = useState<string[]>([]);
  const [objects, setObjects] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [focusedConcept, setFocusedConcept] = useState<string | null>(null);
  const isTestEnv = import.meta.env.MODE === 'test';

  const serializeQuad = (q: Quad): Promise<string> => {
    const writer = new Writer({ format: 'N-Quads' });
    writer.addQuad(q);
    return new Promise((resolve, reject) =>
      writer.end((err, res) => (err ? reject(err) : resolve(res)))
    );
  };

  const parseQuad = (nq: string): Quad => parser.parse(nq)[0] as Quad;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !predicate || !object) {
      setError('Subject, predicate and object are required.');
      return;
    }
    setError('');
    const expandedSubject = expandCurie(subject);
    const expandedPredicate = expandCurie(predicate);
    const expandedObject = expandCurie(object);
    const objectTerm =
      expandedObject !== object || /^https?:/.test(expandedObject) || object.includes(':')
        ? namedNode(expandedObject)
        : literal(object);
    const newQuad = createQuad(
      namedNode(expandedSubject),
      namedNode(expandedPredicate),
      objectTerm
    );
    const data = rdf.dataset();
    for (const t of triples) {
      if (editingId === t.id) continue;
      data.add(t.quad);
    }
    data.add(newQuad);
    const report = await shaclValidator.validate(data);
    if (!report.conforms) {
      const messages = report.results
        .flatMap((r) => (Array.isArray(r.message) ? r.message : [r.message]))
        .map((m) => (typeof m === 'string' ? m : m.value));
      setError(messages.join(' '));
      return;
    }
    if (editingId) {
      setTriples((prev) =>
        prev.map((t) => (t.id === editingId ? { id: editingId, quad: newQuad } : t))
      );
      if (!isTestEnv) {
        try {
          const nquad = await serializeQuad(newQuad);
          await updateDoc(doc(db, 'triples', editingId), { nquad });
        } catch (err) {
          console.error(err);
        }
      }
      setEditingId(null);
    } else {
      let newId = Math.random().toString(36).slice(2);
      if (!isTestEnv) {
        try {
          const nquad = await serializeQuad(newQuad);
          const docRef = await addDoc(collection(db, 'triples'), { nquad });
          newId = docRef.id;
        } catch (err) {
          console.error(err);
        }
      }
      setTriples((prev) => [...prev, { id: newId, quad: newQuad }]);
    }
    setSubject('');
    setPredicate('');
    setObject('');
  };

  const prefillFromTriple = (triple: Quad) => {
    setSubject(triple.subject.value);
    setPredicate(triple.predicate.value);
    setObject(triple.object.value);
  };

  const handleDelete = async (id: string) => {
    setTriples((prev) => prev.filter((t) => t.id !== id));
    if (!isTestEnv) {
      try {
        await deleteDoc(doc(db, 'triples', id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (isTestEnv) return;
    const loadTriples = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'triples'));
        const loaded = snapshot.docs.map((d) => ({
          id: d.id,
          quad: parseQuad((d.data() as { nquad: string }).nquad),
        }));
        setTriples(loaded);
      } catch (err) {
        console.error(err);
      }
    };
    void loadTriples();
  }, [isTestEnv]);

  useEffect(() => {
    setSubjects(Array.from(new Set(triples.map((t) => t.quad.subject.value))));
    setPredicates(Array.from(new Set(triples.map((t) => t.quad.predicate.value))));
    setObjects(Array.from(new Set(triples.map((t) => t.quad.object.value))));
  }, [triples]);

  return (
    <div className="app-container">
      <section className="form-section">
        <h1>OWL/SKOS Builder</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Subject
            <input
              list="subject-options"
              value={subject}
              placeholder="ex:Subject"
              title="Enter the subject IRI or CURIE"
              onChange={(e) => setSubject(e.target.value)}
            />
            <datalist id="subject-options" data-testid="subject-options">
              {subjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <label>
            Predicate
            <input
              list="predicate-options"
              value={predicate}
              placeholder="ex:predicate"
              title="Enter the predicate IRI or CURIE"
              onChange={(e) => setPredicate(e.target.value)}
            />
            <datalist id="predicate-options" data-testid="predicate-options">
              {predicates.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </label>
          <label>
            Object
            <input
              list="object-options"
              value={object}
              placeholder="ex:Object"
              title="Enter the object value"
              onChange={(e) => setObject(e.target.value)}
            />
            <datalist id="object-options" data-testid="object-options">
              {objects.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </label>
          <button type="submit">Save</button>
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </section>
      <section className="data-section">
        {subjects.length > 0 && (
          <div>
            <h2>Registered Subjects</h2>
            <ul className="registered-list">
              {subjects.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => setSubject(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {predicates.length > 0 && (
          <div>
            <h2>Registered Predicates</h2>
            <ul className="registered-list">
              {predicates.map((p) => (
                <li key={p}>
                  <button type="button" onClick={() => setPredicate(p)}>
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {triples.length > 0 && (
          <div>
            <h2>Registered Triples</h2>
            <ul className="triple-list">
              {triples.map((t) => (
                <li key={t.id} className="triple-card">
                  <div className="triple-display">
                    <button
                      type="button"
                      className="triple-part-button"
                      title="Use subject"
                      onClick={() => prefillFromTriple(t.quad)}
                    >
                      {t.quad.subject.value}
                    </button>
                    <button
                      type="button"
                      className="triple-part-button"
                      title="Use predicate"
                      onClick={() => prefillFromTriple(t.quad)}
                    >
                      {t.quad.predicate.value}
                    </button>
                    <button
                      type="button"
                      className="triple-part-button"
                      title="Use object"
                      onClick={() => prefillFromTriple(t.quad)}
                    >
                      {t.quad.object.value}
                    </button>
                    <span>({t.quad.object.termType})</span>
                  </div>
                  <div className="triple-actions">
                    <button
                      type="button"
                      onClick={() => {
                        prefillFromTriple(t.quad);
                        setEditingId(t.id);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(t.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {triples.length > 0 && (
          <ConceptTree
            triples={triples.map((t) => t.quad)}
            onSelect={(iri) => {
              setSubject(iri);
              setFocusedConcept(iri);
            }}
          />
        )}
        {triples.length > 0 && (
          <TripleVisualization
            triples={triples.map((t) => t.quad)}
            onTripleClick={(t) => prefillFromTriple(t)}
            focusNode={focusedConcept ?? undefined}
          />
        )}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/entity" element={<EntityForm />} />
    </Routes>
  );
}

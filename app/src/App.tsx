import { useState, type FormEvent, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { expandCurie } from './namespaces';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import TripleVisualization from './TripleVisualization';
import { DataFactory, Parser, Writer } from 'n3';
import type { Quad } from '@rdfjs/types';

function Home() {
  const { namedNode, literal, quad: createQuad } = DataFactory;
  const parser = new Parser({ format: 'N-Quads' });
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('');
  const [object, setObject] = useState('');
  const [error, setError] = useState('');
  const [triples, setTriples] = useState<Quad[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [predicates, setPredicates] = useState<string[]>([]);
  const [objects, setObjects] = useState<string[]>([]);
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
    const newTriple = createQuad(
      namedNode(expandedSubject),
      namedNode(expandedPredicate),
      objectTerm
    );
    setTriples((prev) => [...prev, newTriple]);
    if (!isTestEnv) {
      try {
        const nquad = await serializeQuad(newTriple);
        await addDoc(collection(db, 'triples'), { nquad });
      } catch (err) {
        console.error(err);
      }
    }
    setSubject('');
    setPredicate('');
    setObject('');
    setSubjects((prev) => Array.from(new Set([...prev, expandedSubject])));
    setPredicates((prev) =>
      Array.from(new Set([...prev, expandedPredicate]))
    );
    setObjects((prev) => Array.from(new Set([...prev, objectTerm.value])));
  };

  const prefillFromTriple = (triple: Quad) => {
    setSubject(triple.subject.value);
    setPredicate(triple.predicate.value);
    setObject(triple.object.value);
  };

  useEffect(() => {
    if (isTestEnv) return;
    const loadTriples = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'triples'));
        const loaded = snapshot.docs.map((d) =>
          parseQuad((d.data() as { nquad: string }).nquad)
        );
        setTriples(loaded);
        setSubjects(Array.from(new Set(loaded.map((n) => n.subject.value))));
        setPredicates(
          Array.from(new Set(loaded.map((n) => n.predicate.value)))
        );
        setObjects(Array.from(new Set(loaded.map((n) => n.object.value))));
      } catch (err) {
        console.error(err);
      }
    };
    void loadTriples();
  }, [isTestEnv]);

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
              {triples.map((t, i) => (
                <li key={i} className="triple-card">
                  <div className="triple-display">
                    <button
                      type="button"
                      className="triple-part-button"
                      title="Use subject"
                      onClick={() => prefillFromTriple(t)}
                    >
                      {t.subject.value}
                    </button>
                    <button
                      type="button"
                      className="triple-part-button"
                      title="Use predicate"
                      onClick={() => prefillFromTriple(t)}
                    >
                      {t.predicate.value}
                    </button>
                    <button
                      type="button"
                      className="triple-part-button"
                      title="Use object"
                      onClick={() => prefillFromTriple(t)}
                    >
                      {t.object.value}
                    </button>
                    <span>({t.object.termType})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {triples.length > 0 && (
          <TripleVisualization
            triples={triples}
            onTripleClick={(t) => prefillFromTriple(t)}
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
    </Routes>
  );
}

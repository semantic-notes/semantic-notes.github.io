import { useState, type FormEvent } from 'react';
import { Routes, Route } from 'react-router-dom';
import { expandCurie } from './namespaces';

type NoteTarget = 'subject' | 'predicate' | 'object' | 'triple';

function Home() {
  const [note, setNote] = useState('');
  const [noteTarget, setNoteTarget] = useState<NoteTarget>('triple');
  const [structure, setStructure] = useState('');
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('');
  const [object, setObject] = useState('');
  const [objectType, setObjectType] = useState('data');
  const [error, setError] = useState('');
  const [notes, setNotes] =
    useState<
      Array<{
        note: string;
        noteTarget: 'subject' | 'predicate' | 'object' | 'triple';
        structure: string;
        triple: {
          subject: string;
          predicate: string;
          object: string;
          objectType: string;
        };
      }>
    >([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [predicates, setPredicates] = useState<string[]>([]);
  const [objects, setObjects] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !predicate || !object) {
      setError('Subject, predicate and object are required.');
      return;
    }
    setError('');
    const expandedSubject = expandCurie(subject);
    const expandedPredicate = expandCurie(predicate);
    const expandedObject =
      objectType === 'data' ? object : expandCurie(object);
    const newNote = {
      note,
      noteTarget,
      structure,
      triple: {
        subject: expandedSubject,
        predicate: expandedPredicate,
        object: expandedObject,
        objectType,
      },
    };
    setNotes((prev) => [...prev, newNote]);
    setNote('');
    setNoteTarget('triple');
    setStructure('');
    setSubject('');
    setPredicate('');
    setObject('');
    setSubjects((prev) =>
      Array.from(new Set([...prev, expandedSubject]))
    );
    setPredicates((prev) =>
      Array.from(new Set([...prev, expandedPredicate]))
    );
    setObjects((prev) =>
      Array.from(new Set([...prev, expandedObject]))
    );
  };

  return (
    <div className="app-container">
      <section className="form-section">
        <h1>Semantic Notes</h1>
        <form onSubmit={handleSubmit}>
        <label>
          Note
          <textarea
            value={note}
            placeholder="Optional note about this entry"
            title="Optional note about the triple or one of its parts"
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label>
          Note Target
          <select
            value={noteTarget}
            title="Select which part of the triple the note refers to"
            onChange={(e) => setNoteTarget(e.target.value as NoteTarget)}
          >
            <option value="triple">Triple</option>
            <option value="subject">Subject</option>
            <option value="predicate">Predicate</option>
            <option value="object">Object</option>
          </select>
        </label>
        <label>
          Semantic Structure
          <textarea
            value={structure}
            placeholder='{"type":"Example"}'
            title="Optional structured representation such as JSON-LD"
            onChange={(e) => setStructure(e.target.value)}
          />
        </label>
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
        <label>
          Object Type
          <select
            value={objectType}
            title="Choose the kind of object (literal data, class, or other)"
            onChange={(e) => setObjectType(e.target.value)}
          >
            <option value="data">Data</option>
            <option value="class">Class</option>
            <option value="other">Other</option>
          </select>
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
        {notes.length > 0 && (
          <div>
            <h2>Registered Triples</h2>
            <ul className="note-list">
              {notes.map((n, i) => (
                <li key={i} className="note-card">
                  <pre>
                    {n.triple.subject} {n.triple.predicate} {n.triple.object} ({n.triple.objectType})
                  </pre>
                  {n.note && (
                    <pre>Note on {n.noteTarget}: {n.note}</pre>
                  )}
                  {n.structure && <pre>{n.structure}</pre>}
                </li>
              ))}
            </ul>
          </div>
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

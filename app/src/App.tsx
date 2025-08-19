import { useState, type FormEvent } from 'react';
import { Routes, Route } from 'react-router-dom';

function Home() {
  const [note, setNote] = useState('');
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('');
  const [object, setObject] = useState('');
  const [objectType, setObjectType] = useState('data');
  const [error, setError] = useState('');
  const [notes, setNotes] =
    useState<
      Array<{
        note: string;
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
    const newNote = { note, triple: { subject, predicate, object, objectType } };
    setNotes((prev) => [...prev, newNote]);
    setNote('');
    setSubject('');
    setPredicate('');
    setObject('');
    setSubjects((prev) => Array.from(new Set([...prev, subject])));
    setPredicates((prev) => Array.from(new Set([...prev, predicate])));
    setObjects((prev) => Array.from(new Set([...prev, object])));
  };

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Note
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <label>
          Subject
          <input
            list="subject-options"
            value={subject}
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
          <select value={objectType} onChange={(e) => setObjectType(e.target.value)}>
            <option value="data">Data</option>
            <option value="class">Class</option>
            <option value="other">Other</option>
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {notes.length > 0 && (
        <div>
          <h2>Saved</h2>
          <ul>
            {notes.map((n, i) => (
              <li key={i}>
                <pre>{n.note}</pre>
                <pre>
                  {n.triple.subject} {n.triple.predicate} {n.triple.object} ({n.triple.objectType})
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
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

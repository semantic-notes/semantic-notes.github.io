import { useState, type FormEvent } from 'react';
import { Routes, Route } from 'react-router-dom';

function Home() {
  const [note, setNote] = useState('');
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('');
  const [object, setObject] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] =
    useState<{ note: string; triple: { subject: string; predicate: string; object: string } } | null>(
      null,
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !predicate || !object) {
      setError('Subject, predicate and object are required.');
      return;
    }
    setError('');
    setSaved({ note, triple: { subject, predicate, object } });
    setNote('');
    setSubject('');
    setPredicate('');
    setObject('');
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
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label>
          Predicate
          <input value={predicate} onChange={(e) => setPredicate(e.target.value)} />
        </label>
        <label>
          Object
          <input value={object} onChange={(e) => setObject(e.target.value)} />
        </label>
        <button type="submit">Save</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {saved && (
        <div>
          <h2>Saved</h2>
          <pre>{saved.note}</pre>
          <pre>
            {saved.triple.subject} {saved.triple.predicate} {saved.triple.object}
          </pre>
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

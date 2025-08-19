import { useState, type FormEvent } from 'react';
import { Routes, Route } from 'react-router-dom';

function Home() {
  const [note, setNote] = useState('');
  const [structure, setStructure] = useState('');
  const [saved, setSaved] = useState<{ note: string; structure: string } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved({ note, structure });
    setNote('');
    setStructure('');
  };

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Note
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label>
          Semantic Structure
          <textarea
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
          />
        </label>
        <button type="submit">Save</button>
      </form>
      {saved && (
        <div>
          <h2>Saved</h2>
          <pre>{saved.note}</pre>
          <pre>{saved.structure}</pre>
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

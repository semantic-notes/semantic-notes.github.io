import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('accepts notes, semantic structures and semantic triples', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const noteInput = screen.getByLabelText(/^note$/i);
    const noteTargetSelect = screen.getByLabelText(/note target/i);
    const structureInput = screen.getByLabelText(/semantic structure/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const predicateInput = screen.getByLabelText(/predicate/i);
    const objectInput = screen.getByLabelText(/^object$/i);
    const objectTypeSelect = screen.getByLabelText(/object type/i);

    await userEvent.type(noteInput, 'Example note');
    fireEvent.change(structureInput, { target: { value: '{"type":"Example"}' } });
    await userEvent.type(subjectInput, 'ex:Subject');
    await userEvent.type(predicateInput, 'ex:predicate');
    await userEvent.type(objectInput, 'ex:Object');
    await userEvent.selectOptions(objectTypeSelect, 'class');
    await userEvent.selectOptions(noteTargetSelect, 'predicate');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText('Note on predicate: Example note')).toBeTruthy();
    expect(
      screen.getByText('ex:Subject ex:predicate ex:Object (class)')
    ).toBeTruthy();
    expect(screen.getByText('{"type":"Example"}')).toBeTruthy();

    const subjectOptions = screen.getByTestId('subject-options');
    expect(subjectOptions.querySelector('option[value="ex:Subject"]')).toBeTruthy();
  });

  it('expands known namespace prefixes when saving triples', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const subjectInput = screen.getByLabelText(/subject/i);
    const predicateInput = screen.getByLabelText(/predicate/i);
    const objectInput = screen.getByLabelText(/^object$/i);
    const objectTypeSelect = screen.getByLabelText(/object type/i);

    await userEvent.type(subjectInput, 'ex:Thing');
    await userEvent.type(predicateInput, 'rdf:type');
    await userEvent.type(objectInput, 'skos:Concept');
    await userEvent.selectOptions(objectTypeSelect, 'class');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      screen.getByText(
        'ex:Thing http://www.w3.org/1999/02/22-rdf-syntax-ns#type http://www.w3.org/2004/02/skos/core#Concept (class)'
      )
    ).toBeTruthy();
  });

  it('provides guidance through tooltips', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/note target/i).getAttribute('title')).toBeTruthy();
    expect(screen.getByLabelText(/subject/i).getAttribute('title')).toBeTruthy();
  });
});

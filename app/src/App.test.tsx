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
    expect(screen.getByTitle('Add note about this subject').textContent).toBe(
      'ex:Subject'
    );
    expect(screen.getByTitle('Add note about this predicate').textContent).toBe(
      'ex:predicate'
    );
    expect(screen.getByTitle('Add note about this object').textContent).toBe(
      'ex:Object'
    );
    expect(screen.getByText('(class)')).toBeTruthy();
    expect(screen.getByText('{"type":"Example"}')).toBeTruthy();

    const subjectOptions = screen.getByTestId('subject-options');
    expect(subjectOptions.querySelector('option[value="ex:Subject"]')).toBeTruthy();

    const viz = screen.getByTestId('triple-visualization');
    expect(viz.textContent).toContain('ex:Subject');
    expect(viz.textContent).toContain('ex:Object');
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

    const subjectButtons = screen.getAllByTitle('Add note about this subject');
    expect(subjectButtons[subjectButtons.length - 1].textContent).toBe(
      'ex:Thing'
    );
    const predicateButtons = screen.getAllByTitle(
      'Add note about this predicate'
    );
    expect(predicateButtons[predicateButtons.length - 1].textContent).toBe(
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    );
    const objectButtons = screen.getAllByTitle('Add note about this object');
    expect(objectButtons[objectButtons.length - 1].textContent).toBe(
      'http://www.w3.org/2004/02/skos/core#Concept'
    );
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

  it('prefills form fields when triple parts are clicked', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const subjectInput = screen.getByLabelText(/subject/i);
    const predicateInput = screen.getByLabelText(/predicate/i);
    const objectInput = screen.getByLabelText(/^object$/i);

    await userEvent.type(subjectInput, 'ex:S1');
    await userEvent.type(predicateInput, 'ex:p1');
    await userEvent.type(objectInput, 'ex:O1');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const subjectBtns = screen.getAllByTitle('Add note about this subject');
    await userEvent.click(subjectBtns[subjectBtns.length - 1]);

    expect((screen.getByLabelText(/subject/i) as HTMLInputElement).value).toBe(
      'ex:S1'
    );
    expect((screen.getByLabelText(/predicate/i) as HTMLInputElement).value).toBe(
      'ex:p1'
    );
    expect((screen.getByLabelText(/^object$/i) as HTMLInputElement).value).toBe(
      'ex:O1'
    );
    expect(
      (screen.getByLabelText(/note target/i) as HTMLSelectElement).value
    ).toBe('subject');
  });

  it('prefills form fields when visualization edge is clicked', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const subjectInput = screen.getByLabelText(/subject/i);
    const predicateInput = screen.getByLabelText(/predicate/i);
    const objectInput = screen.getByLabelText(/^object$/i);

    await userEvent.type(subjectInput, 'ex:Vs');
    await userEvent.type(predicateInput, 'ex:Vp');
    await userEvent.type(objectInput, 'ex:Vo');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const edge = screen.getByTestId('triple-edge-0');
    await userEvent.click(edge);

    expect((screen.getByLabelText(/subject/i) as HTMLInputElement).value).toBe(
      'ex:Vs'
    );
    expect((screen.getByLabelText(/predicate/i) as HTMLInputElement).value).toBe(
      'ex:Vp'
    );
    expect((screen.getByLabelText(/^object$/i) as HTMLInputElement).value).toBe(
      'ex:Vo'
    );
    expect(
      (screen.getByLabelText(/note target/i) as HTMLSelectElement).value
    ).toBe('triple');
  });
});

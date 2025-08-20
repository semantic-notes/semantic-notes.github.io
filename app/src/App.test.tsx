import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('saves triples and displays them', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const subjectInput = screen.getByLabelText(/subject/i);
    const predicateInput = screen.getByLabelText(/predicate/i);
    const objectInput = screen.getByLabelText(/^object$/i);

    await userEvent.type(subjectInput, 'ex:Subject');
    await userEvent.type(predicateInput, 'ex:predicate');
    await userEvent.type(objectInput, 'ex:Object');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByTitle('Use subject').textContent).toBe('ex:Subject');
    expect(screen.getByTitle('Use predicate').textContent).toBe('ex:predicate');
    expect(screen.getByTitle('Use object').textContent).toBe('ex:Object');
    expect(screen.getByText('(NamedNode)')).toBeTruthy();

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

    await userEvent.type(subjectInput, 'ex:Thing');
    await userEvent.type(predicateInput, 'rdf:type');
    await userEvent.type(objectInput, 'skos:Concept');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const predicateButtons = screen.getAllByTitle('Use predicate');
    expect(predicateButtons[predicateButtons.length - 1].textContent).toBe(
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    );
    const objectButtons = screen.getAllByTitle('Use object');
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

    expect(screen.getByLabelText(/subject/i).getAttribute('title')).toBeTruthy();
    expect(screen.getByLabelText(/predicate/i).getAttribute('title')).toBeTruthy();
    expect(screen.getByLabelText(/^object$/i).getAttribute('title')).toBeTruthy();
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

    const subjectBtns = screen.getAllByTitle('Use subject');
    await userEvent.click(subjectBtns[subjectBtns.length - 1]);

    expect((screen.getByLabelText(/subject/i) as HTMLInputElement).value).toBe('ex:S1');
    expect((screen.getByLabelText(/predicate/i) as HTMLInputElement).value).toBe('ex:p1');
    expect((screen.getByLabelText(/^object$/i) as HTMLInputElement).value).toBe('ex:O1');
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

    expect((screen.getByLabelText(/subject/i) as HTMLInputElement).value).toBe('ex:Vs');
    expect((screen.getByLabelText(/predicate/i) as HTMLInputElement).value).toBe('ex:Vp');
    expect((screen.getByLabelText(/^object$/i) as HTMLInputElement).value).toBe('ex:Vo');
  });

  it('allows editing and deleting triples and refreshes suggestions', async () => {
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

    await userEvent.type(subjectInput, 'ex:S2');
    await userEvent.type(predicateInput, 'ex:p2');
    await userEvent.type(objectInput, 'ex:O2');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]);
    const subjAfterEdit = screen.getByLabelText(/subject/i) as HTMLInputElement;
    await userEvent.clear(subjAfterEdit);
    await userEvent.type(subjAfterEdit, 'ex:S1e');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const subjectButtons = screen.getAllByTitle('Use subject');
    expect(subjectButtons[0].textContent).toBe('ex:S1e');
    const subjectOptions = screen.getByTestId('subject-options');
    expect(subjectOptions.querySelector('option[value="ex:S1e"]')).toBeTruthy();
    expect(subjectOptions.querySelector('option[value="ex:S1"]')).toBeFalsy();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[1]);

    expect(screen.queryByText('ex:S2')).toBeNull();
    expect(subjectOptions.querySelector('option[value="ex:S2"]')).toBeFalsy();
  });
});

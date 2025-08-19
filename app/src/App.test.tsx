import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('accepts notes, semantic structures and semantic triples', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const noteInput = screen.getByLabelText(/note/i);
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
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText('Example note')).toBeTruthy();
    expect(
      screen.getByText('ex:Subject ex:predicate ex:Object (class)')
    ).toBeTruthy();
    expect(screen.getByText('{"type":"Example"}')).toBeTruthy();

    const subjectOptions = screen.getByTestId('subject-options');
    expect(subjectOptions.querySelector('option[value="ex:Subject"]')).toBeTruthy();
  });
});

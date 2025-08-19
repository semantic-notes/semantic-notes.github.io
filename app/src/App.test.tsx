import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('accepts notes and semantic structures', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const noteInput = screen.getByLabelText(/note/i);
    const structureInput = screen.getByLabelText(/semantic structure/i);
    await userEvent.type(noteInput, 'Example note');
    await userEvent.type(structureInput, 'ex:Example');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText('Example note')).toBeTruthy();
    expect(screen.getByText('ex:Example')).toBeTruthy();
  });
});

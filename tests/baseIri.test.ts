import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBaseIri, validateIri, buildDualIri } from '../scripts/baseIri';

describe('baseIri utilities', () => {
  beforeEach(() => {
    delete process.env.BASE_IRI;
  });

  afterEach(() => {
    delete process.env.BASE_IRI;
  });

  it('throws when BASE_IRI is missing', () => {
    expect(() => getBaseIri()).toThrow('BASE_IRI is not set');
  });

  it('throws on invalid BASE_IRI', () => {
    process.env.BASE_IRI = 'not a url';
    expect(() => getBaseIri()).toThrow('Invalid IRI');
  });

  it('normalizes BASE_IRI with trailing #', () => {
    process.env.BASE_IRI = 'https://example.org';
    expect(getBaseIri()).toBe('https://example.org#');
  });

  it('builds dual IRIs from the base', () => {
    process.env.BASE_IRI = 'https://example.org#';
    const dual = buildDualIri('Thing');
    expect(dual.owl).toBe('https://example.org#Thing');
    expect(dual.skos).toBe('https://example.org#Thing');
  });

  it('validates IRI format', () => {
    expect(() => validateIri('bad')).toThrow('Invalid IRI');
    expect(() => validateIri('https://good.example/')).not.toThrow();
  });
});


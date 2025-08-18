import { URL } from 'url';

/**
 * Reads the BASE_IRI from the environment and validates it.
 * Falls back to a provided default if available.
 */
export function getBaseIri(defaultIri?: string): string {
  const iri = process.env.BASE_IRI || defaultIri;
  if (!iri) {
    throw new Error('BASE_IRI is not set');
  }
  validateIri(iri);
  return iri.endsWith('#') || iri.endsWith('/') ? iri : iri + '#';
}

/** Validate that the string is a proper http(s) IRI. */
export function validateIri(iri: string): void {
  let url: URL;
  try {
    url = new URL(iri);
  } catch {
    throw new Error(`Invalid IRI: ${iri}`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`IRI must use http or https: ${iri}`);
  }
}

/** Build OWL/SKOS IRIs from a local name using the same base. */
export function buildDualIri(localName: string): { owl: string; skos: string } {
  const base = getBaseIri();
  return { owl: `${base}${localName}`, skos: `${base}${localName}` };
}

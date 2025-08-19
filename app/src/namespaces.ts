export const NAMESPACES: Record<string, string> = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  dcterms: 'http://purl.org/dc/terms/',
  schema: 'http://schema.org/',
};

export function expandCurie(value: string): string {
  if (/^https?:/.test(value)) return value;
  const match = value.match(/^([^:]+):(.+)$/);
  if (match) {
    const [, prefix, local] = match;
    const base = NAMESPACES[prefix];
    if (base) return `${base}${local}`;
  }
  return value;
}

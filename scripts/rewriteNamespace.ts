import fs from 'fs';
import path from 'path';
import { getBaseIri } from './baseIri';

const storePath = path.join(__dirname, '.base-iri');
const logPath = path.join(__dirname, 'migration.log');

/**
 * Rewrites ontology files to use the current BASE_IRI.
 * The previous value is stored in `.base-iri`.
 * When the value changes, owl:versionIRI is updated and a log entry is written.
 */
export function rewriteNamespace(files: string[]): boolean {
  const newBase = getBaseIri();
  const oldBase = fs.existsSync(storePath) ? fs.readFileSync(storePath, 'utf8').trim() : '';
  if (oldBase === newBase) {
    return false; // no change
  }
  const pattern = oldBase ? new RegExp(oldBase, 'g') : null;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let data = fs.readFileSync(file, 'utf8');
    if (pattern) {
      data = data.replace(pattern, newBase);
    }
    data = data.replace(/owl:versionIRI\s+"[^"]+"/, `owl:versionIRI "${newBase}"`);
    fs.writeFileSync(file, data, 'utf8');
  }
  fs.writeFileSync(storePath, newBase, 'utf8');
  const logLine = `${new Date().toISOString()}\t${oldBase}\t${newBase}\n`;
  fs.appendFileSync(logPath, logLine, 'utf8');
  return true;
}

if (require.main === module) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    files.push(path.join(__dirname, '../content/ontology/ontology.ttl'));
    files.push(path.join(__dirname, '../content/skos/ontology.ttl'));
  }
  rewriteNamespace(files);
}

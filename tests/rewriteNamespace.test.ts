import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { rewriteNamespace } from '../scripts/rewriteNamespace';

describe('rewriteNamespace', () => {
  it('rewrites ontology IRIs and logs the migration', () => {
    const tmpDir = path.join(__dirname, 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    const ontologyPath = path.join(tmpDir, 'ontology.ttl');
    fs.writeFileSync(
      ontologyPath,
      '@prefix owl: <http://www.w3.org/2002/07/owl#>.\n' +
        '<https://old.example.org#> a owl:Ontology ;\n' +
        '  owl:versionIRI "https://old.example.org#" .\n'
    );

    const scriptsDir = path.join(__dirname, '..', 'scripts');
    fs.writeFileSync(path.join(scriptsDir, '.base-iri'), 'https://old.example.org#');
    process.env.BASE_IRI = 'https://new.example.org#';
    rewriteNamespace([ontologyPath]);

    const rewritten = fs.readFileSync(ontologyPath, 'utf8');
    expect(rewritten).toContain('https://new.example.org#');
    const logPath = path.join(scriptsDir, 'migration.log');
    expect(fs.existsSync(logPath)).toBe(true);

    fs.unlinkSync(path.join(scriptsDir, '.base-iri'));
    fs.unlinkSync(logPath);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});


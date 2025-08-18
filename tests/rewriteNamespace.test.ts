import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';
import { validateIri, buildDualIri } from '../scripts/baseIri';
import { rewriteNamespace } from '../scripts/rewriteNamespace';

// Test IRI validation
assert.throws(() => validateIri('not a url'));
validateIri('https://example.org#');

// Test dual IRI construction
process.env.BASE_IRI = 'https://example.org#';
const dual = buildDualIri('Thing');
assert.equal(dual.owl, 'https://example.org#Thing');
assert.equal(dual.skos, 'https://example.org#Thing');

// Prepare temporary ontology file
const tmpDir = path.join(__dirname, 'tmp');
fs.mkdirSync(tmpDir, { recursive: true });
const ontologyPath = path.join(tmpDir, 'ontology.ttl');
fs.writeFileSync(
  ontologyPath,
  '@prefix owl: <http://www.w3.org/2002/07/owl#> .\n<https://old.example.org#> a owl:Ontology ;\n  owl:versionIRI "https://old.example.org#" .\n'
);

// Simulate stored base IRI and run rewrite
const scriptsDir = path.join(__dirname, '..', 'scripts');
fs.writeFileSync(path.join(scriptsDir, '.base-iri'), 'https://old.example.org#');
process.env.BASE_IRI = 'https://new.example.org#';
rewriteNamespace([ontologyPath]);

// Verify rewrite happened
const rewritten = fs.readFileSync(ontologyPath, 'utf8');
assert(rewritten.includes('https://new.example.org#'));
const logPath = path.join(scriptsDir, 'migration.log');
assert(fs.existsSync(logPath));

// Cleanup generated files
fs.unlinkSync(path.join(scriptsDir, '.base-iri'));
fs.unlinkSync(logPath);
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log('ok');

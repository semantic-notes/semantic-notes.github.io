#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import rdf from 'rdf-ext';
import { Parser } from 'n3';
import SHACLValidator from 'rdf-validate-shacl';

async function loadDataset(dir, { skip = new Set() } = {}) {
  const dataset = rdf.dataset();
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skip.has(entry.name)) continue;
      const child = await loadDataset(full, { skip });
      dataset.addAll(child);
    } else if (/\.(ttl|trig|nt|nq)$/i.test(entry.name)) {
      const text = await fs.readFile(full, 'utf8');
      const ext = path.extname(entry.name).toLowerCase();
      const format = ['.trig', '.nq'].includes(ext) ? 'application/trig' : 'text/turtle';
      const parser = new Parser({ format });
      const quads = parser.parse(text);
      dataset.addAll(quads);
    }
  }
  return dataset;
}

async function main() {
  try {
    const data = await loadDataset(path.resolve('content'), { skip: new Set(['shapes']) });
    const shapes = await loadDataset(path.resolve('content', 'shapes'));
    const validator = new SHACLValidator(shapes);
    const report = await validator.validate(data);
    if (report.conforms) {
      console.log('SHACL validation passed');
    } else {
      console.error('SHACL validation failed');
      for (const result of report.results) {
        const messages = Array.isArray(result.message) ? result.message : [result.message];
        for (const m of messages) console.error(m.value || m);
      }
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

await main();

#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import rdf from 'rdf-ext';
import { Parser } from 'n3';
import Comunica from '@comunica/query-sparql';
const { QueryEngine } = Comunica;

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

async function loadQueries(files) {
  const queries = [];
  for (const file of files) {
    try {
      const text = await fs.readFile(file, 'utf8');
      const parts = text.split(/\n\s*\n/).map(q => q.trim()).filter(Boolean);
      for (const part of parts) {
        queries.push({ file, query: part });
      }
    } catch (err) {
      console.warn(`Skipping missing file ${file}`);
    }
  }
  return queries;
}

async function main() {
  try {
    const files = process.argv.slice(2);
    if (files.length === 0) files.push(path.resolve('scripts', 'invariants.spec.sparql'));
    const queries = await loadQueries(files);
    if (queries.length === 0) {
      console.log('No SPARQL invariants found');
      return;
    }
    const data = await loadDataset(path.resolve('content'), { skip: new Set(['shapes']) });
    const engine = new QueryEngine();
    const failures = [];
    for (const { file, query } of queries) {
      const ok = await engine.queryBoolean(query, { sources: [{ type: 'rdfjs', value: data }] });
      if (!ok) failures.push({ file, query });
    }
    if (failures.length) {
      console.error('SPARQL invariants failed');
      failures.forEach((f, i) => {
        console.error(`  [${i + 1}] ${f.file}`);
      });
      process.exitCode = 1;
    } else {
      console.log('SPARQL invariants passed');
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

await main();

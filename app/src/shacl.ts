import rdf from 'rdf-ext';
import { Parser } from 'n3';
import SHACLValidator from 'rdf-validate-shacl';

const shapeFiles = import.meta.glob('../../content/shapes/*.ttl', { as: 'raw', eager: true });
const shapes = rdf.dataset();
const parser = new Parser({ format: 'text/turtle' });
for (const ttl of Object.values(shapeFiles)) {
  shapes.addAll(parser.parse(ttl as string));
}

const validator = new SHACLValidator(shapes);
export default validator;

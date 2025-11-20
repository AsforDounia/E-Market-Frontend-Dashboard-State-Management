import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

// Load the generated swagger.yaml file
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(process.cwd(), './swagger.yaml'), 'utf8'));

// Swagger UI options
const swaggerOptions = {
  explorer: true,
};

export { swaggerUi, swaggerDocument, swaggerOptions };

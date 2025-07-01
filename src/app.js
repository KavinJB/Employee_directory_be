import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import router from './routes/Person.routes.js';

const app = express();

// Resolve __dirname in ES module
// // CORS configuration to allow frontend (Angular at port 4200) to communicate with backend
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.json());

app.use('/api/persons', router);

export default app;

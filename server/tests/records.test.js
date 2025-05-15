import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToDatabase, closeDatabase } from '../db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const module = await import(path.join(__dirname, '../routes/record.js'));
const recordsRouter = module.default;

const app = express();
app.use(bodyParser.json());
app.use('/records', recordsRouter);

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('GET /records', () => {
  it('200 kodu dönmeli ve bir dizi döndürmeli', async () => {
    const response = await request(app).get('/records');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

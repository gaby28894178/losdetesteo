import { startServer, stopServer } from '../test-server'
import request from 'supertest'
import prisma from '../../../config/db'
import { createToken } from '../../../utils/jwt/createToken'

let server;
let baseUrl;
let token;

beforeAll(async () => {
  server = await startServer();
  const address = server.address();
  baseUrl = `http://localhost:${address.port}`;

  // Obtener token de autenticación (ajusta según tu implementación)
  const user = await prisma.users.findFirst({ where: { email: 'admin@gmail.com' } });
  token = await createToken(user.id);
});

afterAll(async () => {
  await stopServer();
});

describe('News endpoints', () => {
  it('Should return a list of news GET /api/v1/news', async () => {
    const res = await request(baseUrl)
      .get('/api/v1/news')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('Should create a news article POST /api/v1/news', async () => {
    const testNews = {
      title: 'Test News',
      content: 'This is a test news article.'
    };

    const res = await request(baseUrl)
      .post('/api/v1/news')
      .send(testNews)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
  });

  it('Should return 404 for non-existent news GET /api/v1/news/:id', async () => {
    const res = await request(baseUrl)
      .get('/api/v1/news/999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

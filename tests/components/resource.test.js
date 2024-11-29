import { startServer, stopServer } from '../test-server';
import request from 'supertest';
import prisma from '../../src/config/db';
import { createToken } from '../../utils/jwt/createToken';

describe('Resource endpoint', () => {
  let baseUrl; // URL base del servidor de pruebas
  let server; // Servidor Supertest
  let token; // Token para autenticación
  
  beforeAll(async () => {
    const testServer = await startServer();
    const address = testServer.address();
    baseUrl = `http://localhost:${address.port}`;
    server = request(baseUrl);
    
    console.log('Base URL del servidor de pruebas:', baseUrl);

    const user = await prisma.users.findFirst({ where: { email: 'admin@gmail.com' } });
    token = await createToken(user.id);
    console.log('Token generado:', token);
  });

  afterAll(async () => {
    await stopServer();
  });

  // Datos de prueba
  const testData = [
    { id: 1, name: 'Test Resource 1', description: 'Description 1' },
    { id: 2, name: 'Test Resource 2', description: 'Description 2' },
  ];

  const newResource = { name: 'New Resource', description: 'New Description' };
  const invalidResource = { name: '' }; // Faltan campos requeridos

  // Tests para GET /api/v1/resource/:id
  describe('GET /api/v1/resource/:id', () => {
    test('Debe retornar un recurso por ID válido', async () => {
      const created = await prisma.resource.create({ data: testData[0] });
      const { body } = await server.get(`/api/v1/resource/${created.id}`).set('Authorization', `Bearer ${token}`);
      expect(body.statusCode).toBe(200);
      expect(body.data).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: testData[0].name,
        description: testData[0].description,
      }));
    });

    test('Debe retornar 404 para un ID inexistente', async () => {
      const { body } = await server.get('/api/v1/resource/9999').set('Authorization', `Bearer ${token}`);
      expect(body.statusCode).toBe(404);
      expect(body.message).toBe('Resource not found');
    });

    test('Debe retornar 401 si el token está ausente', async () => {
      const { body } = await server.get(`/api/v1/resource/1`).set('Authorization', '');
      expect(body.message).toBe('Unauthorized');
    });
  });

  // Tests para POST /api/v1/resource
  describe('POST /api/v1/resource', () => {
    test('Debe crear un nuevo recurso', async () => {
      const { body } = await server.post('/api/v1/resource').send(newResource).set('Authorization', `Bearer ${token}`);
      expect(body.statusCode).toBe(201);
      expect(body.data).toEqual(expect.objectContaining(newResource));
    });

    test('Debe retornar error 400 para datos inválidos', async () => {
      const { body } = await server.post('/api/v1/resource').send(invalidResource).set('Authorization', `Bearer ${token}`);
      expect(body.statusCode).toBe(400);
      expect(body.message).toBe('"name" is required');
    });

    test('Debe retornar 401 si el token está ausente', async () => {
      const { body } = await server.post('/api/v1/resource').send(newResource).set('Authorization', '');
      expect(body.message).toBe('Unauthorized');
    });
  });

  // Tests para DELETE /api/v1/resource/:id
  describe('DELETE /api/v1/resource/:id', () => {
    test('Debe eliminar un recurso por ID válido', async () => {
      const created = await prisma.resource.create({ data: newResource });
      const { body } = await server.delete(`/api/v1/resource/${created.id}`).set('Authorization', `Bearer ${token}`);
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe('Resource deleted successfully');
    });

    test('Debe retornar 404 para un ID inexistente', async () => {
      const { body } = await server.delete('/api/v1/resource/9999').set('Authorization', `Bearer ${token}`);
      expect(body.statusCode).toBe(404);
      expect(body.message).toBe('Resource not found');
    });

    test('Debe retornar 401 si el token está ausente', async () => {
      const { body } = await server.delete(`/api/v1/resource/1`).set('Authorization', '');
      expect(body.message).toBe('Unauthorized');
    });
  });
});

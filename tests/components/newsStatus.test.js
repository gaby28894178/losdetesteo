const request = require('supertest');
const app = require('../../src/app');

describe('NewsStatus Endpoints', () => {
  it('should retrieve all news statuses', async () => {
    const res = await request(app).get('/newsStatus');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Debería devolver un array
  });

  it('should create a new news status', async () => {
    const newStatus = { status: 'Published' };
    const res = await request(app).post('/newsStatus').send(newStatus);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe(newStatus.status);
  });

  it('should update a news status', async () => {
    const updatedStatus = { status: 'Draft' };
    const statusId = 1; // Cambia a un ID válido en tu base de datos
    const res = await request(app).put(`/newsStatus/${statusId}`).send(updatedStatus);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(updatedStatus.status);
  });

  it('should delete a news status', async () => {
    const statusId = 1; // Cambia a un ID válido
    const res = await request(app).delete(`/newsStatus/${statusId}`);
    expect(res.statusCode).toBe(204);
  });
});

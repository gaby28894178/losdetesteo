import { startServer, stopServer } from '../test-server'
import request from 'supertest'
import prisma from '../../../config/db'
import { createToken } from '../../../utils/jwt/createToken'

describe('Auth endpoint', () => {
  let baseUrl
  let server
  let token

  beforeAll(async () => {
    const testServer = await startServer()
    const address = testServer.address()
    baseUrl = `http://localhost:${address.port}`
    server = request(baseUrl)

    const user = await prisma.users.findFirst({ where: { email: 'admin@gmail.com' } })
    token = await createToken(user.id)
  })

  afterAll(async () => {
    await stopServer()
  })

  describe('POST /api/v1/auth/login', () => {
    test('Should log in with valid credentials', async () => {
      const credentials = { email: 'admin@gmail.com', password: 'password123' }
      const { body } = await server.post('/api/v1/auth/login').send(credentials)

      expect(body.statusCode).toBe(200)
      expect(body.data).toHaveProperty('token')
    })

    test('Should fail with invalid credentials', async () => {
      const credentials = { email: 'invalid@gmail.com', password: 'wrongPassword' }
      const { body } = await server.post('/api/v1/auth/login').send(credentials)

      expect(body.statusCode).toBe(401)
      expect(body.message).toBe('Invalid email or password')
    })

    test('Should handle missing fields gracefully', async () => {
      const credentials = { email: 'admin@gmail.com' }
      const { body } = await server.post('/api/v1/auth/login').send(credentials)

      expect(body.statusCode).toBe(400)
      expect(body.error[0]).toBe('"password" is required')
    })
  })
})

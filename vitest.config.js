import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js'], // Incluir todos los archivos de prueba en la carpeta tests
    exclude: ['tests/bin/**/*.js'], // Excluir archivos específicos si es necesario
    coverage: {
      provider: 'v8',
      reportsDirectory: './tests/coverage',
      reporter: ['text', 'html'] // Puedes generar reportes en varios formatos
    },
    setupFiles: path.resolve(__dirname, './tests/setupTest.js'),
  },
  resolve: {
    alias: {
      '@test-server': path.resolve(__dirname, './tests/test-server.js'),
      '@db': path.resolve(__dirname, './config/db.js'),
      '@createToken': path.resolve(__dirname, './src/utils/jwt/createToken.js')
    }
  }
});


// import { defineConfig } from 'vitest/config';
// import path from 'path';

// export default defineConfig({
//   test: {
//     environment: 'node',
//     globals: true,
//     include: ['tests/**/*.test.js'], // Incluir todos los archivos de prueba en la carpeta tests
//     exclude: ['tests/bin/**/*.js'], // Excluir archivos específicos si es necesario
//     coverage: {
//       provider: 'v8',
//       reportsDirectory: './tests/coverage',
//       reporter: ['text', 'html'] // Puedes generar reportes en varios formatos
//     },
//     setupFiles: path.resolve(__dirname, './tests/setupTest.js'),
//   },
//   resolve: {
//     alias: {
//       '@test-server': path.resolve(__dirname, 'tests/test-server'),
//       '@db': path.resolve(__dirname, 'config/db'),
//       '@createToken': path.resolve(__dirname, 'src/utils/jwt/createToken')
//     }
//   }
// });


// import { describe, it, expect, beforeAll, afterAll } from 'vitest';
// import request from 'supertest';
// import { startServer, stopServer } from '../test-server'; // Ajusta la ruta según sea necesario
// import prisma from '../../config/db'; // Conexión con la base de datos
// import { createToken } from '../utils/jwt/createToken'; // Función para crear tokens

// let server;
// let baseUrl;
// let token;

// beforeAll(async () => {
//   server = await startServer();
//   const address = server.address();
//   baseUrl = `http://localhost:${address.port}`;

//   // Obtener token de autenticación (ajusta según tu implementación)
//   const user = await prisma.users.findFirst({ where: { email: 'admin@gmail.com' } });
//   token = await createToken(user.id);
// });

// afterAll(async () => {
//   await stopServer();
// });

// describe('API Tests', () => {
//   const endpoints = [
//     '/auth',
//     '/news',
//     '/newsStatus',
//     '/note',
//     '/noteStatus',
//     '/question',
//     '/role',
//     '/userStatus'
//   ];

//   endpoints.forEach(endpoint => {
//     it(`should GET from ${endpoint}`, async () => {
//       const res = await request(baseUrl)
//         .get(endpoint)
//         .set('Authorization', `Bearer ${token}`);
//       expect(res.status).toBe(200);
//     });

//     it(`should POST to ${endpoint}`, async () => {
//       const res = await request(baseUrl)
//         .post(endpoint)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ key: 'value' }); // Ajusta según los datos requeridos
//       expect(res.status).toBe(201);
//       expect(res.body).toBeDefined();
//     });

//     it(`should PUT to ${endpoint}/:id`, async () => {
//       const postResponse = await request(baseUrl)
//         .post(endpoint)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ key: 'value' }); // Ajusta según los datos requeridos
//       const id = postResponse.body.id;

//       const res = await request(baseUrl)
//         .put(`${endpoint}/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ key: 'newValue' }); // Ajusta según los datos requeridos
//       expect(res.status).toBe(200);
//     });

//     it(`should DELETE from ${endpoint}/:id`, async () => {
//       const postResponse = await request(baseUrl)
//         .post(endpoint)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ key: 'value' }); // Ajusta según los datos requeridos
//       const id = postResponse.body.id;

//       const res = await request(baseUrl)
//         .delete(`${endpoint}/${id}`)
//         .set('Authorization', `Bearer ${token}`);
//       expect(res.status).toBe(200);
//     });
//   });
// });


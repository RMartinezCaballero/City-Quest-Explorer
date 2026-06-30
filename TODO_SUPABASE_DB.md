# Checklist: Backend con Supabase local sin Docker

- [x] Ejecutar Postgres local (no Docker) que escuche en `localhost:54322`.

- [x] Crear/usar base de datos `postgres` (o ajustar schema/model base en el connection string).

- [x] Asegurar usuario `postgres` y password correspondiente (ajustar `DATABASE_URL`).

- [x] Actual
izar `.env` para usar `DATABASE_URL` del Postgres local (ejemplo).

- [x] Correr migraciones con Prisma.

- [x] Reiniciar backend con `npm run start:dev`.

- [x] Verificar que el backend responde `GET http://localhost:3000/api` (Swagger).



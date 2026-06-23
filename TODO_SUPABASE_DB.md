# Checklist: Backend con Supabase local sin Docker

- [ ] Ejecutar Postgres local (no Docker) que escuche en `localhost:54322`.
- [ ] Crear/usar base de datos `postgres` (o ajustar schema/model base en el connection string).
- [ ] Asegurar usuario `postgres` y password correspondiente (ajustar `DATABASE_URL`).
- [ ] Actualizar `.env` para usar `DATABASE_URL` del Postgres local (ejemplo).
- [ ] Correr migraciones con Prisma.
- [ ] Reiniciar backend con `npm run start:dev`.
- [ ] Verificar que el backend responde `GET http://localhost:3000/api` (Swagger).


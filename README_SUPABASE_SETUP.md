# Setup rápido Supabase (Postgres) para City Quest Explorer

Este repo usa Prisma con `DATABASE_URL` (ver `prisma/schema.prisma`). Para usar Supabase, necesitas:
1) Crear un proyecto Supabase.
2) Usar el Postgres de Supabase.
3) Poner el `DATABASE_URL` de Supabase en un `.env` local.

> Ventaja: no cambia la lógica del backend; solo cambias el string de conexión.

---

## 1) Crear proyecto en Supabase
- Ir a https://supabase.com/
- Crear proyecto (Free).

---

## 2) Obtener `DATABASE_URL`
En Supabase:
- Project Settings → Database → Connection string
- Copia el `DATABASE_URL` (normalmente apunta a `db.<ref>.supabase.co`)

Ejemplo de formato:
```text
postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require
```

---

## 3) Configurar `.env`
Crea/edita `.env` en la raíz del repo:

```env
DATABASE_URL="postgresql://postgres:TOKEN@db.XXXX.supabase.co:5432/postgres?sslmode=require"
```

---

## 4) Migrar el esquema
Prisma ya trae el schema (`prisma/schema.prisma`). Para aplicar migraciones:
- `npm run prisma:generate`
- Si ya existe carpeta `prisma/migrations`, puedes usar:
  - `npm run prisma:migrate`

Si **no** hay migraciones, entonces primero crear migraciones:
- `npx prisma migrate dev --name init`
- Luego aplicar en prod/staging con `prisma migrate deploy`.

> Si Supabase no tiene extensión/permiso necesario, revisa logs.

---

## 5) Ejecutar backend
```bash
npm run start:dev
```

Si Prisma conecta, el Nest app levantará.

---

## 6) Verificar endpoints (smoke)
Una vez DB lista:
- Crear user/login
- Crear team
- Crear session
- Enviar eventos
- Consultar ranking

Registra evidencias en `CITY-QUEST-EXPLORER_QA_LOG.md`.

---

## Notas
- El backend actual ya soporta `EventType`: `QR_SCANNED`, `CHECKPOINT_REACHED`, `SESSION_FINISHED`.
- Asegúrate de que tu Supabase permita conexiones entrantes desde tu IP/entorno (en el dashboard).



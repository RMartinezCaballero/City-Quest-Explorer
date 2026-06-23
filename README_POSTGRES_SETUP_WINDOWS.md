# Setup rápido de PostgreSQL (Windows) para City Quest Explorer

Este repo usa Prisma con `DATABASE_URL` (en `prisma/schema.prisma`). Para poder ejecutar el backend (smoke/e2e), necesitas **PostgreSQL corriendo localmente** y accesible en `localhost:5432`.

> Objetivo: dejar Postgres listo sin Docker.

---

## 1) Instalar PostgreSQL
**Opción recomendada (rápida):**
- Instala **PostgreSQL** desde: https://www.postgresql.org/download/windows/
- Durante el instalador:
  - Guarda/recuerda:
    - `usuario` (default suele ser `postgres`)
    - `contraseña`
    - puerto (ideal: **5432**)
    - nombre de la DB (ideal: **city_quest_explorer**; si no, puedes crearla después)

Verifica que el servicio quede activo:
- `services.msc` → “PostgreSQL” (estado: en ejecución)

---

## 2) Crear base de datos (si hace falta)
Abre **SQL Shell (psql)** o usa el PGAdmin.

Ejemplo (en psql):
```sql
CREATE DATABASE city_quest_explorer;
```

---

## 3) Configurar `DATABASE_URL`
En este proyecto, Prisma lee:
- `env("DATABASE_URL")`

Crea un archivo **`.env`** en la raíz del repo (`d:/Projects/City Quest Explorer/.env`):

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/city_quest_explorer?schema=public"
```

> Ajusta `TU_PASSWORD` si en el instalador usaste otro.

---

## 4) Probar conectividad
En una terminal:
```bash
psql -h localhost -p 5432 -U postgres -d city_quest_explorer
```
Si entra, el backend podrá inicializar Prisma.

---

## 5) Reintentar el backend
En la raíz del repo:
```bash
npm run start:dev
```

Si Prisma conecta, Nest volverá a levantar y ya podrás ejecutar el smoke flow:
- Team → Session → events → ranking

---

## 6) Comandos Prisma recomendados (opcional)
```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## Si algo falla
- Error típico: `Can't reach database server at localhost:5432`
  - Verifica que el servicio esté corriendo
  - Verifica puerto 5432 en la instalación
  - Verifica firewall (a veces bloquea localhost)



# City_Quest_Explorer_DevOps_Deployment - DevOps Engineer

Este archivo registra la estrategia de despliegue y automatización para **City Quest Explorer** usando servicios gratuitos (o de bajo costo).

## Objetivo
Desplegar City Quest Explorer usando servicios gratuitos, con:
- DEV / QA / PROD
- CI/CD
- Backups
- Monitoreo
- Logs
- Optimización de costos

## Infraestructura (propuesta)
- GitHub (source control)
- Render (hosting)
- Vercel (frontend NextJS / assets si aplica)
- Neon (PostgreSQL serverless)

## Entornos
- DEV
  - ramas: `develop` o feature branches
  - variables: uso de DB Neon DEV
- QA
  - despliegue automático desde una rama `qa` o tag
  - DB Neon QA separada
- PROD
  - despliegue desde `main`
  - DB Neon PROD

## Diseño de pipeline (CI/CD)
- Build backend (NestJS/TS)
- Lint/Typecheck (si aplica)
- Tests (si existen)
- Build docker image **si aplica** (si Docker no está disponible local, usar build remoto)
- Deploy automático en Render
- Deploy de frontend en Vercel

## Automatizar
### Backups
- Neon backups automáticos (configurar retención)
- Export programado (si aplica): nightly + retention

### Monitoreo
- Métricas básicas en Render
- Alertas por:
  - errores 5xx
  - latencia p95
  - caída de salud/healthcheck

### Logs
- Logs centralizados del backend (Render)
- Captura de request-id / correlation-id

## Optimización de costos
- Usar instancias pequeñas en DEV/QA
- Reducir frecuencia de jobs costosos (backups/exports)
- Habilitar escalado mínimo en Render

## Checklist de documentación (para cada release)
- [ ] Versiones y tags (GitHub)
- [ ] Variables de entorno usadas (Render/Vercel/Neon)
- [ ] Comandos ejecutados (build/test/migrate)
- [ ] Resultado (URL dev/qa/prod)
- [ ] Post-mortem si falló

---

> WA log equivalente para DevOps. Convención: `City_Quest_Explorer_*`.


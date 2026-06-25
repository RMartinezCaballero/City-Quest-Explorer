/**
 * Smoke Tests E2E — City Quest Explorer API
 *
 * Ejecutar con: npx jest --no-coverage src/__tests__/smoke/api.smoke.spec.ts
 * Requiere: backend corriendo en localhost:3000
 *
 * Prueba todos los endpoints críticos y el flujo completo:
 *   Login → Sesión Solo → QR → Checkpoint → Finalizar → Ranking
 */
import { describe, expect, test, beforeAll, afterAll, jest } from '@jest/globals';

// Timeout ampliado para Supabase free tier (latencia ~5s por operación)
jest.setTimeout(30000);

// ── Config ──────────────────────────────────────────
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ylyajclxleqkfdpyregz.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseWFqY2x4bGVxa2ZkcHlyZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzMzNjYsImV4cCI6MjA5NjYwOTM2Nn0.ReYTDJ_o2PhItbPMrevd5UWGai26otd9G6FQDW1d3cc';

// IDs determinísticos del seed (prisma/seed.ts)
const CITY_ID = '550e8400-e29b-41d4-a716-446655440001';
const ROUTE_ID = '550e8400-e29b-41d4-a716-446655440010';
const CHECKPOINT_1_ID = '550e8400-e29b-41d4-a716-446655440101';
const QR_CODE_1 = 'CQE-MP-01-CARTAGENA';

// ── Helpers ─────────────────────────────────────────
async function api(path: string, options?: RequestInit) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body, headers: res.headers };
}

let accessToken: string | null = null;
let testUserId: string | null = null;
let sessionId: string | null = null;
let teamId: string | null = null;

const TEST_EMAIL = `test-${Date.now()}@cityquest-e2e.test`;
const TEST_PASSWORD = 'SmokeTest2026!';

// ── E2E: Setup: crear usuario Supabase ──
beforeAll(async () => {
  // Crear usuario de prueba en Supabase Auth
  const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });
  const signupData = await signupRes.json() as Record<string, unknown>;
  expect(signupRes.status).toBe(200);

  // En desarrollo (confirmations deshabilitado) devuelve access_token directo
  accessToken = (signupData.access_token as string) ?? null;

  if (!accessToken) {
    // Si confirmación está habilitada, iniciar sesión
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });
    const loginData = await loginRes.json() as Record<string, unknown>;
    accessToken = loginData.access_token as string;
  }

  expect(accessToken).toBeTruthy();
  console.log(`  ✅ Usuario creado: ${TEST_EMAIL}`);
});

afterAll(async () => {
  // Limpieza: eliminar usuario de prueba de Supabase (si hay service_role disponible)
  if (accessToken) {
    // Cerrar sesión
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  console.log('  🧹 Limpieza completada');
});

function authHeaders(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

// ═══════════════════════════════════════════════════════
//  BLOQUE 1: Endpoints Públicos
// ═══════════════════════════════════════════════════════

describe('🏛️  Endpoints Públicos', () => {
  test('GET /cities — lista ciudades (contiene Cartagena)', async () => {
    const { status, body } = await api('/cities');
    expect(status).toBe(200);
    const cities = body as Array<Record<string, unknown>>;
    expect(cities.length).toBeGreaterThanOrEqual(1);
    expect(cities[0].name).toContain('Cartagena');
  });

  test('GET /cities/:id — detalle de ciudad', async () => {
    const { status, body } = await api(`/cities/${CITY_ID}`);
    expect(status).toBe(200);
    const city = body as Record<string, unknown>;
    expect(city.id).toBe(CITY_ID);
    expect(city.name).toContain('Cartagena');
  });

  test('GET /cities/:cityId/routes — ruta con 5 checkpoints', async () => {
    const { status, body } = await api(`/cities/${CITY_ID}/routes`);
    expect(status).toBe(200);
    const routes = body as Array<Record<string, unknown>>;
    expect(routes).toHaveLength(1);
    expect((routes[0].checkpoints as Array<unknown>)).toHaveLength(5);
  });

  test('GET /cities/:cityId/routes/:routeId — detalle de ruta', async () => {
    const { status, body } = await api(`/cities/${CITY_ID}/routes/${ROUTE_ID}`);
    expect(status).toBe(200);
    const route = body as Record<string, unknown>;
    expect(route.id).toBe(ROUTE_ID);
  });

  test('GET /routes/:routeId/rankings — lista de rankings', async () => {
    const { status, body } = await api(`/routes/${ROUTE_ID}/rankings`);
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /api — Swagger UI disponible', async () => {
    const res = await fetch(`${BASE_URL}/api`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('swagger');
    expect(res.headers.get('content-type')).toContain('text/html');
  });
});

// ═══════════════════════════════════════════════════════
//  BLOQUE 2: Endpoints Protegidos (401 sin token)
// ═══════════════════════════════════════════════════════

describe('🔒  Endpoints Protegidos (401)', () => {
  const protectedEndpoints = [
    { method: 'GET', path: '/users/me', body: undefined },
    { method: 'POST', path: '/games/sessions', body: { teamId: 'any', routeId: ROUTE_ID, cityId: CITY_ID } },
    { method: 'POST', path: '/games/solo/sessions', body: { routeId: ROUTE_ID, cityId: CITY_ID } },
    { method: 'POST', path: '/games/sessions/fake-id/events', body: { eventType: 'LOCATION_UPDATE', eventData: {} } },
    { method: 'POST', path: '/cities', body: { name: 'Test', slug: 'test', country: 'Test' } },
  ] as const;

  test.each(protectedEndpoints)('$method $path → 401 sin token', async ({ method, path, body }) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════
//  BLOQUE 3: Endpoints Protegidos (con token — funcionan)
// ═══════════════════════════════════════════════════════

describe('🔑  Endpoints Protegidos (con token)', () => {
  test('GET /users/me — devuelve perfil del usuario autenticado', async () => {
    const { status, body } = await api('/users/me', {
      headers: authHeaders(),
    });
    expect(status).toBe(200);
    const user = body as Record<string, unknown>;
    expect(user.email).toBe(TEST_EMAIL);
    testUserId = user.id as string;
  });

  test('PATCH /users/me — actualiza perfil', async () => {
    const { status, body } = await api('/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ name: 'Test E2E Player' }),
    });
    expect(status).toBe(200);
    const user = body as Record<string, unknown>;
    expect(user.name).toBe('Test E2E Player');
  });
});

// ═══════════════════════════════════════════════════════
//  BLOQUE 4: Flujo E2E Completo
// ═══════════════════════════════════════════════════════

describe('🎮  Flujo E2E — Sesión Solo → Eventos → Ranking', () => {
  test('POST /games/solo/sessions — crear sesión solo', async () => {
    const { status, body } = await api('/games/solo/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ routeId: ROUTE_ID, cityId: CITY_ID }),
    });
    expect(status).toBe(201);
    const session = body as Record<string, unknown>;
    expect(session.status).toBe('ACTIVE');
    expect(session.score).toBe(0);
    expect((session.team as Record<string, unknown>).captainId).toBeTruthy();

    sessionId = session.id as string;
    teamId = (session.team as Record<string, unknown>).id as string;
    console.log(`  ✅ Sesión creada: ${sessionId}`);
    console.log(`  ✅ Equipo: ${teamId}`);
  });

  test('POST /games/sessions/:id/events — CHECKPOINT_REACHED (+10 pts)', async () => {
    expect(sessionId).toBeTruthy();

    const { status, body } = await api(`/games/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        eventType: 'CHECKPOINT_REACHED',
        eventData: { checkpointName: 'Torre del Reloj' },
        checkpointId: CHECKPOINT_1_ID,
      }),
    });
    expect(status).toBe(201);
    expect((body as Record<string, unknown>).eventType).toBe('CHECKPOINT_REACHED');
    console.log('  ✅ Checkpoint 1 alcanzado (+10 pts)');
  });

  test('POST /games/sessions/:id/events — QR_SCANNED (+15 pts)', async () => {
    expect(sessionId).toBeTruthy();

    const { status, body } = await api(`/games/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        eventType: 'QR_SCANNED',
        eventData: { qrCode: QR_CODE_1 },
      }),
    });
    expect(status).toBe(201);
    expect((body as Record<string, unknown>).eventType).toBe('QR_SCANNED');
    console.log('  ✅ QR escaneado (+15 pts)');
  });

  test('POST /games/sessions/:id/events — mismo QR no duplica puntos (idempotencia)', async () => {
    expect(sessionId).toBeTruthy();

    const { status } = await api(`/games/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        eventType: 'QR_SCANNED',
        eventData: { qrCode: QR_CODE_1 },
      }),
    });
    expect(status).toBe(201);
    console.log('  ✅ QR duplicado — evento aceptado pero sin puntos dobles');
  });

  test('POST /games/sessions/:id/events — mismo checkpoint no duplica puntos', async () => {
    expect(sessionId).toBeTruthy();

    const { status } = await api(`/games/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        eventType: 'CHECKPOINT_REACHED',
        eventData: { checkpointName: 'Torre del Reloj' },
        checkpointId: CHECKPOINT_1_ID,
      }),
    });
    expect(status).toBe(201);
    console.log('  ✅ Checkpoint duplicado — evento aceptado sin puntos dobles');
  });

  test('GET /games/sessions/:sessionId — verificar score acumulado', async () => {
    expect(sessionId).toBeTruthy();

    const { status, body } = await api(`/games/sessions/${sessionId}`);
    expect(status).toBe(200);
    const session = body as Record<string, unknown>;
    // Total: checkpoint(+10) + QR(+15) = 25 (sin duplicados)
    expect(session.score).toBe(25);
    console.log(`  ✅ Score actual: ${session.score} pts`);
  });

  test('POST /games/sessions/:id/events — SESSION_FINISHED (+100 pts)', async () => {
    expect(sessionId).toBeTruthy();

    const { status, body } = await api(`/games/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        eventType: 'SESSION_FINISHED',
        eventData: { reason: 'Misión completada' },
      }),
    });
    expect(status).toBe(201);
    expect((body as Record<string, unknown>).eventType).toBe('SESSION_FINISHED');
    console.log('  ✅ Sesión finalizada (+100 pts)');
  });

  test('POST /games/sessions/:id/events — SESSION_FINISHED segunda vez es rechazada', async () => {
    expect(sessionId).toBeTruthy();

    const { status } = await api(`/games/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        eventType: 'SESSION_FINISHED',
        eventData: { reason: 'Intento duplicado' },
      }),
    });
    // Debería rechazar porque la sesión ya está COMPLETED
    expect(status).toBe(404);
    console.log('  ✅ SESSION_FINISHED duplicado rechazado (404)');
  });

  test('GET /games/sessions/:sessionId — score final = 125', async () => {
    expect(sessionId).toBeTruthy();

    const { status, body } = await api(`/games/sessions/${sessionId}`);
    expect(status).toBe(200);
    const session = body as Record<string, unknown>;
    // 10 (checkpoint) + 15 (QR) + 100 (misión) = 125
    expect(session.score).toBe(125);
    expect(session.status).toBe('COMPLETED');
    console.log(`  ✅ Score final: ${session.score} pts, Status: ${session.status}`);
  });

  test('POST /routes/:routeId/rankings — crear ranking', async () => {
    expect(teamId).toBeTruthy();

    const { status, body } = await api(`/routes/${ROUTE_ID}/rankings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        teamId,
        score: 125,
        position: 1,
      }),
    });
    expect(status).toBe(201);
    expect((body as Record<string, unknown>).score).toBe(125);
    console.log('  ✅ Ranking creado');
  });

  test('GET /routes/:routeId/rankings — ranking refleja el score', async () => {
    const { status, body } = await api(`/routes/${ROUTE_ID}/rankings`);
    expect(status).toBe(200);
    const rankings = body as Array<Record<string, unknown>>;
    expect(rankings.length).toBeGreaterThanOrEqual(1);
    const topRanking = rankings[0];
    expect(topRanking.score).toBe(125);
    expect(topRanking.position).toBe(1);
    console.log('  ✅ Ranking actualizado correctamente');
  });
});

// ═══════════════════════════════════════════════════════
//  BLOQUE 5: Health Check
// ═══════════════════════════════════════════════════════

describe('💚  Health Check', () => {
  test('Servidor responde en puerto 3000', async () => {
    const res = await fetch(`${BASE_URL}/api`);
    expect(res.status).toBe(200);
  });

  test('Supabase conectado (vía endpoint público)', async () => {
    const { status } = await api('/cities');
    expect(status).toBe(200);
  });
});

-- ============================================================
-- RLS Policies for City Quest Explorer
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "City" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Route" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Checkpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QRCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GameSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SessionEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ranking" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 1. User: solo ve su propio perfil
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON "User" FOR SELECT
  USING (auth.uid()::text = "supabaseUserId");

CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING (auth.uid()::text = "supabaseUserId");

-- ============================================================
-- 2. City: lectura pública, escritura solo admin
-- ============================================================
CREATE POLICY "Cities are public read"
  ON "City" FOR SELECT
  USING (true);

CREATE POLICY "Cities are admin write"
  ON "City" FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'supabase_admin');

-- ============================================================
-- 3. Route: pública lectura
-- ============================================================
CREATE POLICY "Routes are public read"
  ON "Route" FOR SELECT
  USING (true);

-- ============================================================
-- 4. Checkpoint: pública lectura
-- ============================================================
CREATE POLICY "Checkpoints are public read"
  ON "Checkpoint" FOR SELECT
  USING (true);

-- ============================================================
-- 5. QRCode: pública lectura
-- ============================================================
CREATE POLICY "QRCodes are public read"
  ON "QRCode" FOR SELECT
  USING (true);

-- ============================================================
-- 6. Team: miembros ven su equipo, captain puede crear/editar
-- ============================================================
CREATE POLICY "Teams are viewable by members"
  ON "Team" FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT "userId" FROM "TeamMember" WHERE "teamId" = id
    )
  );

CREATE POLICY "Teams can be created by any authenticated user"
  ON "Team" FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 7. TeamMember: miembros ven su membresía
-- ============================================================
CREATE POLICY "TeamMembers viewable by own user"
  ON "TeamMember" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "TeamMembers insertable by captain"
  ON "TeamMember" FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (
      SELECT "captainId" FROM "Team" WHERE id = "teamId"
    )
  );

-- ============================================================
-- 8. GameSession: equipo ve sus sesiones
-- ============================================================
CREATE POLICY "Sessions viewable by team members"
  ON "GameSession" FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT "userId" FROM "TeamMember" WHERE "teamId" = "teamId"
    )
  );

CREATE POLICY "Sessions insertable by team members"
  ON "GameSession" FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (
      SELECT "userId" FROM "TeamMember" WHERE "teamId" = "teamId"
    )
  );

-- ============================================================
-- 9. SessionEvent: visible para miembros del equipo
-- ============================================================
CREATE POLICY "Events viewable by session team members"
  ON "SessionEvent" FOR SELECT
  USING (
    "sessionId" IN (
      SELECT id FROM "GameSession" WHERE "teamId" IN (
        SELECT "teamId" FROM "TeamMember" WHERE "userId" = auth.uid()::text
      )
    )
  );

-- ============================================================
-- 10. Ranking: público (todos ven el leaderboard)
-- ============================================================
CREATE POLICY "Rankings are public read"
  ON "Ranking" FOR SELECT
  USING (true);

-- ============================================================
-- NOTA: NestJS se conecta con service_role key, que BYPASSEA RLS.
-- Estas políticas protegen ACCESOS DIRECTOS a Supabase (anónimos).
-- NestJS maneja su propia autorización via JWT + guards.
-- ============================================================

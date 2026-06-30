-- ============================================================
-- RLS Policies for City Quest Explorer
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- 
-- NOTA: Las columnas 'supabaseUserId', 'userId', 'captainId', 'teamId'
--       son tipo uuid en PostgreSQL. auth.uid() también es uuid.
--       Usamos ::text en AMBOS lados para comparación segura.
-- ============================================================

-- Enable RLS on all tables (incluyendo nuevas)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "City" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Game" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Story" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Route" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Mission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Checkpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QRCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Challenge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChallengeAnswer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UnlockKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StoryEnding" ENABLE ROW LEVEL SECURITY;
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
  USING (auth.uid()::text = "supabaseUserId"::text);

CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING (auth.uid()::text = "supabaseUserId"::text);

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
-- 3. Game: pública lectura
-- ============================================================
CREATE POLICY "Games are public read"
  ON "Game" FOR SELECT
  USING (true);

-- ============================================================
-- 4. Story: pública lectura
-- ============================================================
CREATE POLICY "Stories are public read"
  ON "Story" FOR SELECT
  USING (true);

-- ============================================================
-- 5. Route: pública lectura
-- ============================================================
CREATE POLICY "Routes are public read"
  ON "Route" FOR SELECT
  USING (true);

-- ============================================================
-- 6. Mission: pública lectura
-- ============================================================
CREATE POLICY "Missions are public read"
  ON "Mission" FOR SELECT
  USING (true);

-- ============================================================
-- 7. Checkpoint: pública lectura
-- ============================================================
CREATE POLICY "Checkpoints are public read"
  ON "Checkpoint" FOR SELECT
  USING (true);

-- ============================================================
-- 8. QRCode: pública lectura
-- ============================================================
CREATE POLICY "QRCodes are public read"
  ON "QRCode" FOR SELECT
  USING (true);

-- ============================================================
-- 9. Challenge: pública lectura
-- ============================================================
CREATE POLICY "Challenges are public read"
  ON "Challenge" FOR SELECT
  USING (true);

-- ============================================================
-- 10. ChallengeAnswer: pública lectura
-- ============================================================
CREATE POLICY "ChallengeAnswers are public read"
  ON "ChallengeAnswer" FOR SELECT
  USING (true);

-- ============================================================
-- 11. UnlockKey: solo lectura por token válido
-- ============================================================
CREATE POLICY "UnlockKeys are readable by valid token"
  ON "UnlockKey" FOR SELECT
  USING ("usedAt" IS NULL AND ("expiresAt" IS NULL OR "expiresAt" > now()));

-- ============================================================
-- 12. StoryEnding: pública lectura
-- ============================================================
CREATE POLICY "StoryEndings are public read"
  ON "StoryEnding" FOR SELECT
  USING (true);

-- ============================================================
-- 13. Team: miembros ven su equipo, captain puede crear/editar
-- ============================================================
CREATE POLICY "Teams are viewable by members"
  ON "Team" FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT "userId"::text FROM "TeamMember" WHERE "teamId" = id
    )
  );

CREATE POLICY "Teams can be created by any authenticated user"
  ON "Team" FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 14. TeamMember: miembros ven su membresía
-- ============================================================
CREATE POLICY "TeamMembers viewable by own user"
  ON "TeamMember" FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "TeamMembers insertable by captain"
  ON "TeamMember" FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (
      SELECT "captainId"::text FROM "Team" WHERE id = "teamId"
    )
  );

-- ============================================================
-- 15. GameSession: equipo ve sus sesiones
-- ============================================================
CREATE POLICY "Sessions viewable by team members"
  ON "GameSession" FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT "userId"::text FROM "TeamMember" 
      WHERE "TeamMember"."teamId" = "GameSession"."teamId"
    )
  );

CREATE POLICY "Sessions insertable by team members"
  ON "GameSession" FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (
      SELECT "userId"::text FROM "TeamMember" 
      WHERE "TeamMember"."teamId" = "GameSession"."teamId"
    )
  );

-- ============================================================
-- 16. SessionEvent: visible para miembros del equipo
-- ============================================================
CREATE POLICY "Events viewable by session team members"
  ON "SessionEvent" FOR SELECT
  USING (
    "sessionId" IN (
      SELECT id FROM "GameSession" WHERE "teamId" IN (
        SELECT "teamId" FROM "TeamMember" WHERE "userId"::text = auth.uid()::text
      )
    )
  );

-- ============================================================
-- 17. Ranking: público (todos ven el leaderboard)
-- ============================================================
CREATE POLICY "Rankings are public read"
  ON "Ranking" FOR SELECT
  USING (true);

-- ============================================================
-- NOTA: NestJS se conecta con service_role key, que BYPASSEA RLS.
-- Estas políticas protegen ACCESOS DIRECTOS a Supabase (anónimos).
-- NestJS maneja su propia autorización via JWT + guards.
-- ============================================================

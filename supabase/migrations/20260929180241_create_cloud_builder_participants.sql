/*
# Cloud Builder Challenge — Participants Table

## Purpose
Stores participant registration and full challenge state for the Cloud Builder Challenge,
an educational AWS simulation. Each row is one participant's complete journey through
four connected cloud missions.

## New Tables
- `cloud_builder_participants`
  - `id` (uuid, PK) — unique participant ID generated at registration
  - `name` (text) — participant's full name
  - `college_id` (text, unique) — college ID number, used to resume progress
  - `challenge_started_at` (timestamptz) — when the challenge was started
  - `current_step` (int, default 0) — which mission the participant is on (0=registered, 1-4=missions, 5=complete)
  - `completed_steps` (int[], default '{}') — array of completed mission numbers [1,2,3,4]
  - `total_score` (int, default 0) — calculated score (0-100)
  - `challenge_completed` (boolean, default false)
  - `completed_at` (timestamptz, nullable) — when all 4 missions were finished
  - `server_data` (jsonb, nullable) — Mission 1: { name, size, serverId, cpu, memory, status }
  - `storage_data` (jsonb, nullable) — Mission 2: { bucketName, connectedServerId, fileName, fileSize, completedAt }
  - `database_data` (jsonb, nullable) — Mission 3: { dbName, html, css, completedAt }
  - `hosting_data` (jsonb, nullable) — Mission 4: { deployedAt, url }
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Security
- RLS enabled.
- This is a no-auth educational event app (no sign-in screen). The anon-key client needs
  to read and write participant rows. Policies use `TO anon, authenticated` with `USING (true)`
  because the data is intentionally shared/public for this event simulation.
- Score is NOT trusted from the client — the app recalculates score from actual mission
  completion state (20+20+20+30=100) before writing.

## Important Notes
1. `college_id` has a UNIQUE constraint so returning participants resume their existing row.
2. No passwords, AWS credentials, or API keys are stored.
3. The `server_data`, `storage_data`, `database_data`, and `hosting_data` JSONB columns
   hold the full simulated cloud resource state, making the four missions feel connected.
*/

CREATE TABLE IF NOT EXISTS cloud_builder_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  college_id text NOT NULL,
  challenge_started_at timestamptz DEFAULT now(),
  current_step int NOT NULL DEFAULT 0,
  completed_steps int[] NOT NULL DEFAULT '{}',
  total_score int NOT NULL DEFAULT 0,
  challenge_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  server_data jsonb,
  storage_data jsonb,
  database_data jsonb,
  hosting_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint on college_id so duplicates resume instead of creating new rows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cloud_builder_participants_college_id_key'
  ) THEN
    ALTER TABLE cloud_builder_participants ADD CONSTRAINT cloud_builder_participants_college_id_key UNIQUE (college_id);
  END IF;
END $$;

-- Index for fast lookup by college_id
CREATE INDEX IF NOT EXISTS idx_cloud_builder_participants_college_id
  ON cloud_builder_participants(college_id);

-- Index for leaderboard ordering
CREATE INDEX IF NOT EXISTS idx_cloud_builder_participants_score_completed
  ON cloud_builder_participants(challenge_completed, total_score, completed_at);

ALTER TABLE cloud_builder_participants ENABLE ROW LEVEL SECURITY;

-- No-auth event app: anon + authenticated can CRUD (intentionally public/shared data)
DROP POLICY IF EXISTS "anon_select_participants" ON cloud_builder_participants;
CREATE POLICY "anon_select_participants"
  ON cloud_builder_participants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_participants" ON cloud_builder_participants;
CREATE POLICY "anon_insert_participants"
  ON cloud_builder_participants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_participants" ON cloud_builder_participants;
CREATE POLICY "anon_update_participants"
  ON cloud_builder_participants FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_participants" ON cloud_builder_participants;
CREATE POLICY "anon_delete_participants"
  ON cloud_builder_participants FOR DELETE
  TO anon, authenticated USING (true);

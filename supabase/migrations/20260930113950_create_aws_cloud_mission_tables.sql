/*
# AWS Cloud Mission - Database Schema

1. Purpose
- Educational AWS simulation game. Stores participant registration, mission progress,
  scores, leaderboard data, and architecture attempts. No AWS credentials are stored.
- This is a no-auth app (no sign-in screen) — participants register with name + college_id
  and receive a generated participant_id. The anon-key client must be able to read/write.

2. New Tables
- `participants`
  - id (uuid PK)
  - participant_id (text, unique, generated client-side UUID for resume-by-college-id)
  - name (text, not null)
  - college_id (text, not null)
  - started_at (timestamptz, default now)
  - current_mission (int, default 1)
  - score (int, default 0)
  - status (text, default 'in_progress' — 'in_progress' | 'completed')
  - completed_at (timestamptz, nullable)
- `mission_progress`
  - id (uuid PK)
  - participant_id (text, references participants(participant_id) ON DELETE CASCADE)
  - mission_id (int, not null)
  - completed (boolean, default false)
  - score (int, default 0)
  - attempts (int, default 0)
  - hints_used (int, default 0)
  - completed_at (timestamptz, nullable)
- `architecture_attempts`
  - id (uuid PK)
  - participant_id (text, references participants(participant_id) ON DELETE CASCADE)
  - attempt_data (jsonb, not null)
  - score (int, default 0)
  - created_at (timestamptz, default now)

3. Security
- Enable RLS on all tables.
- This is a no-auth app (no sign-in screen). All policies use TO anon, authenticated
  with USING (true) / WITH CHECK (true) because the data is intentionally public/shared
  for this educational event. College IDs are not exposed on the leaderboard by app logic.
*/

CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id text UNIQUE NOT NULL,
  name text NOT NULL,
  college_id text NOT NULL,
  started_at timestamptz DEFAULT now(),
  current_mission int NOT NULL DEFAULT 1,
  score int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress',
  completed_at timestamptz
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_participants" ON participants;
CREATE POLICY "anon_select_participants" ON participants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_participants" ON participants;
CREATE POLICY "anon_insert_participants" ON participants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_participants" ON participants;
CREATE POLICY "anon_update_participants" ON participants FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_participants" ON participants;
CREATE POLICY "anon_delete_participants" ON participants FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS mission_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id text NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  mission_id int NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  score int NOT NULL DEFAULT 0,
  attempts int NOT NULL DEFAULT 0,
  hints_used int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(participant_id, mission_id)
);

ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_mission_progress" ON mission_progress;
CREATE POLICY "anon_select_mission_progress" ON mission_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mission_progress" ON mission_progress;
CREATE POLICY "anon_insert_mission_progress" ON mission_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_mission_progress" ON mission_progress;
CREATE POLICY "anon_update_mission_progress" ON mission_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_mission_progress" ON mission_progress;
CREATE POLICY "anon_delete_mission_progress" ON mission_progress FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS architecture_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id text NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  attempt_data jsonb NOT NULL,
  score int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE architecture_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_architecture_attempts" ON architecture_attempts;
CREATE POLICY "anon_select_architecture_attempts" ON architecture_attempts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_architecture_attempts" ON architecture_attempts;
CREATE POLICY "anon_insert_architecture_attempts" ON architecture_attempts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_architecture_attempts" ON architecture_attempts;
CREATE POLICY "anon_update_architecture_attempts" ON architecture_attempts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_architecture_attempts" ON architecture_attempts;
CREATE POLICY "anon_delete_architecture_attempts" ON architecture_attempts FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_participants_college_id ON participants(college_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_participant ON mission_progress(participant_id);
CREATE INDEX IF NOT EXISTS idx_architecture_attempts_participant ON architecture_attempts(participant_id);

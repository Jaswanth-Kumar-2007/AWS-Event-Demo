import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export interface Participant {
  id: string;
  participant_id: string;
  name: string;
  college_id: string;
  started_at: string;
  current_mission: number;
  score: number;
  status: 'in_progress' | 'completed';
  completed_at: string | null;
}

export interface MissionProgress {
  id: string;
  participant_id: string;
  mission_id: number;
  completed: boolean;
  score: number;
  attempts: number;
  hints_used: number;
  completed_at: string | null;
}

export interface ArchitectureAttempt {
  id: string;
  participant_id: string;
  attempt_data: Record<string, unknown>;
  score: number;
  created_at: string;
}

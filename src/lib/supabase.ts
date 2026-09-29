import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ServerData {
  name: string;
  size: 'Small' | 'Medium';
  serverId: string;
  cpu: number;
  memory: number;
  status: string;
}

export interface StorageData {
  bucketName: string;
  connectedServerId: string;
  fileName: string;
  fileSize: number;
  fileDataUrl: string;
  completedAt: string;
}

export interface DatabaseData {
  dbName: string;
  html: string;
  css: string;
  completedAt: string;
}

export interface HostingData {
  deployedAt: string;
  url: string;
}

export interface Participant {
  id: string;
  name: string;
  college_id: string;
  challenge_started_at: string;
  current_step: number;
  completed_steps: number[];
  total_score: number;
  challenge_completed: boolean;
  completed_at: string | null;
  server_data: ServerData | null;
  storage_data: StorageData | null;
  database_data: DatabaseData | null;
  hosting_data: HostingData | null;
  created_at: string;
  updated_at: string;
}

export type ParticipantInsert = {
  name: string;
  college_id: string;
  challenge_started_at: string;
  current_step: number;
  completed_steps: number[];
  total_score: number;
  challenge_completed: boolean;
};

export type ParticipantUpdate = {
  current_step?: number;
  completed_steps?: number[];
  total_score?: number;
  challenge_completed?: boolean;
  completed_at?: string | null;
  server_data?: ServerData | null;
  storage_data?: StorageData | null;
  database_data?: DatabaseData | null;
  hosting_data?: HostingData | null;
  updated_at?: string;
};

export function calculateScore(
  server: ServerData | null,
  storage: StorageData | null,
  database: DatabaseData | null,
  hosting: HostingData | null
): number {
  let score = 0;
  if (server) score += 20;
  if (storage) score += 20;
  if (database) score += 20;
  if (hosting) score += 40;
  return score;
}

export function getCompletedSteps(
  server: ServerData | null,
  storage: StorageData | null,
  database: DatabaseData | null,
  hosting: HostingData | null
): number[] {
  const steps: number[] = [];
  if (server) steps.push(1);
  if (storage) steps.push(2);
  if (database) steps.push(3);
  if (hosting) steps.push(4);
  return steps;
}

export function getCurrentStep(
  server: ServerData | null,
  storage: StorageData | null,
  database: DatabaseData | null,
  hosting: HostingData | null
): number {
  if (hosting) return 5;
  if (database) return 4;
  if (storage) return 3;
  if (server) return 2;
  return 1;
}

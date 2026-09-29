import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  supabase,
  type Participant,
  type ParticipantUpdate,
  type ServerData,
  type StorageData,
  type DatabaseData,
  type HostingData,
  calculateScore,
  getCompletedSteps,
  getCurrentStep,
} from '@/lib/supabase';

interface ChallengeContextValue {
  participant: Participant | null;
  loading: boolean;
  error: string | null;
  register: (name: string, collegeId: string) => Promise<void>;
  resumeByCollegeId: (collegeId: string) => Promise<boolean>;
  saveServer: (data: ServerData) => Promise<void>;
  saveStorage: (data: StorageData) => Promise<void>;
  saveDatabase: (data: DatabaseData) => Promise<void>;
  saveHosting: (data: HostingData) => Promise<void>;
  resetProgress: () => Promise<void>;
  signOut: () => void;
}

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

const STORAGE_KEY = 'cloud_builder_participant_id';

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-resume from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (!savedId) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('cloud_builder_participants')
        .select('*')
        .eq('id', savedId)
        .maybeSingle();
      if (data) {
        setParticipant(data as Participant);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setLoading(false);
    })();
  }, []);

  const updateParticipant = useCallback(async (id: string, updates: ParticipantUpdate) => {
    const { data, error: err } = await supabase
      .from('cloud_builder_participants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (err) {
      setError(err.message);
      return;
    }
    if (data) setParticipant(data as Participant);
  }, []);

  const register = useCallback(async (name: string, collegeId: string) => {
    setError(null);
    // Check if college_id already exists
    const { data: existing } = await supabase
      .from('cloud_builder_participants')
      .select('*')
      .eq('college_id', collegeId)
      .maybeSingle();

    if (existing) {
      // Resume existing
      const p = existing as Participant;
      localStorage.setItem(STORAGE_KEY, p.id);
      setParticipant(p);
      return;
    }

    // Create new
    const { data, error: err } = await supabase
      .from('cloud_builder_participants')
      .insert({
        name,
        college_id: collegeId,
        challenge_started_at: new Date().toISOString(),
        current_step: 1,
        completed_steps: [],
        total_score: 0,
        challenge_completed: false,
      })
      .select()
      .maybeSingle();

    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      const p = data as Participant;
      localStorage.setItem(STORAGE_KEY, p.id);
      setParticipant(p);
    }
  }, []);

  const resumeByCollegeId = useCallback(async (collegeId: string): Promise<boolean> => {
    setError(null);
    const { data, error: err } = await supabase
      .from('cloud_builder_participants')
      .select('*')
      .eq('college_id', collegeId)
      .maybeSingle();
    if (err) {
      setError(err.message);
      return false;
    }
    if (data) {
      const p = data as Participant;
      localStorage.setItem(STORAGE_KEY, p.id);
      setParticipant(p);
      return true;
    }
    return false;
  }, []);

  const saveServer = useCallback(async (data: ServerData) => {
    if (!participant) return;
    const server = data;
    const storage = participant.storage_data;
    const database = participant.database_data;
    const hosting = participant.hosting_data;
    const score = calculateScore(server, storage, database, hosting);
    const steps = getCompletedSteps(server, storage, database, hosting);
    const current = getCurrentStep(server, storage, database, hosting);
    await updateParticipant(participant.id, {
      server_data: server,
      total_score: score,
      completed_steps: steps,
      current_step: current,
    });
  }, [participant, updateParticipant]);

  const saveStorage = useCallback(async (data: StorageData) => {
    if (!participant) return;
    const server = participant.server_data;
    const storage = data;
    const database = participant.database_data;
    const hosting = participant.hosting_data;
    const score = calculateScore(server, storage, database, hosting);
    const steps = getCompletedSteps(server, storage, database, hosting);
    const current = getCurrentStep(server, storage, database, hosting);
    await updateParticipant(participant.id, {
      storage_data: storage,
      total_score: score,
      completed_steps: steps,
      current_step: current,
    });
  }, [participant, updateParticipant]);

  const saveDatabase = useCallback(async (data: DatabaseData) => {
    if (!participant) return;
    const server = participant.server_data;
    const storage = participant.storage_data;
    const database = data;
    const hosting = participant.hosting_data;
    const score = calculateScore(server, storage, database, hosting);
    const steps = getCompletedSteps(server, storage, database, hosting);
    const current = getCurrentStep(server, storage, database, hosting);
    await updateParticipant(participant.id, {
      database_data: database,
      total_score: score,
      completed_steps: steps,
      current_step: current,
    });
  }, [participant, updateParticipant]);

  const saveHosting = useCallback(async (data: HostingData) => {
    if (!participant) return;
    const server = participant.server_data;
    const storage = participant.storage_data;
    const database = participant.database_data;
    const hosting = data;
    const score = calculateScore(server, storage, database, hosting);
    const steps = getCompletedSteps(server, storage, database, hosting);
    const allDone = steps.length === 4;
    await updateParticipant(participant.id, {
      hosting_data: hosting,
      total_score: score,
      completed_steps: steps,
      current_step: allDone ? 5 : getCurrentStep(server, storage, database, hosting),
      challenge_completed: allDone,
      completed_at: allDone ? new Date().toISOString() : null,
    });
  }, [participant, updateParticipant]);

  const resetProgress = useCallback(async () => {
    if (!participant) return;
    localStorage.removeItem(STORAGE_KEY);
    await supabase
      .from('cloud_builder_participants')
      .delete()
      .eq('id', participant.id);
    setParticipant(null);
  }, [participant]);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setParticipant(null);
  }, []);

  return (
    <ChallengeContext.Provider
      value={{
        participant,
        loading,
        error,
        register,
        resumeByCollegeId,
        saveServer,
        saveStorage,
        saveDatabase,
        saveHosting,
        resetProgress,
        signOut,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error('useChallenge must be used within ChallengeProvider');
  return ctx;
}

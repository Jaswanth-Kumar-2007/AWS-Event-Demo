import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MissionId } from '@/lib/gameData';
import { MISSIONS } from '@/lib/gameData';

import LandingPage from '@/components/LandingPage';
import HowItWorks from '@/components/HowItWorks';
import Registration from '@/components/Registration';
import GameDashboard from '@/components/GameDashboard';
import Leaderboard from '@/components/Leaderboard';
import OrganizerDashboard from '@/components/OrganizerDashboard';
import ServiceGlossary from '@/components/ServiceGlossary';

import VPCMission from '@/components/missions/VPCMission';
import EC2Mission from '@/components/missions/EC2Mission';
import S3Mission from '@/components/missions/S3Mission';
import DatabaseMission from '@/components/missions/DatabaseMission';
import LambdaMission from '@/components/missions/LambdaMission';
import CognitoMission from '@/components/missions/CognitoMission';
import FinalArchitecture from '@/components/missions/FinalArchitecture';

type View = 'landing' | 'howitworks' | 'register' | 'dashboard' | 'mission' | 'leaderboard' | 'services' | 'organizer';

interface ParticipantState {
  participant_id: string;
  name: string;
  college_id: string;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [participant, setParticipant] = useState<ParticipantState | null>(null);
  const [currentMission, setCurrentMission] = useState<MissionId>(1);
  const [score, setScore] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [missionHints, setMissionHints] = useState<Record<number, number>>({});
  const [activeMissionId, setActiveMissionId] = useState<MissionId>(1);
  const [showConfetti, setShowConfetti] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('aws_cloud_mission_participant');
    if (stored) {
      try {
        const p = JSON.parse(stored) as ParticipantState;
        setParticipant(p);
        loadProgress(p.participant_id);
      } catch {
        // ignore
      }
    }
  }, []);

  const loadProgress = async (participantId: string) => {
    const { data } = await supabase
      .from('participants')
      .select('current_mission, score, status')
      .eq('participant_id', participantId)
      .maybeSingle();

    if (data) {
      setCurrentMission(data.current_mission as MissionId);
      setScore(data.score);

      // Load mission progress
      const { data: progress } = await supabase
        .from('mission_progress')
        .select('mission_id, completed, hints_used')
        .eq('participant_id', participantId);

      if (progress) {
        const completed = progress.filter((p) => p.completed).map((p) => p.mission_id);
        setCompletedMissions(completed);
        const hints: Record<number, number> = {};
        progress.forEach((p) => { hints[p.mission_id] = p.hints_used; });
        setMissionHints(hints);
      }

      if (data.status === 'completed') {
        setShowConfetti(true);
      }
    }
  };

  const handleRegistered = (participantId: string, name: string, collegeId: string) => {
    setParticipant({ participant_id: participantId, name, college_id: collegeId });
    loadProgress(participantId);
    setView('dashboard');
  };

  const handleSelectMission = (missionId: MissionId) => {
    setActiveMissionId(missionId);
    setView('mission');
  };

  const handleMissionComplete = async (earnedScore: number, hintsUsed: number) => {
    if (!participant) return;

    const mission = MISSIONS.find((m) => m.id === activeMissionId)!;
    const newCompleted = [...completedMissions, activeMissionId];
    const newScore = score + earnedScore;
    const nextMission = (Math.min(activeMissionId + 1, 7)) as MissionId;

    setCompletedMissions(newCompleted);
    setScore(newScore);
    setCurrentMission(nextMission);
    setMissionHints({ ...missionHints, [activeMissionId]: hintsUsed });

    // Save mission progress to Supabase
    await supabase.from('mission_progress').upsert({
      participant_id: participant.participant_id,
      mission_id: activeMissionId,
      completed: true,
      score: earnedScore,
      attempts: 1,
      hints_used: hintsUsed,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'participant_id,mission_id' });

    // Update participant record
    const allDone = newCompleted.length === 7;
    await supabase.from('participants').update({
      current_mission: nextMission,
      score: newScore,
      status: allDone ? 'completed' : 'in_progress',
      completed_at: allDone ? new Date().toISOString() : null,
    }).eq('participant_id', participant.participant_id);

    if (allDone) {
      setShowConfetti(true);
    }

    setView('dashboard');
  };

  const handleHintUsed = useCallback(() => {
    setMissionHints((prev) => ({
      ...prev,
      [activeMissionId]: (prev[activeMissionId] ?? 0) + 1,
    }));
  }, [activeMissionId]);

  const handleExit = () => {
    setView('landing');
  };

  const renderMission = () => {
    const hintsUsed = missionHints[activeMissionId] ?? 0;
    switch (activeMissionId) {
      case 1:
        return <VPCMission onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      case 2:
        return <EC2Mission onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      case 3:
        return <S3Mission onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      case 4:
        return <DatabaseMission onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      case 5:
        return <LambdaMission onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      case 6:
        return <CognitoMission onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      case 7:
        return <FinalArchitecture onComplete={handleMissionComplete} hintsUsed={hintsUsed} onHintUsed={handleHintUsed} />;
      default:
        return null;
    }
  };

  // Landing page
  if (view === 'landing') {
    return (
      <>
        <LandingPage
          onStart={() => {
            if (participant) {
              setView('dashboard');
            } else {
              setView('register');
            }
          }}
          onHowItWorks={() => setView('howitworks')}
          onServices={() => setView('services')}
          onLeaderboard={() => setView('leaderboard')}
        />
        {showConfetti && <Confetti />}
      </>
    );
  }

  if (view === 'howitworks') {
    return <HowItWorks onBack={() => setView('landing')} onStart={() => setView(participant ? 'dashboard' : 'register')} />;
  }

  if (view === 'register') {
    return <Registration onRegistered={handleRegistered} onBack={() => setView('landing')} />;
  }

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView(participant ? 'dashboard' : 'landing')} />;
  }

  if (view === 'services') {
    return <ServiceGlossary onBack={() => setView(participant ? 'dashboard' : 'landing')} />;
  }

  if (view === 'organizer') {
    return <OrganizerDashboard onBack={() => setView('landing')} />;
  }

  if (view === 'dashboard' && participant) {
    return (
      <>
        <GameDashboard
          currentMission={currentMission}
          score={score}
          completedMissions={completedMissions}
          onSelectMission={handleSelectMission}
          onBack={handleExit}
          onLeaderboard={() => setView('leaderboard')}
          onServices={() => setView('services')}
          participantName={participant.name}
        />
        {showConfetti && <Confetti />}
      </>
    );
  }

  if (view === 'mission' && participant) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-6">
        <div className="mb-4">
          <button
            onClick={() => setView('dashboard')}
            className="btn-ghost text-sm"
          >
            Back to Dashboard
          </button>
        </div>
        {renderMission()}
      </div>
    );
  }

  // Fallback
  return (
    <LandingPage
      onStart={() => setView('register')}
      onHowItWorks={() => setView('howitworks')}
      onServices={() => setView('services')}
      onLeaderboard={() => setView('leaderboard')}
    />
  );
}

function Confetti() {
  const pieces = Array.from({ length: 50 });
  const colors = ['#FF9900', '#00A1C9', '#1EC966', '#FFD842', '#E5484D'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 6;
        return (
          <div
            key={i}
            className="absolute top-0 animate-float"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

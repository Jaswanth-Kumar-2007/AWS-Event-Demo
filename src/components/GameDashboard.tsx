import { Lock, CheckCircle2, Play, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';
import ScoreDisplay from './ScoreDisplay';
import CloudJourney from './CloudJourney';
import ServiceIcon from './ServiceIcon';
import { MISSIONS } from '@/lib/gameData';
import type { MissionId } from '@/lib/gameData';

interface GameDashboardProps {
  currentMission: MissionId;
  score: number;
  completedMissions: number[];
  onSelectMission: (missionId: MissionId) => void;
  onBack: () => void;
  onLeaderboard: () => void;
  onServices: () => void;
  participantName: string;
}

export default function GameDashboard({
  currentMission,
  score,
  completedMissions,
  onSelectMission,
  onBack,
  onLeaderboard,
  onServices,
  participantName,
}: GameDashboardProps) {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-ghost text-sm">Exit</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onServices} className="btn-ghost text-sm">Services</button>
          <button onClick={onLeaderboard} className="btn-ghost text-sm">Leaderboard</button>
        </div>
      </div>

      {/* Welcome */}
      <div className="card p-5 mb-4 border-aws-orange/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-aws-gray">Welcome back,</p>
            <h1 className="text-xl font-bold text-white">{participantName}</h1>
          </div>
          <ScoreDisplay score={score} size="lg" />
        </div>
      </div>

      {/* Progress */}
      <div className="card p-5 mb-4">
        <ProgressBar completedMissions={completedMissions.length} currentMission={currentMission} />
      </div>

      {/* Cloud Journey */}
      <div className="mb-4">
        <CloudJourney currentMission={currentMission} />
      </div>

      {/* Mission Cards */}
      <div className="space-y-3">
        {MISSIONS.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isUnlocked = mission.id <= currentMission;
          const isCurrent = mission.id === currentMission && !isCompleted;
          return (
            <div
              key={mission.id}
              onClick={() => isUnlocked && !isCompleted && onSelectMission(mission.id)}
              className={`card p-5 transition-all duration-300 ${
                isCompleted
                  ? 'border-aws-green/30'
                  : isCurrent
                  ? 'border-aws-orange/40 glow-orange cursor-pointer hover:shadow-lg'
                  : isUnlocked
                  ? 'cursor-pointer hover:border-aws-orange/30'
                  : 'opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  isCompleted ? 'bg-aws-green/20' : isCurrent ? 'bg-aws-orange/20' : 'bg-aws-navy-dark'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-aws-green" />
                  ) : isUnlocked ? (
                    <ServiceIcon name={mission.icon} className="w-7 h-7 text-aws-orange" />
                  ) : (
                    <Lock className="w-7 h-7 text-aws-gray-dark" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-aws-orange uppercase tracking-widest">
                      {mission.code}
                    </span>
                    {isCompleted && <span className="badge-success">Complete</span>}
                    {isCurrent && <span className="badge-orange">In Progress</span>}
                    {!isUnlocked && <span className="badge-info">Locked</span>}
                  </div>
                  <h3 className="text-lg font-bold text-white">{mission.title}</h3>
                  <p className="text-sm text-aws-gray">{mission.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-bold text-aws-orange">{mission.points} pts</p>
                  {isCurrent && (
                    <button className="btn-primary text-xs px-3 py-1.5 mt-2 flex items-center gap-1">
                      <Play className="w-3 h-3" /> Start
                    </button>
                  )}
                  {isCompleted && <ArrowRight className="w-4 h-4 text-aws-green mt-2 ml-auto" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-aws-gray-dark text-center mt-6">
        SIMULATION — No real AWS resources created. No AWS credentials required.
      </p>
    </div>
  );
}

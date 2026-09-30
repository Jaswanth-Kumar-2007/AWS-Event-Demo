import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { MISSIONS } from '@/lib/gameData';
import type { MissionId } from '@/lib/gameData';

interface ProgressBarProps {
  completedMissions: number;
  currentMission: MissionId;
}

export default function ProgressBar({ completedMissions, currentMission }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-aws-gray-light">
          {completedMissions} / 7 Missions Complete
        </span>
        <span className="text-xs text-aws-gray font-mono">
          {Math.round((completedMissions / 7) * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        {MISSIONS.map((m) => {
          const isCompleted = m.id < currentMission;
          const isCurrent = m.id === currentMission;
          const isLocked = m.id > currentMission;
          return (
            <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-2 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-aws-green'
                    : isCurrent
                    ? 'bg-aws-orange animate-pulse'
                    : 'bg-aws-navy-light border border-aws-gray-dark/30'
                }`}
              />
              <div className="flex items-center gap-1">
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-aws-green" />}
                {isCurrent && <Circle className="w-3 h-3 text-aws-orange" />}
                {isLocked && <Lock className="w-3 h-3 text-aws-gray-dark" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

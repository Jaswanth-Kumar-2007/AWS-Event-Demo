import { Cloud, Server, HardDrive, Database, Zap, ShieldCheck, Network, ArrowRight } from 'lucide-react';
import type { MissionId } from '@/lib/gameData';

interface CloudJourneyProps {
  currentMission: number;
}

const steps = [
  { label: 'Start', icon: Cloud, key: 'start' },
  { label: 'Cloud Computing', icon: Cloud, key: 'cloud' },
  { label: 'AWS', icon: Cloud, key: 'aws' },
  { label: 'VPC', icon: Network, key: 'vpc', mission: 1 },
  { label: 'EC2', icon: Server, key: 'ec2', mission: 2 },
  { label: 'S3', icon: HardDrive, key: 's3', mission: 3 },
  { label: 'Database', icon: Database, key: 'db', mission: 4 },
  { label: 'Lambda', icon: Zap, key: 'lambda', mission: 5 },
  { label: 'Cognito', icon: ShieldCheck, key: 'cognito', mission: 6 },
  { label: 'Final Architecture', icon: Cloud, key: 'final', mission: 7 },
  { label: 'Cloud Engineer', icon: ShieldCheck, key: 'engineer' },
];

export default function CloudJourney({ currentMission }: CloudJourneyProps) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-aws-orange uppercase tracking-wide mb-4">
        Cloud Journey
      </h3>
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, i) => {
          const isCompleted = step.mission !== undefined && step.mission < currentMission;
          const isCurrent = step.mission === currentMission;
          const isReached = step.mission === undefined || step.mission <= currentMission;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center gap-1">
              <div
                className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                  isCompleted ? 'opacity-100' : isCurrent ? 'opacity-100' : isReached ? 'opacity-70' : 'opacity-30'
                }`}
              >
                <div
                  className={`p-2 rounded-lg border-2 transition-all duration-500 ${
                    isCompleted
                      ? 'border-aws-green bg-aws-green/10 text-aws-green'
                      : isCurrent
                      ? 'border-aws-orange bg-aws-orange/10 text-aws-orange animate-pulse-glow'
                      : 'border-aws-gray-dark/30 bg-aws-navy-dark text-aws-gray'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? 'text-aws-green' : isCurrent ? 'text-aws-orange' : 'text-aws-gray-dark'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  className={`w-3 h-3 ${isCompleted ? 'text-aws-green' : 'text-aws-gray-dark'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

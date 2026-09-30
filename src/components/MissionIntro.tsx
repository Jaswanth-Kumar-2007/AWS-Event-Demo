import { Rocket } from 'lucide-react';

interface MissionIntroProps {
  code: string;
  title: string;
  service: string;
  story: string;
  points: number;
}

export default function MissionIntro({ code, title, service, story, points }: MissionIntroProps) {
  return (
    <div className="card p-6 mb-6 border-aws-orange/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-aws-orange/5 rounded-full blur-3xl" />
      <div className="flex items-center gap-2 mb-3">
        <Rocket className="w-5 h-5 text-aws-orange" />
        <span className="text-xs font-mono font-bold text-aws-orange uppercase tracking-widest">
          {code}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-aws-blue-light mb-3 font-medium">{service}</p>
      <p className="text-aws-gray-light mb-4">{story}</p>
      <div className="flex items-center gap-2">
        <span className="badge-orange">Reward: {points} points</span>
        <span className="badge-info">SIMULATION — No real AWS resources</span>
      </div>
    </div>
  );
}

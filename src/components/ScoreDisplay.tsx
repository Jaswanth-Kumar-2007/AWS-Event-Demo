import { Star } from 'lucide-react';
import { MAX_SCORE } from '@/lib/gameData';

interface ScoreDisplayProps {
  score: number;
  showMax?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreDisplay({ score, showMax = true, size = 'md' }: ScoreDisplayProps) {
  const sizes = {
    sm: { text: 'text-sm', icon: 'w-4 h-4', gap: 'gap-1.5' },
    md: { text: 'text-lg', icon: 'w-5 h-5', gap: 'gap-2' },
    lg: { text: 'text-3xl', icon: 'w-7 h-7', gap: 'gap-3' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <Star className={`${s.icon} text-aws-orange fill-aws-orange/20`} />
      <span className={`font-mono font-bold text-aws-orange ${s.text}`}>
        {score}
        {showMax && <span className="text-aws-gray"> / {MAX_SCORE}</span>}
      </span>
    </div>
  );
}

import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { MISSION_HINTS, HINT_COSTS } from '@/lib/gameData';

interface HintSystemProps {
  missionId: number;
  hintsUsed: number;
  onHintUsed: (hintIndex: number) => void;
}

export default function HintSystem({ missionId, hintsUsed, onHintUsed }: HintSystemProps) {
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const hintSet = MISSION_HINTS[missionId];

  const handleGetHint = () => {
    const nextIndex = revealedHints.length;
    if (nextIndex >= hintSet.hints.length) return;
    setRevealedHints([...hintSet.hints, hintSet.hints[nextIndex]]);
    onHintUsed(nextIndex);
  };

  const nextHintCost = HINT_COSTS[revealedHints.length] ?? 0;

  return (
    <div className="card p-4 border-aws-yellow/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-aws-yellow" />
          <span className="font-semibold text-aws-gray-light">Hint System</span>
        </div>
        {revealedHints.length < hintSet.hints.length && (
          <button
            onClick={handleGetHint}
            className="btn-ghost text-sm flex items-center gap-1.5 border border-aws-yellow/30 hover:border-aws-yellow/60"
          >
            {nextHintCost === 0 ? (
              <span className="text-aws-yellow">GET HINT (Free)</span>
            ) : (
              <span className="text-aws-yellow">
                GET HINT ({nextHintCost} pts)
              </span>
            )}
          </button>
        )}
      </div>
      {revealedHints.length === 0 ? (
        <p className="text-sm text-aws-gray">
          Stuck? Use a hint. The first one is free — additional hints cost points.
        </p>
      ) : (
        <div className="space-y-2">
          {revealedHints.map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 bg-aws-navy-dark rounded-lg animate-fade-in-up"
            >
              <span className="text-aws-yellow font-mono text-xs mt-0.5">
                HINT {i + 1}
              </span>
              <p className="text-sm text-aws-gray-light">{hint}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-3 text-xs text-aws-gray-dark">
        <span>Hints used: {hintsUsed}</span>
        {revealedHints.length < hintSet.hints.length && (
          <span>•</span>
        )}
        {revealedHints.length < hintSet.hints.length && (
          <span>Next hint: {nextHintCost === 0 ? 'Free' : `${nextHintCost} points`}</span>
        )}
      </div>
    </div>
  );
}

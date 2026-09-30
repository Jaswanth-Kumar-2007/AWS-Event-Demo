import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  points: number;
  whatYouLearned: string;
  realAwsConnection: string;
  nextMission?: () => void;
}

export default function CompletionModal({
  open,
  onClose,
  title,
  points,
  whatYouLearned,
  realAwsConnection,
  nextMission,
}: CompletionModalProps) {
  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && nextMission) nextMission();
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [open, onClose, nextMission]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card p-6 max-w-lg w-full border-aws-green/30 glow-green animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-aws-green/20">
              <CheckCircle2 className="w-8 h-8 text-aws-green" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-sm text-aws-green font-mono">+{points} points</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-aws-navy-dark rounded-lg border border-aws-blue/20">
            <h3 className="text-sm font-bold text-aws-orange uppercase tracking-wide mb-2">
              What You Learned
            </h3>
            <p className="text-sm text-aws-gray-light">{whatYouLearned}</p>
          </div>
          <div className="p-4 bg-aws-navy-dark rounded-lg border border-aws-green/20">
            <h3 className="text-sm font-bold text-aws-green uppercase tracking-wide mb-2">
              Real AWS Connection
            </h3>
            <p className="text-sm text-aws-gray-light">{realAwsConnection}</p>
          </div>
        </div>

        {nextMission && (
          <button onClick={nextMission} className="btn-primary w-full mt-5">
            Continue to Next Mission
          </button>
        )}
      </div>
    </div>
  );
}

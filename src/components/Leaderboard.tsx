import { useEffect, useState } from 'react';
import { Trophy, Medal, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry {
  name: string;
  score: number;
  current_mission: number;
  completed_at: string | null;
}

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('name, score, current_mission, completed_at')
        .order('score', { ascending: false })
        .order('completed_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const formatTime = (completedAt: string | null) => {
    if (!completedAt) return 'In Progress';
    const date = new Date(completedAt);
    return date.toLocaleString();
  };

  const getMedalColor = (rank: number) => {
    if (rank === 0) return 'text-aws-yellow';
    if (rank === 1) return 'text-aws-gray-light';
    if (rank === 2) return 'text-aws-orange';
    return 'text-aws-gray-dark';
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-ghost flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-aws-orange/10 mb-3">
          <Trophy className="w-8 h-8 text-aws-orange" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Leaderboard</h1>
        <p className="text-sm text-aws-gray">Top participants ranked by score and completion time</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-aws-orange" />
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-8 text-center">
          <Trophy className="w-12 h-12 text-aws-gray-dark mx-auto mb-3" />
          <p className="text-aws-gray">No participants yet. Be the first!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-aws-navy-dark border-b border-aws-gray-dark/30 text-xs font-bold text-aws-gray uppercase">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Participant</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-2 text-right">Missions</div>
            <div className="col-span-2 text-right">Time</div>
          </div>
          {entries.map((entry, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-aws-gray-dark/20 ${
                i < 3 ? 'bg-aws-orange/5' : ''
              }`}
            >
              <div className="col-span-1 flex items-center">
                {i < 3 ? (
                  <Medal className={`w-5 h-5 ${getMedalColor(i)}`} />
                ) : (
                  <span className="text-sm text-aws-gray font-mono">{i + 1}</span>
                )}
              </div>
              <div className="col-span-5">
                <p className="text-sm font-medium text-white truncate">
                  {entry.name}
                </p>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-mono font-bold text-aws-orange">{entry.score}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-xs text-aws-gray-light font-mono">{entry.current_mission}/7</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-xs text-aws-gray flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {entry.completed_at ? formatTime(entry.completed_at).split(',')[0] : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-aws-gray-dark text-center mt-4">
        College IDs are not displayed publicly. Names shown for leaderboard ranking only.
      </p>
    </div>
  );
}

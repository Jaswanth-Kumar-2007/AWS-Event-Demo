import { useEffect, useState } from 'react';
import { Users, Activity, BarChart3, Filter, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MISSIONS } from '@/lib/gameData';

interface OrganizerDashboardProps {
  onBack: () => void;
}

interface ParticipantRow {
  name: string;
  college_id: string;
  current_mission: number;
  score: number;
  status: string;
  started_at: string;
  completed_at: string | null;
}

export default function OrganizerDashboard({ onBack }: OrganizerDashboardProps) {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Simple passcode gate — stored in localStorage for session convenience
  const ORGANIZER_PASSCODE = 'cloud-mission-admin';

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ORGANIZER_PASSCODE) {
      setAuthed(true);
      localStorage.setItem('aws_organizer_auth', 'true');
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('aws_organizer_auth') === 'true') {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from('participants')
        .select('name, college_id, current_mission, score, status, started_at, completed_at')
        .order('score', { ascending: false });
      if (data) setParticipants(data as ParticipantRow[]);
      setLoading(false);
    };
    fetchData();
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-aws-red/20">
              <ShieldAlert className="w-8 h-8 text-aws-red" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Organizer Access</h1>
              <p className="text-sm text-aws-gray">Protected dashboard</p>
            </div>
          </div>
          <form onSubmit={handleAuth} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              className="input-field"
              placeholder="Enter organizer passcode"
            />
            {error && <p className="text-sm text-aws-red">Incorrect passcode. Try again.</p>}
            <button type="submit" className="btn-primary w-full">Access Dashboard</button>
          </form>
          <button onClick={onBack} className="btn-ghost w-full mt-2">Back to Home</button>
          <p className="text-xs text-aws-gray-dark mt-3 text-center">
            Hint: cloud-mission-admin
          </p>
        </div>
      </div>
    );
  }

  const totalParticipants = participants.length;
  const activeParticipants = participants.filter((p) => p.status === 'in_progress').length;
  const completedParticipants = participants.filter((p) => p.status === 'completed').length;
  const avgScore = totalParticipants > 0
    ? Math.round(participants.reduce((sum, p) => sum + p.score, 0) / totalParticipants)
    : 0;

  const filtered = participants.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return p.status === 'in_progress';
    if (filter === 'completed') return p.status === 'completed';
    return true;
  });

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-ghost flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <button
          onClick={() => { localStorage.removeItem('aws_organizer_auth'); setAuthed(false); }}
          className="btn-ghost text-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Organizer Dashboard</h1>
        <p className="text-sm text-aws-gray">Mission statistics and participant overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-aws-blue" />
            <span className="text-xs text-aws-gray uppercase">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalParticipants}</p>
          <p className="text-xs text-aws-gray">Participants</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-aws-orange" />
            <span className="text-xs text-aws-gray uppercase">Active</span>
          </div>
          <p className="text-2xl font-bold text-aws-orange">{activeParticipants}</p>
          <p className="text-xs text-aws-gray">In Progress</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-aws-green" />
            <span className="text-xs text-aws-gray uppercase">Completed</span>
          </div>
          <p className="text-2xl font-bold text-aws-green">{completedParticipants}</p>
          <p className="text-xs text-aws-gray">Missions Done</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-aws-yellow" />
            <span className="text-xs text-aws-gray uppercase">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-aws-yellow">{avgScore}</p>
          <p className="text-xs text-aws-gray">/ 100</p>
        </div>
      </div>

      {/* Mission Statistics */}
      <div className="card p-5 mb-6">
        <h3 className="text-sm font-bold text-aws-orange uppercase tracking-wide mb-4">Mission Completion Rates</h3>
        <div className="space-y-2">
          {MISSIONS.map((m) => {
            const count = participants.filter((p) => p.current_mission > m.id || p.status === 'completed').length;
            const pct = totalParticipants > 0 ? Math.round((count / totalParticipants) * 100) : 0;
            return (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-xs text-aws-gray-light w-32 truncate">{m.code}: {m.title}</span>
                <div className="flex-1 h-2 bg-aws-navy-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-aws-orange rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-aws-gray font-mono w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-aws-gray" />
        {(['all', 'in_progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-aws-orange text-aws-navy'
                : 'bg-aws-navy-light text-aws-gray hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Participant Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-aws-orange" />
        </div>
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-aws-navy-dark border-b border-aws-gray-dark/30">
                <th className="px-4 py-3 text-left text-xs font-bold text-aws-gray uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-aws-gray uppercase">College ID</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-aws-gray uppercase">Mission</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-aws-gray uppercase">Score</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-aws-gray uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-aws-gray uppercase">Started</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-aws-gray uppercase">Completed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="border-b border-aws-gray-dark/20 hover:bg-aws-navy-dark/50">
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-aws-gray font-mono text-xs">{p.college_id}</td>
                  <td className="px-4 py-3 text-center text-aws-gray-light font-mono">{p.current_mission}/7</td>
                  <td className="px-4 py-3 text-center text-aws-orange font-mono font-bold">{p.score}</td>
                  <td className="px-4 py-3 text-center">
                    {p.status === 'completed' ? (
                      <span className="badge-success">Completed</span>
                    ) : (
                      <span className="badge-warning">In Progress</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-aws-gray text-xs">{formatTime(p.started_at)}</td>
                  <td className="px-4 py-3 text-center text-aws-gray text-xs">{formatTime(p.completed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-aws-gray">No participants match this filter.</div>
          )}
        </div>
      )}
    </div>
  );
}

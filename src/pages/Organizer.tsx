import { useState, useEffect } from 'react';
import { BarChart3, Users, Trophy, TrendingUp, CheckCircle2, Clock, Search } from 'lucide-react';
import { supabase, type Participant } from '@/lib/supabase';
import { Badge } from '@/components/ui';

type Filter = 'all' | 'in_progress' | 'completed';

const missionNames = ['—', 'Compute', 'Storage', 'Database', 'Hosting', 'Complete'];

export function Organizer() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('cloud_builder_participants')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setParticipants(data as Participant[]);
      setLoading(false);
    })();
  }, []);

  const filtered = participants.filter((p) => {
    if (filter === 'completed' && !p.challenge_completed) return false;
    if (filter === 'in_progress' && p.challenge_completed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.college_id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Stats
  const total = participants.length;
  const started = participants.length;
  const completed = participants.filter((p) => p.challenge_completed).length;
  const avgProgress = total > 0
    ? Math.round((participants.reduce((sum, p) => sum + (p.completed_steps?.length || 0), 0) / (total * 4)) * 100)
    : 0;

  const missionCounts = [1, 2, 3, 4].map((m) =>
    participants.filter((p) => (p.completed_steps || []).includes(m)).length
  );

  // Leaderboard: completed first, then by completion time (earlier = better)
  const leaderboard = [...participants]
    .filter((p) => p.challenge_completed)
    .sort((a, b) => {
      const aTime = new Date(a.completed_at || '').getTime();
      const bTime = new Date(b.completed_at || '').getTime();
      return aTime - bTime;
    })
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-cloud-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cloud-600 border-t-accent-400" />
          Loading organizer data...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600">
          <BarChart3 className="h-7 w-7 text-cloud-950" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Organizer Dashboard</h1>
          <p className="text-sm text-cloud-400">Challenge statistics and participant tracking</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Participants" value={total} color="text-sky-400 bg-sky-500/10" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Challenges Started" value={started} color="text-amber-400 bg-amber-500/10" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Challenges Completed" value={completed} color="text-emerald-400 bg-emerald-500/10" />
        <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Average Progress" value={`${avgProgress}%`} color="text-violet-400 bg-violet-500/10" />
      </div>

      {/* Mission completion counts */}
      <div className="mb-8 rounded-xl border border-cloud-800 bg-cloud-850/60 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Mission Completion Counts</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {['Compute', 'Storage', 'Database', 'Hosting'].map((name, i) => (
            <div key={name} className="rounded-lg border border-cloud-700 bg-cloud-900/50 p-4">
              <p className="text-xs text-cloud-500">Mission {i + 1}</p>
              <p className="text-sm font-semibold text-cloud-200">{name}</p>
              <p className="mt-1 text-2xl font-bold text-accent-300">{missionCounts[i]}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cloud-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-300"
                  style={{ width: `${total > 0 ? (missionCounts[i] / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="mb-8 rounded-xl border border-cloud-800 bg-cloud-850/60 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Trophy className="h-4 w-4 text-amber-400" />
            Leaderboard — Completed Challenges
          </h2>
          <div className="space-y-2">
            {leaderboard.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 rounded-lg border border-cloud-700 bg-cloud-900/50 p-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  i === 0 ? 'bg-amber-500/20 text-amber-300' : i === 1 ? 'bg-cloud-300/20 text-cloud-200' : i === 2 ? 'bg-orange-500/20 text-orange-300' : 'bg-cloud-700 text-cloud-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-cloud-100">{p.name}</p>
                  <p className="text-xs text-cloud-500">{p.college_id}</p>
                </div>
                <Badge variant="accent">{p.total_score}/100</Badge>
                <div className="flex items-center gap-1.5 text-xs text-cloud-400">
                  <Clock className="h-3.5 w-3.5" />
                  {p.completed_at ? new Date(p.completed_at).toLocaleString() : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participant table */}
      <div className="rounded-xl border border-cloud-800 bg-cloud-850/60 p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-white">Participants</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or ID..."
                className="w-full rounded-lg border border-cloud-700 bg-cloud-900 py-2 pl-9 pr-3 text-sm text-white placeholder-cloud-500 outline-none focus:border-accent-500 sm:w-56"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'in_progress', 'completed'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    filter === f ? 'bg-accent-500/15 text-accent-300' : 'text-cloud-400 hover:bg-cloud-800 hover:text-cloud-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cloud-700 text-left">
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">Name</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">College ID</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">Current Mission</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">Score</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">Completed</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">Started At</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cloud-500">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-cloud-500">No participants found.</td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-cloud-800 ${i % 2 === 0 ? 'bg-cloud-900/30' : ''} hover:bg-cloud-800/40`}>
                    <td className="px-3 py-3 font-medium text-cloud-100">{p.name}</td>
                    <td className="px-3 py-3 text-cloud-300">{p.college_id}</td>
                    <td className="px-3 py-3 text-cloud-300">{missionNames[p.current_step] || '—'}</td>
                    <td className="px-3 py-3">
                      <span className="font-semibold text-accent-300">{p.total_score}</span>
                      <span className="text-cloud-600">/100</span>
                    </td>
                    <td className="px-3 py-3">
                      {p.challenge_completed ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge variant="neutral">No</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-cloud-400">
                      {new Date(p.challenge_started_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 text-xs text-cloud-400">
                      {p.completed_at ? new Date(p.completed_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-cloud-800 bg-cloud-850/60 p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <p className="text-xs text-cloud-500">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

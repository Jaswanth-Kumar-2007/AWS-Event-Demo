import { Server, HardDrive, Database, Globe, ArrowRight, CheckCircle2, Lock, Trophy, Award, ChevronRight } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import type { Page } from '@/components/AppShell';

const missions = [
  {
    number: 1,
    key: 'compute' as Page,
    title: 'Compute',
    desc: 'Launch your application server',
    icon: Server,
    color: 'from-sky-400 to-sky-600',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    iconColor: 'text-sky-400',
  },
  {
    number: 2,
    key: 'storage' as Page,
    title: 'Storage',
    desc: 'Store an image for your application',
    icon: HardDrive,
    color: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    number: 3,
    key: 'database' as Page,
    title: 'Database',
    desc: "Create your application's data record",
    icon: Database,
    color: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    number: 4,
    key: 'hosting' as Page,
    title: 'Hosting',
    desc: 'Publish your website to the internet',
    icon: Globe,
    color: 'from-violet-400 to-violet-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
];

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { participant } = useChallenge();
  if (!participant) return null;

  const completedSteps = participant.completed_steps || [];
  const completedCount = completedSteps.length;
  const score = participant.total_score || 0;
  const allDone = participant.challenge_completed;

  const isUnlocked = (n: number) => n === 1 || completedSteps.includes(n - 1);
  const isDone = (n: number) => completedSteps.includes(n);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-cloud-800 bg-gradient-to-br from-cloud-850 to-cloud-900 p-8 lg:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-300">
            <Trophy className="h-3.5 w-3.5" />
            Cloud Builder Challenge
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white lg:text-4xl">
            Welcome, {participant.name.split(' ')[0]}!
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-cloud-300">
            Build your first cloud application by completing four connected missions. Each mission
            builds on the last — your server, storage, database, and website all work together.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl border border-cloud-700 bg-cloud-900/50 px-5 py-3">
              <p className="text-xs text-cloud-500">Progress</p>
              <p className="text-xl font-bold text-accent-300">{completedCount}/4</p>
            </div>
            <div className="rounded-xl border border-cloud-700 bg-cloud-900/50 px-5 py-3">
              <p className="text-xs text-cloud-500">Score</p>
              <p className="text-xl font-bold text-accent-300">{score}/100</p>
            </div>
            <div className="rounded-xl border border-cloud-700 bg-cloud-900/50 px-5 py-3">
              <p className="text-xs text-cloud-500">Participant</p>
              <p className="text-xl font-bold text-cloud-100">{participant.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission journey */}
      <h2 className="mb-4 text-lg font-semibold text-white">Your Cloud Journey</h2>
      <div className="mb-8 space-y-3">
        {missions.map((m, i) => {
          const Icon = m.icon;
          const done = isDone(m.number);
          const unlocked = isUnlocked(m.number);

          return (
            <div key={m.number}>
              <button
                onClick={() => unlocked && onNavigate(m.key)}
                disabled={!unlocked}
                className={`group flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                  done
                    ? `${m.border} ${m.bg} hover:scale-[1.01]`
                    : unlocked
                      ? 'border-cloud-700 bg-cloud-850/60 hover:border-cloud-600 hover:scale-[1.01]'
                      : 'cursor-not-allowed border-cloud-800 bg-cloud-900/30 opacity-60'
                }`}
              >
                {/* Number/Icon */}
                <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  done ? `bg-gradient-to-br ${m.color}` : unlocked ? 'bg-cloud-700/50' : 'bg-cloud-800'
                }`}>
                  {done ? (
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  ) : unlocked ? (
                    <Icon className={`h-6 w-6 ${m.iconColor}`} />
                  ) : (
                    <Lock className="h-5 w-5 text-cloud-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-cloud-500">Mission {m.number}</span>
                    {done && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <h3 className="text-base font-bold text-white">{m.title}</h3>
                  <p className="text-sm text-cloud-400">{m.desc}</p>
                </div>

                {/* Arrow */}
                {unlocked && (
                  <ChevronRight className="h-5 w-5 shrink-0 text-cloud-500 transition group-hover:translate-x-1 group-hover:text-cloud-300" />
                )}
              </button>

              {/* Connector arrow */}
              {i < missions.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="h-5 w-px bg-gradient-to-b from-cloud-700 to-cloud-800" />
                </div>
              )}
            </div>
          );
        })}

        {/* Completion */}
        <div className="flex justify-center py-1">
          <div className="h-5 w-px bg-gradient-to-b from-cloud-700 to-cloud-800" />
        </div>
        <button
          onClick={() => allDone && onNavigate('complete')}
          disabled={!allDone}
          className={`group flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${
            allDone
              ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-accent-500/10 hover:scale-[1.01]'
              : 'cursor-not-allowed border-cloud-800 bg-cloud-900/30 opacity-60'
          }`}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            allDone ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-cloud-800'
          }`}>
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-cloud-500">Final</span>
            <h3 className="text-base font-bold text-white">Challenge Complete</h3>
            <p className="text-sm text-cloud-400">
              {allDone ? 'View your results and architecture' : 'Complete all 4 missions to finish'}
            </p>
          </div>
          {allDone && <ChevronRight className="h-5 w-5 shrink-0 text-amber-400 transition group-hover:translate-x-1" />}
        </button>
      </div>

      {/* Start/Continue button */}
      {!allDone && (
        <button
          onClick={() => onNavigate(missions[completedCount]?.key || 'compute')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3.5 text-sm font-semibold text-cloud-950 transition hover:bg-accent-400"
        >
          {completedCount === 0 ? 'Start Mission 1' : `Continue: Mission ${completedCount + 1}`}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {allDone && (
        <button
          onClick={() => onNavigate('complete')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-accent-500 px-5 py-3.5 text-sm font-semibold text-cloud-950 transition hover:from-amber-400 hover:to-accent-400"
        >
          <Award className="h-4 w-4" />
          View Your Results
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Home, Server, Database, Globe, HardDrive, BookOpen, Route, Cloud, RefreshCw, CheckCircle2, Circle, Lock, BarChart3, LogOut } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';

export type Page = 'home' | 'compute' | 'storage' | 'database' | 'hosting' | 'complete' | 'journey' | 'glossary' | 'organizer';

interface NavItem {
  key: Page;
  label: string;
  icon: typeof Home;
  mission?: number;
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Dashboard', icon: Home },
  { key: 'compute', label: 'Mission 1: Compute', icon: Server, mission: 1 },
  { key: 'storage', label: 'Mission 2: Storage', icon: HardDrive, mission: 2 },
  { key: 'database', label: 'Mission 3: Database', icon: Database, mission: 3 },
  { key: 'hosting', label: 'Mission 4: Hosting', icon: Globe, mission: 4 },
  { key: 'journey', label: 'Cloud Journey', icon: Route },
  { key: 'glossary', label: 'Glossary', icon: BookOpen },
  { key: 'organizer', label: 'Organizer', icon: BarChart3 },
];

interface AppShellProps {
  current: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

export function AppShell({ current, onNavigate, children }: AppShellProps) {
  const { participant, resetProgress, signOut } = useChallenge();
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!participant) return null;

  const completedSteps = participant.completed_steps || [];
  const completedCount = completedSteps.length;
  const score = participant.total_score || 0;

  const isMissionUnlocked = (mission: number): boolean => {
    if (mission === 1) return true;
    return completedSteps.includes(mission - 1);
  };

  const isMissionDone = (mission: number): boolean => completedSteps.includes(mission);

  return (
    <div className="flex min-h-screen bg-cloud-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-cloud-800 bg-cloud-900/95 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-cloud-800 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg shadow-accent-500/20">
            <Cloud className="h-5 w-5 text-cloud-950" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight text-white">Cloud Builder</h1>
            <p className="text-[11px] text-cloud-400">Challenge</p>
          </div>
        </div>

        {/* Participant info */}
        <div className="border-b border-cloud-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-cloud-100">{participant.name}</p>
              <p className="text-[11px] text-cloud-500">ID: {participant.college_id}</p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-cloud-400 transition hover:bg-cloud-800 hover:text-cloud-200"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] text-cloud-500">
                <span>Progress</span>
                <span className="font-bold text-accent-300">{completedCount}/4</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cloud-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-300 transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-cloud-500">Score</p>
              <p className="text-sm font-bold text-accent-300">{score}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-cloud-500">
            Challenge
          </div>
          {navItems.map((item) => {
            const isActive = current === item.key;
            const Icon = item.icon;

            let lockState: 'unlocked' | 'locked' | 'done' = 'unlocked';
            if (item.mission) {
              if (isMissionDone(item.mission)) lockState = 'done';
              else if (!isMissionUnlocked(item.mission)) lockState = 'locked';
            }

            const isDisabled = lockState === 'locked';

            return (
              <button
                key={item.key}
                onClick={() => !isDisabled && onNavigate(item.key)}
                disabled={isDisabled}
                className={`group mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-500/15 text-accent-300'
                    : isDisabled
                      ? 'cursor-not-allowed text-cloud-600'
                      : 'text-cloud-300 hover:bg-cloud-800/60 hover:text-cloud-100'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-accent-400' : isDisabled ? 'text-cloud-700' : 'text-cloud-400 group-hover:text-cloud-200'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.mission && lockState === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                {item.mission && lockState === 'locked' && <Lock className="h-3.5 w-3.5 text-cloud-700" />}
                {item.mission && lockState === 'unlocked' && <Circle className="h-3.5 w-3.5 text-cloud-600" />}
              </button>
            );
          })}
        </nav>

        {/* Reset */}
        <div className="border-t border-cloud-800 px-4 py-4">
          {resetConfirm ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="mb-2 text-xs text-amber-300">Reset all progress? This deletes your challenge data.</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => { await resetProgress(); setResetConfirm(false); }}
                  className="flex-1 rounded-md bg-amber-500/80 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="flex-1 rounded-md bg-cloud-700 px-2 py-1.5 text-xs font-semibold text-cloud-200 transition hover:bg-cloud-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-cloud-700 px-3 py-2 text-xs font-medium text-cloud-400 transition hover:border-cloud-600 hover:text-cloud-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Playground
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1">
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

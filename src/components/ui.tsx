import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  variant?: 'info' | 'note' | 'success' | 'warning';
}

export function InfoCard({ title, children, variant = 'info' }: InfoCardProps) {
  const variants = {
    info: { bg: 'bg-cloud-850/60', border: 'border-cloud-700', icon: 'bg-accent-500/20 text-accent-300', titleColor: 'text-accent-300' },
    note: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: 'bg-amber-500/20 text-amber-300', titleColor: 'text-amber-300' },
    success: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-300', titleColor: 'text-emerald-300' },
    warning: { bg: 'bg-red-500/5', border: 'border-red-500/20', icon: 'bg-red-500/20 text-red-300', titleColor: 'text-red-300' },
  };
  const v = variants[variant];
  return (
    <div className={`rounded-xl border ${v.border} ${v.bg} p-5`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${v.icon}`}>
          <span className="text-sm font-bold">i</span>
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${v.titleColor}`}>{title}</h3>
          <div className="mt-1 text-sm leading-relaxed text-cloud-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface ServiceHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  accentColor: string;
}

export function ServiceHeader({ icon, title, subtitle, accentColor }: ServiceHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${accentColor}`}>
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm text-cloud-400">{subtitle}</p>
      </div>
    </div>
  );
}

interface SimulatedProgressProps {
  step: number;
  total: number;
  label: string;
}

export function SimulatedProgress({ step, total, label }: SimulatedProgressProps) {
  return (
    <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-cloud-200">{label}</span>
        <span className="font-mono text-xs text-accent-300">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-cloud-700">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-300 transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded">
        <div className="h-full w-1/3 animate-progress bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'neutral' | 'accent' | 'warning';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    neutral: 'bg-cloud-700/50 text-cloud-300 border-cloud-600',
    accent: 'bg-accent-500/15 text-accent-300 border-accent-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

interface MissionLayoutProps {
  missionNumber: number;
  totalMissions?: number;
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor: string;
  whatAreWeDoing: ReactNode;
  whyWeNeedIt: ReactNode;
  task: ReactNode;
  children: ReactNode;
  whatYouLearned?: ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  isUnlocked: boolean;
  lockedReason?: string;
}

export function MissionLayout({
  missionNumber,
  totalMissions = 4,
  title,
  subtitle,
  icon,
  accentColor,
  whatAreWeDoing,
  whyWeNeedIt,
  task,
  children,
  whatYouLearned,
  onNext,
  nextLabel,
  isUnlocked,
  lockedReason,
}: MissionLayoutProps) {
  if (!isUnlocked) {
    return (
      <div className="animate-fade-in flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cloud-700 bg-cloud-850">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-cloud-200">Mission {missionNumber} is locked</h2>
        <p className="mt-2 max-w-sm text-sm text-cloud-400">
          {lockedReason || `Complete Mission ${missionNumber - 1} to unlock this mission.`}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Mission badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cloud-700 bg-cloud-850/60 px-3 py-1">
        <span className="text-xs font-semibold text-cloud-400">Mission {missionNumber} of {totalMissions}</span>
      </div>

      <ServiceHeader icon={icon} title={title} subtitle={subtitle} accentColor={accentColor} />

      {/* What are we doing */}
      <div className="mb-4">
        <SectionLabel>What are we doing?</SectionLabel>
        <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-5">
          <p className="text-sm leading-relaxed text-cloud-200">{whatAreWeDoing}</p>
        </div>
      </div>

      {/* Why we need it */}
      <div className="mb-6">
        <SectionLabel>Why do we need it?</SectionLabel>
        <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-5">
          <p className="text-sm leading-relaxed text-cloud-200">{whyWeNeedIt}</p>
        </div>
      </div>

      {/* Task */}
      <div className="mb-6">
        <SectionLabel>Your task</SectionLabel>
        {task}
      </div>

      {/* Action + result area */}
      {children}

      {/* What you learned + next */}
      {whatYouLearned && (
        <div className="mt-6 animate-slide-up">
          <SectionLabel>What you just learned</SectionLabel>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm leading-relaxed text-cloud-200">{whatYouLearned}</p>
          </div>
        </div>
      )}

      {onNext && whatYouLearned && (
        <button
          onClick={onNext}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3.5 text-sm font-semibold text-cloud-950 transition hover:bg-accent-400"
        >
          {nextLabel || 'Continue to next mission'}
          <ArrowRightSmall />
        </button>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cloud-500">{children}</p>
  );
}

function ArrowRightSmall() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

interface ConnectedResourceProps {
  label: string;
  value: string;
  icon: ReactNode;
}

export function ConnectedResource({ label, value, icon }: ConnectedResourceProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-cloud-700 bg-cloud-900/50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cloud-700/50">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-cloud-500">{label}</p>
        <p className="text-sm font-semibold text-cloud-100">{value}</p>
      </div>
    </div>
  );
}

interface SuccessBannerProps {
  message: string;
}

export function SuccessBanner({ message }: SuccessBannerProps) {
  return (
    <div className="mb-6 animate-slide-up flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
      <svg className="h-5 w-5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-medium text-emerald-300">{message}</span>
    </div>
  );
}

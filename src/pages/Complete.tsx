import { Server, HardDrive, Database, Globe, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import type { Page } from '@/components/AppShell';
import { Badge } from '@/components/ui';

interface CompleteProps {
  onNavigate: (page: Page) => void;
}

export function Complete({ onNavigate }: CompleteProps) {
  const { participant } = useChallenge();
  if (!participant) return null;

  const serverData = participant.server_data;
  const storageData = participant.storage_data;
  const dbData = participant.database_data;
  const hostingData = participant.hosting_data;

  if (!participant.challenge_completed) {
    return (
      <div className="animate-fade-in flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Trophy className="h-12 w-12 text-cloud-600" />
        <h2 className="mt-4 text-lg font-semibold text-cloud-200">Challenge not complete yet</h2>
        <p className="mt-2 text-sm text-cloud-400">Complete all four missions to see your results here.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-cloud-950 transition hover:bg-accent-400"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Celebration header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-cloud-850 to-accent-500/10 p-8 text-center lg:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 text-5xl">🎉</div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Cloud Builder Challenge Complete!</h1>
          <p className="mt-3 text-lg text-cloud-200">Congratulations, {participant.name}!</p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-cloud-700 bg-cloud-900/70 px-6 py-4">
            <Trophy className="h-8 w-8 text-amber-400" />
            <div className="text-left">
              <p className="text-xs text-cloud-500">Final Score</p>
              <p className="text-2xl font-bold text-amber-300">{participant.total_score}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Completed missions */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Server, title: 'Compute', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
          { icon: HardDrive, title: 'Storage', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { icon: Database, title: 'Database', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { icon: Globe, title: 'Hosting', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className={`rounded-xl border ${m.border} ${m.bg} p-4 text-center`}>
              <Icon className={`mx-auto h-8 w-8 ${m.color}`} />
              <p className="mt-2 text-sm font-semibold text-white">{m.title}</p>
              <CheckCircle2 className="mx-auto mt-1 h-4 w-4 text-emerald-400" />
            </div>
          );
        })}
      </div>

      {/* Architecture diagram */}
      <div className="mb-8 rounded-2xl border border-cloud-800 bg-cloud-850/60 p-8">
        <h2 className="mb-6 text-center text-lg font-semibold text-white">The Architecture You Built</h2>

        <div className="flex flex-col items-center">
          {/* Website */}
          <ArchNode icon="🌐" label="YOUR WEBSITE" sublabel="Hosting" highlight />
          <ArchArrow />
          <ArchNode icon="🗄️" label="DATABASE" sublabel={dbData?.dbName || '—'} />
          <ArchArrow label="HTML + CSS" />
          <ArchNode icon="🖥️" label="SERVER" sublabel={serverData?.name || '—'} />
          <ArchArrow />
          <ArchNode icon="📦" label="STORAGE" sublabel={storageData?.bucketName || '—'} />
          <ArchArrow label="Image" />
          <ArchNode icon="🖼️" label="IMAGE" sublabel="Uploaded by you" />
        </div>

        <p className="mt-6 text-center text-sm leading-relaxed text-cloud-300">
          You just experienced how different cloud components can work together to build an application.
        </p>
      </div>

      {/* AWS terminology mapping */}
      <div className="mb-8 rounded-2xl border border-cloud-800 bg-cloud-850/60 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Real AWS Service Names</h2>
        <p className="mb-4 text-sm text-cloud-400">
          The concepts you simulated correspond to these real AWS services:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AwsMapping concept="Compute" aws="Amazon EC2" desc="Virtual servers in the cloud" />
          <AwsMapping concept="Storage" aws="Amazon S3" desc="File storage buckets" />
          <AwsMapping concept="Database" aws="Amazon RDS / DynamoDB" desc="Managed databases" />
          <AwsMapping concept="Hosting" aws="Multiple AWS services" desc="Various hosting architectures" />
        </div>
        <p className="mt-4 text-xs text-cloud-500">
          These are real AWS examples corresponding to the concepts you simulated. This was a learning simulation — no real AWS resources were used.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => onNavigate('home')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cloud-700 px-5 py-3 text-sm font-medium text-cloud-200 transition hover:border-cloud-600"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => onNavigate('journey')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cloud-700 px-5 py-3 text-sm font-medium text-cloud-200 transition hover:border-cloud-600"
        >
          Review Cloud Journey
        </button>
        <button
          onClick={() => onNavigate('glossary')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-cloud-950 transition hover:bg-accent-400"
        >
          Review Glossary
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ArchNode({ icon, label, sublabel, highlight }: { icon: string; label: string; sublabel: string; highlight?: boolean }) {
  return (
    <div className={`flex w-full max-w-xs flex-col items-center rounded-xl border p-4 text-center transition ${
      highlight ? 'border-amber-500/40 bg-amber-500/10' : 'border-cloud-700 bg-cloud-900/50'
    }`}>
      <span className="text-3xl">{icon}</span>
      <p className={`mt-2 text-sm font-bold ${highlight ? 'text-amber-300' : 'text-cloud-100'}`}>{label}</p>
      <p className="text-xs text-cloud-400">{sublabel}</p>
    </div>
  );
}

function ArchArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-2">
      <div className="h-5 w-px bg-gradient-to-b from-cloud-600 to-cloud-500" />
      <svg className="h-4 w-4 text-cloud-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      {label && <p className="mt-0.5 text-[10px] text-cloud-600">{label}</p>}
    </div>
  );
}

function AwsMapping({ concept, aws, desc }: { concept: string; aws: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-cloud-700 bg-cloud-900/50 p-4">
      <div className="flex-1">
        <p className="text-sm font-semibold text-cloud-100">{concept}</p>
        <p className="text-xs text-cloud-500">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-cloud-500" />
      <Badge variant="accent">{aws}</Badge>
    </div>
  );
}

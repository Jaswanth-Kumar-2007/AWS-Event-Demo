import { useState, useEffect } from 'react';
import { Globe, Rocket, CheckCircle2, Server, HardDrive, Database, ExternalLink, Eye } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import type { HostingData } from '@/lib/supabase';
import type { Page } from '@/components/AppShell';
import { MissionLayout, SimulatedProgress, Badge, SuccessBanner, ConnectedResource } from '@/components/ui';

const deploySteps = [
  'Connecting to server...',
  'Reading website configuration...',
  'Retrieving HTML from database...',
  'Retrieving CSS from database...',
  'Preparing website...',
  'Publishing website...',
];

interface HostingProps {
  onNavigate: (page: Page) => void;
}

export function Hosting({ onNavigate }: HostingProps) {
  const { participant, saveHosting } = useChallenge();
  const [deploying, setDeploying] = useState(false);
  const [step, setStep] = useState(0);
  const [deployed, setDeployed] = useState(false);

  const existingHosting = participant?.hosting_data;
  const serverData = participant?.server_data;
  const storageData = participant?.storage_data;
  const dbData = participant?.database_data;
  const isUnlocked = !!dbData;
  const isDone = !!existingHosting;

  useEffect(() => {
    if (existingHosting) setDeployed(true);
  }, [existingHosting]);

  const handleDeploy = async () => {
    if (deploying || !participant) return;
    setDeploying(true);
    setStep(0);

    let current = 0;
    const interval = setInterval(async () => {
      current++;
      if (current >= deploySteps.length) {
        clearInterval(interval);
        const data: HostingData = {
          deployedAt: new Date().toISOString(),
          url: `https://cloud-builder.local/demo/${participant.id}`,
        };
        await saveHosting(data);
        setDeploying(false);
        setDeployed(true);
      } else {
        setStep(current);
      }
    }, 700);
  };

  const task = (
    <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
      <p className="mb-4 text-sm text-cloud-300">
        You now have:
      </p>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ConnectedResource label="Server" value={serverData?.name || '—'} icon={<Server className="h-4 w-4 text-sky-400" />} />
        <ConnectedResource label="Storage" value={storageData?.bucketName || '—'} icon={<HardDrive className="h-4 w-4 text-amber-400" />} />
        <ConnectedResource label="Database" value={dbData?.dbName || '—'} icon={<Database className="h-4 w-4 text-emerald-400" />} />
        <ConnectedResource label="Website Code" value="HTML + CSS saved" icon={<CheckCircle2 className="h-4 w-4 text-violet-400" />} />
      </div>

      {!isDone && (
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50"
        >
          <Rocket className="h-5 w-5" />
          Deploy Website
        </button>
      )}
    </div>
  );

  const previewUrl = existingHosting?.url || `https://cloud-builder.local/demo/${participant?.id || 'preview'}`;

  return (
    <MissionLayout
      missionNumber={4}
      title="Mission 4: Publish Your Website"
      subtitle="Hosting — make your website live"
      icon={<Globe className="h-7 w-7 text-white" />}
      accentColor="bg-gradient-to-br from-violet-400 to-violet-600"
      isUnlocked={isUnlocked}
      lockedReason="Complete Mission 3: Database to unlock this mission."
      whatAreWeDoing="You now have a server, storage, a database, and website code. Let's bring them together and publish your website."
      whyWeNeedIt="Hosting makes your website available to people through the internet. When you deploy, your website files are copied to a cloud server that anyone can visit."
      task={task}
      whatYouLearned={isDone ? "You learned that 'Hosting' publishes your website to the internet. In real AWS, different hosting architectures use multiple AWS services together." : undefined}
      onNext={isDone ? () => onNavigate('complete') : undefined}
      nextLabel="View Your Results"
    >
      {deploying && (
        <div className="mb-6">
          <SimulatedProgress step={step + 1} total={deploySteps.length} label={deploySteps[step]} />
        </div>
      )}

      {deployed && existingHosting && dbData && (
        <>
          <SuccessBanner message="Website Deployed Successfully!" />

          {/* Browser preview with student's actual HTML/CSS */}
          <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Your Live Website Preview</h3>
            </div>

            {/* Browser frame */}
            <div className="overflow-hidden rounded-lg border border-cloud-700">
              {/* Browser bar */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-gray-500">
                  {previewUrl}
                </div>
              </div>

              {/* Actual rendered website */}
              <SafePreview html={dbData.html} css={dbData.css} />
            </div>

            {/* URL */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-cloud-700 bg-cloud-900/70 px-4 py-3">
              <ExternalLink className="h-4 w-4 text-violet-400" />
              <span className="font-mono text-sm text-violet-300 truncate">{previewUrl}</span>
              <Badge variant="warning">Simulated URL</Badge>
            </div>
            <p className="mt-1.5 text-xs text-cloud-500">
              Simulated URL — this is not a real public website.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Your website is live! +40 points — Challenge Complete!</span>
            </div>
          </div>

          {isDone && (
            <button
              onClick={() => onNavigate('complete')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-accent-500 px-5 py-3.5 text-sm font-semibold text-cloud-950 transition hover:from-amber-400 hover:to-accent-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              View Challenge Results
            </button>
          )}
        </>
      )}
    </MissionLayout>
  );
}

// Safe HTML/CSS preview — sanitizes HTML, no JS execution
function SafePreview({ html, css }: { html: string; css: string }) {
  const sanitizedHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\son\w+=\w+/gi, '')
    .replace(/javascript:/gi, '');

  const sanitizedCss = css
    .replace(/javascript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/@import/gi, '');

  return (
    <iframe
      title="Deployed Website"
      sandbox=""
      srcDoc={`<!DOCTYPE html><html><head><style>${sanitizedCss}</style></head><body>${sanitizedHtml}</body></html>`}
      className="h-72 w-full bg-white"
    />
  );
}

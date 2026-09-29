import { useState, useEffect } from 'react';
import { Server, Cpu, MemoryStick, Clock, Rocket, CheckCircle2 } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import type { ServerData } from '@/lib/supabase';
import type { Page } from '@/components/AppShell';
import { MissionLayout, SimulatedProgress, Badge, SuccessBanner } from '@/components/ui';

const launchSteps = [
  'Creating server...',
  'Allocating resources...',
  'Starting server...',
  'Server is running.',
];

interface ComputeProps {
  onNavigate: (page: Page) => void;
}

export function Compute({ onNavigate }: ComputeProps) {
  const { participant, saveServer } = useChallenge();
  const [name, setName] = useState('');
  const [size, setSize] = useState<'Small' | 'Medium'>('Small');
  const [launching, setLaunching] = useState(false);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const existingServer = participant?.server_data;
  const isUnlocked = true;
  const isDone = !!existingServer;

  useEffect(() => {
    if (existingServer) setSaved(true);
  }, [existingServer]);

  const generateServerId = () => {
    const hex = '0123456789ABCDEF';
    let id = 'srv-';
    for (let i = 0; i < 5; i++) id += hex[Math.floor(Math.random() * 16)];
    return id;
  };

  const handleLaunch = async () => {
    if (!name.trim() || launching) return;
    setLaunching(true);
    setStep(0);

    let current = 0;
    const interval = setInterval(async () => {
      current++;
      if (current >= launchSteps.length) {
        clearInterval(interval);
        const serverData: ServerData = {
          name: name.trim(),
          size,
          serverId: generateServerId(),
          cpu: size === 'Small' ? 1 : 2,
          memory: size === 'Small' ? 2 : 4,
          status: 'Running',
        };
        await saveServer(serverData);
        setLaunching(false);
        setSaved(true);
        setName('');
      } else {
        setStep(current);
      }
    }, 800);
  };

  const task = (
    <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-cloud-200">Server Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. my-app-server"
            disabled={launching || isDone}
            className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-2.5 text-sm text-white placeholder-cloud-500 outline-none transition focus:border-sky-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-cloud-200">Server Size</label>
          <div className="grid grid-cols-2 gap-3">
            {(['Small', 'Medium'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                disabled={launching || isDone}
                className={`rounded-lg border p-4 text-left transition disabled:opacity-50 ${
                  size === s ? 'border-sky-500 bg-sky-500/10' : 'border-cloud-700 bg-cloud-900/50 hover:border-cloud-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{s}</span>
                  {size === s && <CheckCircle2 className="h-4 w-4 text-sky-400" />}
                </div>
                <p className="mt-1 text-xs text-cloud-400">
                  {s === 'Small' ? '1 vCPU · 2 GB RAM' : '2 vCPU · 4 GB RAM'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {!isDone && (
          <button
            onClick={handleLaunch}
            disabled={!name.trim() || launching}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-cloud-700 disabled:text-cloud-500"
          >
            <Rocket className="h-4 w-4" />
            Launch Server
          </button>
        )}
      </div>
    </div>
  );

  return (
    <MissionLayout
      missionNumber={1}
      title="Mission 1: Launch Your Application Server"
      subtitle="Compute — virtual servers in the cloud"
      icon={<Server className="h-7 w-7 text-white" />}
      accentColor="bg-gradient-to-br from-sky-400 to-sky-600"
      isUnlocked={isUnlocked}
      whatAreWeDoing="Your application needs a computer to run on. In the cloud, you can use a virtual server instead of relying on your own laptop."
      whyWeNeedIt="A virtual server runs 24/7 in the cloud. It doesn't shut down when you close your laptop, and it can handle requests from many users at once."
      task={task}
      whatYouLearned={isDone ? "You learned that 'Compute' means renting a virtual server in the cloud. In real AWS, this service is called Amazon EC2." : undefined}
      onNext={isDone ? () => onNavigate('storage') : undefined}
      nextLabel="Continue to Mission 2: Storage"
    >
      {launching && (
        <div className="mb-6">
          <SimulatedProgress step={step + 1} total={launchSteps.length} label={launchSteps[step]} />
        </div>
      )}

      {saved && existingServer && (
        <>
          <SuccessBanner message="Server Running!" />

          <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15">
                  <Server className="h-6 w-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{existingServer.name}</h3>
                  <p className="text-xs text-cloud-400">{existingServer.size} instance</p>
                </div>
              </div>
              <Badge variant="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {existingServer.status}
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <InfoTile label="Server ID" value={existingServer.serverId} mono />
              <InfoTile label="CPU" value={`${existingServer.cpu} vCPU`} />
              <InfoTile label="Memory" value={`${existingServer.memory} GB`} />
              <InfoTile label="Status" value={existingServer.status} />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Your application server is ready. +20 points</span>
            </div>
          </div>
        </>
      )}
    </MissionLayout>
  );
}

function InfoTile({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-cloud-900/50 p-3">
      <p className="text-[10px] uppercase tracking-wide text-cloud-500">{label}</p>
      <p className={`text-sm font-semibold text-cloud-100 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

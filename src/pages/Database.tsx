import { useState, useEffect } from 'react';
import { Database, Plus, CheckCircle2, Server, HardDrive, Code, Eye } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import type { DatabaseData } from '@/lib/supabase';
import type { Page } from '@/components/AppShell';
import { MissionLayout, SimulatedProgress, Badge, SuccessBanner, ConnectedResource, InfoCard } from '@/components/ui';

const createSteps = ['Provisioning database...', 'Connecting to server...', 'Database ready!'];
const saveSteps = ['Saving HTML...', 'Saving CSS...', 'Creating database record...'];

const DEFAULT_HTML = `<h1>My Cloud Website</h1>
<p>Built during the AWS Cloud Builder Challenge</p>
<div class="card">
  <h2>Welcome!</h2>
  <p>This website was built using cloud services.</p>
</div>`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e3a5f);
  color: white;
  text-align: center;
  padding: 40px;
  margin: 0;
}
h1 {
  font-size: 36px;
  color: #22d3ee;
  margin-bottom: 10px;
}
p {
  font-size: 18px;
  color: #cbd5e1;
}
.card {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto;
  max-width: 400px;
}
.card h2 {
  color: #67e8f9;
}`;

interface DatabasePageProps {
  onNavigate: (page: Page) => void;
}

export function DatabasePage({ onNavigate }: DatabasePageProps) {
  const { participant, saveDatabase } = useChallenge();
  const [dbName, setDbName] = useState('');
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);
  const [dbCreated, setDbCreated] = useState(false);

  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [saving, setSaving] = useState(false);
  const [saveStepState, setSaveStepState] = useState(0);
  const [saved, setSaved] = useState(false);

  const existingDb = participant?.database_data;
  const serverData = participant?.server_data;
  const storageData = participant?.storage_data;
  const isUnlocked = !!storageData;
  const isDone = !!existingDb;

  useEffect(() => {
    if (existingDb) {
      setDbCreated(true);
      setSaved(true);
      setDbName(existingDb.dbName);
      setHtml(existingDb.html);
      setCss(existingDb.css);
    }
  }, [existingDb]);

  const handleCreate = () => {
    if (!dbName.trim() || creating) return;
    setCreating(true);
    setStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= createSteps.length) {
        clearInterval(interval);
        setCreating(false);
        setDbCreated(true);
      } else {
        setStep(current);
      }
    }, 700);
  };

  const handleSaveCode = async () => {
    if (!dbName.trim()) return;
    setSaving(true);
    setSaveStepState(0);

    let current = 0;
    const interval = setInterval(async () => {
      current++;
      if (current >= saveSteps.length) {
        clearInterval(interval);
        const data: DatabaseData = {
          dbName: dbName.trim().toLowerCase().replace(/\s+/g, '-'),
          html,
          css,
          completedAt: new Date().toISOString(),
        };
        await saveDatabase(data);
        setSaving(false);
        setSaved(true);
      } else {
        setSaveStepState(current);
      }
    }, 700);
  };

  const task = (
    <div className="space-y-4">
      {/* Connected resources */}
      {serverData && storageData && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ConnectedResource
            label="Connected Server"
            value={serverData.name}
            icon={<Server className="h-4 w-4 text-sky-400" />}
          />
          <ConnectedResource
            label="Connected Storage"
            value={storageData.bucketName}
            icon={<HardDrive className="h-4 w-4 text-amber-400" />}
          />
        </div>
      )}

      {/* Create database */}
      {!dbCreated && !existingDb && (
        <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4 text-emerald-400" />
            Create a Database
          </h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cloud-200">Database Name</label>
            <input
              type="text"
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
              placeholder="e.g. my-app-database"
              disabled={creating}
              className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-2.5 text-sm text-white placeholder-cloud-500 outline-none transition focus:border-emerald-500 disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!dbName.trim() || creating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-cloud-700 disabled:text-cloud-500"
          >
            <Database className="h-4 w-4" />
            Create Database
          </button>
        </div>
      )}

      {/* Code editors */}
      {dbCreated && !saved && !existingDb && (
        <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
              <Database className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{dbName.toLowerCase().replace(/\s+/g, '-')}</h3>
              <Badge variant="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Connected
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cloud-200">
                <Code className="h-4 w-4 text-sky-400" />
                HTML Code
              </label>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-3 font-mono text-sm text-cloud-100 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cloud-200">
                <Code className="h-4 w-4 text-amber-400" />
                CSS Code
              </label>
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-3 font-mono text-sm text-cloud-100 outline-none transition focus:border-emerald-500"
              />
            </div>

            {/* Live preview */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cloud-200">
                <Eye className="h-4 w-4 text-accent-400" />
                Live Preview
              </label>
              <div className="overflow-hidden rounded-lg border border-cloud-700">
                <SafePreview html={html} css={css} />
              </div>
            </div>

            <button
              onClick={handleSaveCode}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save Website Code
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <MissionLayout
      missionNumber={3}
      title="Mission 3: Give Your Application Data"
      subtitle="Database — organized information storage"
      icon={<Database className="h-7 w-7 text-white" />}
      accentColor="bg-gradient-to-br from-emerald-400 to-emerald-600"
      isUnlocked={isUnlocked}
      lockedReason="Complete Mission 2: Storage to unlock this mission."
      whatAreWeDoing="Applications need structured information. A database lets an application store and retrieve organized data."
      whyWeNeedIt={
        <>
          For this challenge, we simulate storing website code as database records.
          <div className="mt-2">
            <InfoCard title="Educational Note" variant="note">
              Real applications may store files in dedicated storage services. In this beginner
              simulation, we are storing HTML and CSS as database records so you can see how an
              application can retrieve data and use it.
            </InfoCard>
          </div>
        </>
      }
      task={task}
      whatYouLearned={isDone ? "You learned that a 'Database' stores organized data that apps can retrieve. In real AWS, this is Amazon RDS or DynamoDB." : undefined}
      onNext={isDone ? () => onNavigate('hosting') : undefined}
      nextLabel="Continue to Mission 4: Hosting"
    >
      {creating && (
        <div className="mb-6">
          <SimulatedProgress step={step + 1} total={createSteps.length} label={createSteps[step]} />
        </div>
      )}

      {saving && (
        <div className="mb-6">
          <SimulatedProgress step={saveStepState + 1} total={saveSteps.length} label={saveSteps[saveStepState]} />
        </div>
      )}

      {saved && existingDb && (
        <>
          <SuccessBanner message="Website code saved in database!" />

          <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                  <Database className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{existingDb.dbName}</h3>
                  <p className="text-xs text-cloud-400">1 Website Configuration</p>
                </div>
              </div>
              <Badge variant="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Saved
              </Badge>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-cloud-700">
              <SafePreview html={existingDb.html} css={existingDb.css} />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Your website code is stored in the database. +20 points</span>
            </div>
          </div>
        </>
      )}
    </MissionLayout>
  );
}

// Safe HTML/CSS preview component — sanitizes HTML and does NOT execute JS
function SafePreview({ html, css }: { html: string; css: string }) {
  // Remove script tags and event handlers from HTML
  const sanitizedHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\son\w+=\w+/gi, '')
    .replace(/javascript:/gi, '');

  // Remove any script imports or expressions from CSS
  const sanitizedCss = css
    .replace(/javascript:/gi, '')
    .replace(/expression\s*\(/gi, '')
 .replace(/@import/gi, '');

  return (
    <iframe
      title="Website Preview"
      sandbox=""
      srcDoc={`<!DOCTYPE html><html><head><style>${sanitizedCss}</style></head><body>${sanitizedHtml}</body></html>`}
      className="h-64 w-full bg-white"
    />
  );
}

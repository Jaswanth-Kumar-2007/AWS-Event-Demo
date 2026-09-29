import { useState, useEffect, useRef } from 'react';
import { HardDrive, FolderPlus, Upload, File as FileIcon, CheckCircle2, Server, ImageIcon } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import type { StorageData } from '@/lib/supabase';
import type { Page } from '@/components/AppShell';
import { MissionLayout, SimulatedProgress, Badge, SuccessBanner, ConnectedResource } from '@/components/ui';

const createSteps = ['Creating bucket...', 'Connecting to server...', 'Bucket ready!'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface StorageProps {
  onNavigate: (page: Page) => void;
}

export function Storage({ onNavigate }: StorageProps) {
  const { participant, saveStorage } = useChallenge();
  const [bucketName, setBucketName] = useState('');
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);
  const [bucketCreated, setBucketCreated] = useState(false);

  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; dataUrl: string } | null>(null);
  const [storing, setStoring] = useState(false);
  const [storeStep, setStoreStep] = useState(0);
  const [stored, setStored] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingStorage = participant?.storage_data;
  const serverData = participant?.server_data;
  const isUnlocked = !!serverData;
  const isDone = !!existingStorage;

  useEffect(() => {
    if (existingStorage) {
      setBucketCreated(true);
      setStored(true);
      setSelectedFile({
        name: existingStorage.fileName,
        size: existingStorage.fileSize,
        dataUrl: existingStorage.fileDataUrl,
      });
    }
  }, [existingStorage]);

  const handleCreateBucket = () => {
    if (!bucketName.trim() || creating) return;
    setCreating(true);
    setStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= createSteps.length) {
        clearInterval(interval);
        setCreating(false);
        setBucketCreated(true);
      } else {
        setStep(current);
      }
    }, 700);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const storeSteps = ['Uploading to bucket...', 'Verifying storage...', 'Image stored!'];
  const handleStoreImage = async () => {
    if (!selectedFile || !serverData || !bucketName.trim()) return;
    setStoring(true);
    setStoreStep(0);

    let current = 0;
    const interval = setInterval(async () => {
      current++;
      if (current >= storeSteps.length) {
        clearInterval(interval);
        const data: StorageData = {
          bucketName: bucketName.trim().toLowerCase().replace(/\s+/g, '-'),
          connectedServerId: serverData.serverId,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileDataUrl: selectedFile.dataUrl,
          completedAt: new Date().toISOString(),
        };
        await saveStorage(data);
        setStoring(false);
        setStored(true);
      } else {
        setStoreStep(current);
      }
    }, 700);
  };

  const task = (
    <div className="space-y-4">
      {/* Connected server */}
      {serverData && (
        <ConnectedResource
          label="Server connected"
          value={serverData.name}
          icon={<Server className="h-4 w-4 text-sky-400" />}
        />
      )}

      {/* Create bucket */}
      {!bucketCreated && !existingStorage && (
        <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <FolderPlus className="h-4 w-4 text-amber-400" />
            Create a Storage Bucket
          </h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cloud-200">Bucket Name</label>
            <input
              type="text"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              placeholder="e.g. my-app-images"
              disabled={creating}
              className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-2.5 text-sm text-white placeholder-cloud-500 outline-none transition focus:border-amber-500 disabled:opacity-50"
            />
            <p className="mt-1.5 text-xs text-cloud-500">Use lowercase letters and hyphens</p>
          </div>
          <button
            onClick={handleCreateBucket}
            disabled={!bucketName.trim() || creating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-cloud-700 disabled:text-cloud-500"
          >
            <FolderPlus className="h-4 w-4" />
            Create Storage
          </button>
        </div>
      )}

      {/* Bucket created — upload image */}
      {bucketCreated && !stored && !existingStorage && (
        <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
              <HardDrive className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{bucketName.toLowerCase().replace(/\s+/g, '-')}</h3>
              <Badge variant="accent">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Active
              </Badge>
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-cloud-600 px-5 py-6 text-sm font-medium text-cloud-300 transition hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-300"
          >
            <Upload className="h-5 w-5" />
            Click to select an image (stays on your device)
          </button>

          {selectedFile && (
            <div className="rounded-lg border border-cloud-700 bg-cloud-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cloud-700/50 overflow-hidden">
                  {selectedFile.dataUrl ? (
                    <img src={selectedFile.dataUrl} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-cloud-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-cloud-100">{selectedFile.name}</p>
                  <p className="text-xs text-cloud-500">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={handleStoreImage}
                disabled={storing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Store Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <MissionLayout
      missionNumber={2}
      title="Mission 2: Give Your Application a Place to Store Files"
      subtitle="Storage — file storage in the cloud"
      icon={<HardDrive className="h-7 w-7 text-white" />}
      accentColor="bg-gradient-to-br from-amber-400 to-amber-600"
      isUnlocked={isUnlocked}
      lockedReason="Complete Mission 1: Compute to unlock this mission."
      whatAreWeDoing="Your application needs to store files such as images. Cloud storage gives applications a place to keep those files."
      whyWeNeedIt="Files stored in the cloud can be accessed by your server from anywhere. This is how apps display user avatars, product photos, and more."
      task={task}
      whatYouLearned={isDone ? "You learned that 'Storage' means keeping files in cloud buckets. In real AWS, this service is called Amazon S3." : undefined}
      onNext={isDone ? () => onNavigate('database') : undefined}
      nextLabel="Continue to Mission 3: Database"
    >
      {creating && (
        <div className="mb-6">
          <SimulatedProgress step={step + 1} total={createSteps.length} label={createSteps[step]} />
        </div>
      )}

      {storing && (
        <div className="mb-6">
          <SimulatedProgress step={storeStep + 1} total={storeSteps.length} label={storeSteps[storeStep]} />
        </div>
      )}

      {stored && existingStorage && (
        <>
          <SuccessBanner message="Storage Ready!" />

          <div className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                  <HardDrive className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{existingStorage.bucketName}</h3>
                  <p className="text-xs text-cloud-400">Connected to: {serverData?.name}</p>
                </div>
              </div>
              <Badge variant="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Stored
              </Badge>
            </div>

            {selectedFile && (
              <div className="rounded-lg border border-cloud-700 bg-cloud-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-cloud-700/50 overflow-hidden">
                    {selectedFile.dataUrl ? (
                      <img src={selectedFile.dataUrl} alt="stored" className="h-full w-full object-cover" />
                    ) : (
                      <FileIcon className="h-6 w-6 text-cloud-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cloud-100">{existingStorage.fileName}</p>
                    <p className="text-xs text-cloud-500">{formatBytes(existingStorage.fileSize)}</p>
                    <Badge variant="success">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Storage status: Stored
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Your application can now store images. +20 points</span>
            </div>
          </div>
        </>
      )}
    </MissionLayout>
  );
}

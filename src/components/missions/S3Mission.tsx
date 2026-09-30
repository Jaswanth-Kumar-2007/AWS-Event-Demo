import { useState, useRef } from 'react';
import { HardDrive, Upload, FileImage, FolderTree, ArrowDown, User } from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import QuizQuestion from '../QuizQuestion';
import TerminalLog from '../TerminalLog';
import { MISSIONS, SERVICES, QuizOption } from '@/lib/gameData';

interface S3MissionProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

const S3_OPTIONS: QuizOption[] = [
  { label: 'Amazon EC2', value: 'ec2', correct: false },
  { label: 'Amazon S3', value: 's3', correct: true },
  { label: 'Amazon RDS', value: 'rds', correct: false },
  { label: 'AWS Lambda', value: 'lambda', correct: false },
];

export default function S3Mission({ onComplete, hintsUsed, onHintUsed }: S3MissionProps) {
  const mission = MISSIONS[2];
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'upload' | 'done'>('intro');
  const [attempts, setAttempts] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      setPhase('upload');
      setLogs([{ text: 'Creating S3 bucket: campusconnect-assets...', type: 'info' }, { text: 'Bucket created successfully.', type: 'success' }]);
    } else {
      setAttempts((a) => a + 1);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const sizeKB = (file.size / 1024).toFixed(1);
    setFileSize(file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${sizeKB} KB`);
    setLogs((prev) => [
      ...prev,
      { text: `Uploading ${file.name}...`, type: 'info' },
      { text: `Upload complete. Object stored in campusconnect-assets.`, type: 'success' },
      { text: `Connected to EC2: campus-backend`, type: 'success' },
    ]);
    setTimeout(() => {
      setPhase('done');
      setShowModal(true);
    }, 1500);
  };

  if (phase === 'intro') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story={mission.story}
          points={mission.points}
        />
        <div className="card p-5 border-aws-blue/20">
          <h3 className="font-bold text-white mb-3">What is Amazon S3?</h3>
          <p className="text-aws-gray-light mb-4">
            S3 is object storage for files such as images, videos, documents, backups, and application files.
          </p>
          <div className="flex items-center justify-center gap-2 p-4 bg-aws-navy-dark rounded-lg">
            <div className="flex flex-col items-center gap-1">
              <Upload className="w-5 h-5 text-aws-blue" />
              <span className="text-xs text-aws-gray">Upload</span>
            </div>
            <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
            <div className="flex flex-col items-center gap-1">
              <HardDrive className="w-5 h-5 text-aws-orange" />
              <span className="text-xs text-aws-orange">Amazon S3</span>
            </div>
            <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
            <div className="flex flex-col items-center gap-1">
              <FileImage className="w-5 h-5 text-aws-green" />
              <span className="text-xs text-aws-gray">Secure Storage</span>
            </div>
            <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
            <div className="flex flex-col items-center gap-1">
              <User className="w-5 h-5 text-aws-blue" />
              <span className="text-xs text-aws-gray">Access</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-aws-yellow/10 border border-aws-yellow/30 rounded-lg">
            <p className="text-sm text-aws-yellow">
              <strong>Important:</strong> Databases store information <em>about</em> files. S3 stores the actual file/object.
            </p>
          </div>
        </div>
        <HintSystem missionId={3} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
        <button onClick={() => setPhase('quiz')} className="btn-primary w-full">
          Begin Challenge
        </button>
      </div>
    );
  }

  if (phase === 'quiz') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story="A student uploads a profile/event image. Where should the actual image file be stored?"
          points={mission.points}
        />
        <div className="card p-5">
          <QuizQuestion
            prompt="Where should the actual image file be stored?"
            options={S3_OPTIONS}
            onSelect={handleQuizAnswer}
            attempts={attempts}
            hint="Think about where applications keep actual image and document files."
          />
        </div>
        <HintSystem missionId={3} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  if (phase === 'upload') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story="Correct! Now upload an image to your S3 bucket."
          points={mission.points}
        />
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <FolderTree className="w-6 h-6 text-aws-orange" />
            <div>
              <h3 className="font-bold text-white">Bucket: campusconnect-assets</h3>
              <span className="badge-success">Active</span>
            </div>
          </div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-aws-gray-dark/40 rounded-lg p-8 text-center cursor-pointer hover:border-aws-orange/50 transition-all"
          >
            <Upload className="w-10 h-10 text-aws-orange mx-auto mb-3" />
            <p className="text-aws-gray-light font-medium">Click to select an image</p>
            <p className="text-xs text-aws-gray mt-1">Select any image from your computer (simulated upload)</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {fileName && (
            <div className="mt-4 p-3 bg-aws-navy-dark rounded-lg flex items-center gap-3 animate-fade-in">
              <FileImage className="w-5 h-5 text-aws-green" />
              <div>
                <p className="text-sm text-aws-gray-light font-mono">{fileName}</p>
                <p className="text-xs text-aws-gray">{fileSize}</p>
              </div>
            </div>
          )}
        </div>
        {logs.length > 0 && <TerminalLog lines={logs} />}
        <HintSystem missionId={3} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MissionIntro
        code={mission.code}
        title={mission.title}
        service={mission.service}
        story="Your image is stored in S3."
        points={mission.points}
      />
      <div className="card p-5 border-aws-green/20 glow-green">
        <h3 className="font-bold text-white mb-3">S3 Storage Details</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Bucket</p>
            <p className="text-sm text-aws-orange font-mono">campusconnect-assets</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Object</p>
            <p className="text-sm text-aws-green font-mono">{fileName}</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Size</p>
            <p className="text-sm text-aws-gray-light font-mono">{fileSize}</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Connected EC2</p>
            <p className="text-sm text-aws-blue-light font-mono">campus-backend</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-aws-navy-dark rounded-lg">
          <div className="flex flex-col items-center gap-1">
            <User className="w-5 h-5 text-aws-blue" />
            <span className="text-xs text-aws-gray">User</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-aws-orange font-mono">EC2</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <HardDrive className="w-5 h-5 text-aws-orange" />
            <span className="text-xs text-aws-orange">S3</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <FileImage className="w-5 h-5 text-aws-green" />
            <span className="text-xs text-aws-gray">Image</span>
          </div>
        </div>
      </div>
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Image Stored in S3!"
        points={mission.points}
        whatYouLearned="You used Amazon S3 because S3 is designed for storing objects such as images, documents, videos, and application files. The database stores information about the file, while S3 stores the actual file."
        realAwsConnection="In real AWS, S3 can be used to store uploaded files while the database stores information describing those files. Your EC2 instance can serve images from S3 directly or through CloudFront."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

import { useState } from 'react';
import { ShieldCheck, Users, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import QuizQuestion from '../QuizQuestion';
import TerminalLog from '../TerminalLog';
import { MISSIONS, SERVICES, QuizOption } from '@/lib/gameData';

interface CognitoMissionProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

const COGNITO_OPTIONS: QuizOption[] = [
  { label: 'Amazon Cognito', value: 'cognito', correct: true },
  { label: 'Amazon S3', value: 's3', correct: false },
  { label: 'Amazon EC2', value: 'ec2', correct: false },
  { label: 'AWS Lambda', value: 'lambda', correct: false },
];

export default function CognitoMission({ onComplete, hintsUsed, onHintUsed }: CognitoMissionProps) {
  const mission = MISSIONS[5];
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'simulate' | 'done'>('intro');
  const [attempts, setAttempts] = useState(0);
  const [logs, setLogs] = useState<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      setPhase('simulate');
      setLogs([
        { text: 'Creating User Pool: CampusConnectUsers...', type: 'info' },
        { text: 'User Pool created successfully.', type: 'success' },
        { text: 'Simulating student sign-up...', type: 'info' },
      ]);
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          { text: 'User: student@example.edu', type: 'info' },
          { text: 'Status: Authenticated', type: 'success' },
          { text: '5,000 students ready for authentication.', type: 'success' },
        ]);
      }, 1500);
      setTimeout(() => {
        setPhase('done');
        setShowModal(true);
      }, 3000);
    } else {
      setAttempts((a) => a + 1);
    }
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
        <div className="card p-5 border-aws-orange/20">
          <h3 className="font-bold text-white mb-3">What is Amazon Cognito?</h3>
          <p className="text-aws-gray-light mb-3">
            Cognito can be used for user authentication — sign-up, login, and access control.
            Instead of building your own login system, Cognito handles it for you.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 bg-aws-navy-dark rounded-lg flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-aws-orange" />
              <span className="text-sm text-aws-gray-light">Sign-up</span>
            </div>
            <div className="p-3 bg-aws-navy-dark rounded-lg flex items-center gap-3">
              <LogIn className="w-5 h-5 text-aws-orange" />
              <span className="text-sm text-aws-gray-light">Login</span>
            </div>
          </div>
        </div>
        <HintSystem missionId={6} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
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
          story="CampusConnect now has 5,000 students. The team needs sign-up, login, and user authentication."
          points={mission.points}
        />
        <div className="card p-5">
          <QuizQuestion
            prompt="Which AWS service should handle user authentication?"
            options={COGNITO_OPTIONS}
            onSelect={handleQuizAnswer}
            attempts={attempts}
            hint="You need a service designed specifically for user sign-up and login."
          />
        </div>
        <HintSystem missionId={6} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  if (phase === 'simulate') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story="Setting up authentication for 5,000 students..."
          points={mission.points}
        />
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-aws-orange" />
            <h3 className="font-bold text-white">CampusConnectUsers — User Pool</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-aws-navy-dark border border-aws-gray-dark/30 flex items-center justify-center animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Users className="w-4 h-4 text-aws-orange/50" />
              </div>
            ))}
          </div>
          <p className="text-xs text-aws-gray mt-2 text-center">Simulating 5,000 student users...</p>
        </div>
        {logs.length > 0 && <TerminalLog lines={logs} />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MissionIntro
        code={mission.code}
        title={mission.title}
        service={mission.service}
        story="Authentication is ready."
        points={mission.points}
      />
      <div className="card p-5 border-aws-green/20 glow-green">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-aws-green/20">
            <ShieldCheck className="w-8 h-8 text-aws-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Authentication Active</h3>
            <span className="badge-success">Authenticated</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">User Pool</p>
            <p className="text-sm text-aws-orange font-mono">CampusConnectUsers</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Simulated User</p>
            <p className="text-sm text-aws-blue-light font-mono">student@example.edu</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Status</p>
            <p className="text-sm text-aws-green font-mono">Authenticated</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Users</p>
            <p className="text-sm text-aws-gray-light font-mono">5,000 ready</p>
          </div>
        </div>
        <p className="text-xs text-aws-gray-dark mt-3">* No real passwords or credentials collected. This is a simulation.</p>
      </div>
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Authentication Configured!"
        points={mission.points}
        whatYouLearned="You used Amazon Cognito because Cognito handles user authentication — sign-up, login, and access control. CampusConnect can now authenticate 5,000 students without building a custom login system."
        realAwsConnection="In real AWS, Cognito User Pools manage user directories, authentication, and tokens. You can add social login, multi-factor authentication, and control access to your APIs and resources — all without storing passwords yourself."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

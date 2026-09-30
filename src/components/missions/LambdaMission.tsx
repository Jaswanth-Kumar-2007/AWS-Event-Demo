import { useState } from 'react';
import { Zap, User, ArrowDown, CheckCircle2 } from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import QuizQuestion from '../QuizQuestion';
import TerminalLog from '../TerminalLog';
import { MISSIONS, SERVICES, QuizOption } from '@/lib/gameData';

interface LambdaMissionProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

const LAMBDA_OPTIONS: QuizOption[] = [
  { label: 'Amazon EC2', value: 'ec2', correct: false },
  { label: 'Amazon S3', value: 's3', correct: false },
  { label: 'AWS Lambda', value: 'lambda', correct: true },
  { label: 'Amazon RDS', value: 'rds', correct: false },
];

export default function LambdaMission({ onComplete, hintsUsed, onHintUsed }: LambdaMissionProps) {
  const mission = MISSIONS[4];
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'execute' | 'done'>('intro');
  const [attempts, setAttempts] = useState(0);
  const [logs, setLogs] = useState<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      setPhase('execute');
      setLogs([
        { text: 'EVENT DETECTED: Registration Submitted', type: 'warning' },
        { text: 'Invoking function: processRegistration', type: 'info' },
      ]);
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          { text: 'FUNCTION: processRegistration', type: 'info' },
          { text: 'Status: Completed', type: 'success' },
          { text: 'Execution time: 120 ms', type: 'success' },
          { text: 'Database updated. Confirmation sent.', type: 'success' },
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
          <h3 className="font-bold text-white mb-3">What is Serverless?</h3>
          <p className="text-aws-gray-light mb-3">
            Serverless means you run code without managing the underlying servers yourself.
            AWS Lambda runs your code only when an event occurs — you do not need to keep a server running 24/7.
          </p>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-sm text-aws-orange font-medium">
              Think of it like a light switch: the light turns on only when you flip the switch (an event happens). You do not need to keep the light on all the time.
            </p>
          </div>
        </div>
        <HintSystem missionId={5} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
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
          story="A student submits an event registration. EVENT DETECTED."
          points={mission.points}
        />
        <div className="card p-5">
          <QuizQuestion
            prompt="What should process this event?"
            options={LAMBDA_OPTIONS}
            onSelect={handleQuizAnswer}
            attempts={attempts}
            hint="You need something that runs code only when an event occurs."
          />
        </div>
        <HintSystem missionId={5} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  if (phase === 'execute') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story="Lambda is processing the event..."
          points={mission.points}
        />
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">Lambda Execution Flow</h3>
          <div className="flex flex-col items-center gap-2 mb-4">
            {['User', 'Registration', 'Lambda', 'Process Request', 'Database Update', 'Confirmation'].map((step, i) => (
              <div key={step} className="flex flex-col items-center animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
                <div className={`px-4 py-2 rounded-lg border-2 ${
                  step === 'Lambda' ? 'border-aws-orange bg-aws-orange/10 text-aws-orange' : 'border-aws-gray-dark/30 bg-aws-navy-dark text-aws-gray-light'
                }`}>
                  <span className="text-sm font-medium">{step}</span>
                </div>
                {i < 5 && <ArrowDown className="w-4 h-4 text-aws-gray-dark my-1" />}
              </div>
            ))}
          </div>
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
        story="Lambda execution complete."
        points={mission.points}
      />
      <div className="card p-5 border-aws-green/20 glow-green">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-aws-green/20">
            <Zap className="w-8 h-8 text-aws-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Simulated Lambda Execution</h3>
            <span className="badge-success">Completed</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Function</p>
            <p className="text-sm text-aws-orange font-mono">processRegistration</p>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg">
            <p className="text-xs text-aws-gray">Execution time</p>
            <p className="text-sm text-aws-green font-mono">120 ms</p>
          </div>
        </div>
        <p className="text-xs text-aws-gray-dark mt-3">* Simulated metrics — not real AWS execution data.</p>
      </div>
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Serverless Processing Complete!"
        points={mission.points}
        whatYouLearned="You used AWS Lambda because Lambda runs code when an event occurs without managing servers. When a student submits a registration, Lambda processes it, updates the database, and sends a confirmation — all automatically."
        realAwsConnection="In real AWS, Lambda functions can be triggered by events from S3, API Gateway, DynamoDB Streams, and many other sources. You only pay for the compute time used — no server needs to be running when no events occur."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

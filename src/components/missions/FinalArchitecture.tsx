import { useState } from 'react';
import {
  Cloud, Server, HardDrive, Database, Zap, ShieldCheck, Network,
  Users, ArrowDown, CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import TerminalLog from '../TerminalLog';
import { MISSIONS, FINAL_EVENTS } from '@/lib/gameData';

interface FinalArchitectureProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

const SERVICE_NODES = [
  { key: 'vpc', label: 'VPC', icon: Network, color: 'blue' },
  { key: 'ec2', label: 'EC2', icon: Server, color: 'orange' },
  { key: 's3', label: 'S3', icon: HardDrive, color: 'blue' },
  { key: 'rds', label: 'RDS', icon: Database, color: 'green' },
  { key: 'dynamodb', label: 'DynamoDB', icon: Database, color: 'green' },
  { key: 'aurora', label: 'Aurora', icon: Database, color: 'green' },
  { key: 'lambda', label: 'Lambda', icon: Zap, color: 'orange' },
  { key: 'cognito', label: 'Cognito', icon: ShieldCheck, color: 'orange' },
];

export default function FinalArchitecture({ onComplete, hintsUsed, onHintUsed }: FinalArchitectureProps) {
  const mission = MISSIONS[6];
  const [phase, setPhase] = useState<'intro' | 'events' | 'complete'>('intro');
  const [currentEvent, setCurrentEvent] = useState(0);
  const [eventResults, setEventResults] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [logs, setLogs] = useState<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const handleAnswer = (value: string, correct: boolean) => {
    if (showFeedback && correct) return;
    setSelectedAnswer(value);
    if (correct) {
      setShowFeedback(true);
      const newResults = [...eventResults, true];
      setEventResults(newResults);
      setLogs((prev) => [
        ...prev,
        { text: `${FINAL_EVENTS[currentEvent].label}: Correct routing detected.`, type: 'success' },
      ]);
      setTimeout(() => {
        if (currentEvent + 1 < FINAL_EVENTS.length) {
          setCurrentEvent((e) => e + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setWrongAttempts(0);
        } else {
          setPhase('complete');
          setShowModal(true);
          setLogs((prev) => [
            ...prev,
            { text: 'All events routed successfully!', type: 'success' },
            { text: 'CLOUD ARCHITECTURE STABLE', type: 'success' },
          ]);
        }
      }, 1500);
    } else {
      setShowFeedback(true);
      setWrongAttempts((a) => a + 1);
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story="TRAFFIC SPIKE DETECTED — 50,000 students are trying to access CampusConnect. You must route each event to the correct AWS service."
          points={mission.points}
        />
        <div className="card p-5 border-aws-red/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-aws-red/20 animate-pulse">
              <AlertTriangle className="w-8 h-8 text-aws-red" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-aws-red">TRAFFIC SPIKE DETECTED</h3>
              <p className="text-sm text-aws-gray-light">50,000 students are trying to access CampusConnect</p>
            </div>
          </div>
          <p className="text-aws-gray-light mb-4">
            You have built all the pieces. Now prove you understand how they fit together.
            For each event, choose the correct AWS service to handle it.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SERVICE_NODES.map((node) => {
              const Icon = node.icon;
              return (
                <div key={node.key} className="p-3 bg-aws-navy-dark rounded-lg border border-aws-gray-dark/30 text-center">
                  <Icon className="w-6 h-6 text-aws-orange mx-auto mb-1" />
                  <span className="text-xs text-aws-gray-light font-mono">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <HintSystem missionId={7} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
        <button onClick={() => setPhase('events')} className="btn-primary w-full">
          Begin Final Challenge
        </button>
      </div>
    );
  }

  if (phase === 'events') {
    const event = FINAL_EVENTS[currentEvent];
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story={`Event ${currentEvent + 1} of ${FINAL_EVENTS.length}: ${event.label}`}
          points={mission.points}
        />
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-error">{event.label}</span>
            <div className="flex gap-1">
              {FINAL_EVENTS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < currentEvent ? 'bg-aws-green' : i === currentEvent ? 'bg-aws-orange' : 'bg-aws-gray-dark/30'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-lg text-aws-gray-light font-medium mb-4">{event.prompt}</p>
          <div className="grid gap-3">
            {event.options.map((option) => {
              const isSelected = selectedAnswer === option.value;
              const showCorrect = showFeedback && option.correct;
              const showWrong = isSelected && showFeedback && !option.correct;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value, option.correct)}
                  disabled={showFeedback && (option.correct || isSelected)}
                  className={`card p-4 text-left transition-all duration-300 flex items-center justify-between ${
                    showCorrect
                      ? 'border-aws-green bg-aws-green/10 glow-green'
                      : showWrong
                      ? 'border-aws-red bg-aws-red/10'
                      : 'hover:border-aws-orange/40 hover:translate-x-1'
                  }`}
                >
                  <span className={`font-medium ${showCorrect ? 'text-aws-green' : showWrong ? 'text-aws-red' : 'text-aws-gray-light'}`}>
                    {option.label}
                  </span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-aws-green" />}
                  {showWrong && <XCircle className="w-5 h-5 text-aws-red" />}
                </button>
              );
            })}
          </div>
          {showFeedback && selectedAnswer && !event.options.find((o) => o.value === selectedAnswer)?.correct && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-aws-red/10 border border-aws-red/30 rounded-lg animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-aws-red shrink-0" />
              <p className="text-sm text-aws-red">
                Not quite. Think about what this service is designed to do.
                {wrongAttempts >= 2 && <span className="block mt-1 text-aws-yellow">Hint: {MISSION_HINTS_HINT}</span>}
              </p>
            </div>
          )}
        </div>
        {logs.length > 0 && <TerminalLog lines={logs} />}
        <HintSystem missionId={7} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MissionIntro
        code={mission.code}
        title={mission.title}
        service={mission.service}
        story="All events routed successfully!"
        points={mission.points}
      />
      <div className="card p-6 border-aws-green/30 glow-green text-center">
        <h2 className="text-2xl font-bold text-aws-green mb-2">CLOUD ARCHITECTURE STABLE</h2>
        <p className="text-4xl font-mono font-bold text-white mb-2">100 / 100</p>
        <p className="text-lg text-aws-orange font-bold">MISSION COMPLETE</p>
      </div>
      <div className="card p-5">
        <h3 className="font-bold text-white mb-4 text-center">Final Architecture</h3>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <Users className="w-8 h-8 text-aws-blue" />
            <span className="text-xs text-aws-gray">USERS</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-8 h-8 text-aws-orange" />
            <span className="text-xs text-aws-orange">COGNITO</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <Network className="w-8 h-8 text-aws-blue" />
            <span className="text-xs text-aws-blue">VPC</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <Server className="w-8 h-8 text-aws-orange" />
            <span className="text-xs text-aws-orange">EC2</span>
          </div>
          <div className="flex items-start gap-4">
            <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <HardDrive className="w-8 h-8 text-aws-blue" />
              <span className="text-xs text-aws-blue">S3</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Database className="w-8 h-8 text-aws-green" />
              <span className="text-xs text-aws-green">RDS / Aurora / DynamoDB</span>
            </div>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-8 h-8 text-aws-orange" />
            <span className="text-xs text-aws-orange">LAMBDA</span>
          </div>
          <ArrowDown className="w-4 h-4 text-aws-gray-dark" />
          <span className="text-xs text-aws-gray">Event Processing</span>
        </div>
      </div>
      <div className="card p-5 border-aws-green/20">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'VPC', icon: Network },
            { label: 'EC2', icon: Server },
            { label: 'S3', icon: HardDrive },
            { label: 'Database', icon: Database },
            { label: 'Lambda', icon: Zap },
            { label: 'Cognito', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2 p-3 bg-aws-green/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-aws-green" />
                <Icon className="w-4 h-4 text-aws-green" />
                <span className="text-sm text-aws-green font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card p-5 border-aws-orange/20 text-center">
        <p className="text-lg text-white font-bold mb-2">You built your first simulated AWS architecture.</p>
        <p className="text-sm text-aws-gray-light mb-4">
          In a real AWS environment, these services would be deployed and configured using AWS.
        </p>
        <span className="badge-warning">SIMULATION — NO REAL AWS RESOURCES CREATED</span>
      </div>
      {logs.length > 0 && <TerminalLog lines={logs} />}
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Final Architecture Complete!"
        points={mission.points}
        whatYouLearned="You assembled a complete cloud architecture: Cognito for authentication, VPC for networking, EC2 for compute, S3 for storage, RDS/Aurora/DynamoDB for databases, and Lambda for event processing. You routed real-world events to the correct services."
        realAwsConnection="In real AWS, these services work together to build scalable, secure applications. You would use the AWS Console, CLI, or Infrastructure as Code tools to deploy and configure them. Your next step is to continue learning through AWS Builder Center and AWS Student Builder Group activities."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

const MISSION_HINTS_HINT = 'Login → Cognito, Upload → S3, Registration → Lambda, Lookup → RDS, Processing → Lambda.';

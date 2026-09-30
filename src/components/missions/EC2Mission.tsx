import { useState } from 'react';
import { Server, Cpu, MemoryStick, Network, Power } from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import QuizQuestion from '../QuizQuestion';
import TerminalLog from '../TerminalLog';
import { MISSIONS, SERVICES, QuizOption } from '@/lib/gameData';

interface EC2MissionProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

const EC2_OPTIONS: QuizOption[] = [
  { label: 'Amazon S3', value: 's3', correct: false },
  { label: 'Amazon EC2', value: 'ec2', correct: true },
  { label: 'Amazon S3', value: 's3_2', correct: false },
  { label: 'AWS Lambda', value: 'lambda', correct: false },
];

const SIZES = [
  { label: 'Small', vcpu: '2 vCPU', memory: '4 GB', desc: 'Good for testing' },
  { label: 'Medium', vcpu: '4 vCPU', memory: '8 GB', desc: 'Balanced for apps' },
  { label: 'Large', vcpu: '8 vCPU', memory: '16 GB', desc: 'High performance' },
];

export default function EC2Mission({ onComplete, hintsUsed, onHintUsed }: EC2MissionProps) {
  const mission = MISSIONS[1];
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'launch' | 'running' | 'done'>('intro');
  const [attempts, setAttempts] = useState(0);
  const [serverName, setServerName] = useState('campus-backend');
  const [selectedSize, setSelectedSize] = useState(0);
  const [logs, setLogs] = useState<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }[]>([]);
  const [showModal, setShowModal] = useState(false);

  const ec2Service = SERVICES.find((s) => s.key === 'ec2')!;

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      setPhase('launch');
    } else {
      setAttempts((a) => a + 1);
    }
  };

  const handleLaunch = () => {
    setPhase('running');
    const size = SIZES[selectedSize];
    setLogs([
      { text: 'Initializing EC2 instance launch...', type: 'info' },
      { text: `Instance name: ${serverName}`, type: 'info' },
      { text: `Instance size: ${size.label} (${size.vcpu}, ${size.memory})`, type: 'info' },
      { text: 'Network: CampusConnect VPC', type: 'info' },
      { text: 'Launching instance...', type: 'warning' },
    ]);
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { text: 'Instance state: RUNNING', type: 'success' },
        { text: 'EC2 instance ready for traffic.', type: 'success' },
      ]);
      setTimeout(() => {
        setPhase('done');
        setShowModal(true);
      }, 1500);
    }, 2000);
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
          <h3 className="font-bold text-white mb-3">What is Amazon EC2?</h3>
          <p className="text-aws-gray-light mb-3">
            Imagine your website needs a computer to run. Instead of buying a physical computer,
            AWS lets you use a virtual computer in its data center.
          </p>
          <div className="flex items-center gap-2 p-3 bg-aws-navy-dark rounded-lg">
            <Cpu className="w-5 h-5 text-aws-orange" />
            <span className="text-aws-gray">+</span>
            <MemoryStick className="w-5 h-5 text-aws-orange" />
            <span className="text-aws-gray">+</span>
            <Server className="w-5 h-5 text-aws-orange" />
            <span className="text-aws-gray">=</span>
            <span className="text-aws-orange font-bold">Computer</span>
          </div>
          <p className="text-sm text-aws-gray mt-3">
            EC2 gives you a virtual computer running in an AWS data center. CPU + RAM + Storage = Computer.
          </p>
        </div>
        <HintSystem missionId={2} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
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
          story="CampusConnect needs a server to run its backend application."
          points={mission.points}
        />
        <div className="card p-5">
          <QuizQuestion
            prompt="What should provide computing power?"
            options={EC2_OPTIONS}
            onSelect={handleQuizAnswer}
            attempts={attempts}
            hint="Think about what provides virtual servers in the cloud."
          />
        </div>
        <HintSystem missionId={2} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  if (phase === 'launch') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story="Correct! Now launch your EC2 instance."
          points={mission.points}
        />
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">Launch Instance</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-aws-gray-light mb-2 block">Server Name</label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="input-field"
                placeholder="campus-backend"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-aws-gray-light mb-2 block">Instance Size</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {SIZES.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSize === i
                        ? 'border-aws-orange bg-aws-orange/10'
                        : 'border-aws-gray-dark/30 bg-aws-navy-dark hover:border-aws-orange/40'
                    }`}
                  >
                    <p className="font-bold text-white">{size.label}</p>
                    <p className="text-xs text-aws-gray-light mt-1">{size.vcpu}</p>
                    <p className="text-xs text-aws-gray-light">{size.memory}</p>
                    <p className="text-xs text-aws-gray mt-1">{size.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleLaunch} className="btn-primary w-full flex items-center justify-center gap-2">
              <Power className="w-5 h-5" />
              Launch Instance
            </button>
          </div>
        </div>
        <HintSystem missionId={2} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MissionIntro
        code={mission.code}
        title={mission.title}
        service={mission.service}
        story="Your EC2 instance is now running."
        points={mission.points}
      />
      <div className="card p-5 border-aws-green/20 glow-green">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-aws-green/20">
            <Server className="w-8 h-8 text-aws-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">EC2 INSTANCE</h3>
            <span className="badge-success">Status: Running</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-aws-navy-dark rounded-lg flex items-center gap-2">
            <Cpu className="w-4 h-4 text-aws-orange" />
            <span className="text-sm text-aws-gray-light">CPU: {SIZES[selectedSize].vcpu}</span>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg flex items-center gap-2">
            <MemoryStick className="w-4 h-4 text-aws-orange" />
            <span className="text-sm text-aws-gray-light">Memory: {SIZES[selectedSize].memory}</span>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg flex items-center gap-2">
            <Network className="w-4 h-4 text-aws-orange" />
            <span className="text-sm text-aws-gray-light">Network: CampusConnect VPC</span>
          </div>
          <div className="p-3 bg-aws-navy-dark rounded-lg flex items-center gap-2">
            <Server className="w-4 h-4 text-aws-orange" />
            <span className="text-sm text-aws-gray-light">Name: {serverName}</span>
          </div>
        </div>
        <p className="text-xs text-aws-gray-dark mt-3">* Simulated values — no real AWS resources created.</p>
      </div>
      {logs.length > 0 && <TerminalLog lines={logs} />}
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="EC2 Instance Launched!"
        points={mission.points}
        whatYouLearned="You used Amazon EC2 because EC2 provides virtual servers in the AWS cloud. Your CampusConnect backend now has computing power running inside your VPC."
        realAwsConnection="In real AWS, you would launch an EC2 instance from the AWS Console or CLI, choose an Amazon Machine Image (AMI), select an instance type, configure security groups, and connect via SSH or Session Manager."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

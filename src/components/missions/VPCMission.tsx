import { useState } from 'react';
import { Network, Globe, Server, Database, ArrowDown, CheckCircle2, Lock } from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import TerminalLog from '../TerminalLog';
import { MISSIONS, SERVICES } from '@/lib/gameData';

interface VPCMissionProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

const LAYERS = [
  { id: 'internet', label: 'Public Internet', icon: Globe, desc: 'The outside world' },
  { id: 'vpc', label: 'VPC', icon: Network, desc: 'Your private cloud network' },
  { id: 'app', label: 'Application Network', icon: Server, desc: 'Where your servers run' },
  { id: 'db', label: 'Database Network', icon: Database, desc: 'Where your databases live' },
];

export default function VPCMission({ onComplete, hintsUsed, onHintUsed }: VPCMissionProps) {
  const mission = MISSIONS[0];
  const [phase, setPhase] = useState<'intro' | 'connect' | 'done'>('intro');
  const [connected, setConnected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }[]>([]);

  const vpcService = SERVICES.find((s) => s.key === 'vpc')!;

  const handleConnect = (layerId: string) => {
    if (connected.includes(layerId)) return;
    const expected = LAYERS[connected.length];
    if (layerId === expected.id) {
      const newConnected = [...connected, layerId];
      setConnected(newConnected);
      setLogs((prev) => [
        ...prev,
        { text: `Connecting ${expected.label}...`, type: 'info' },
        { text: `${expected.label} connected successfully.`, type: 'success' },
      ]);
      if (newConnected.length === LAYERS.length) {
        setLogs((prev) => [
          ...prev,
          { text: 'VPC network topology established.', type: 'success' },
          { text: 'Network isolation: ENABLED', type: 'success' },
        ]);
        setTimeout(() => {
          setPhase('done');
          setShowModal(true);
        }, 1000);
      }
    } else {
      setLogs((prev) => [
        ...prev,
        { text: `Wrong order. Connect ${expected.label} next.`, type: 'warning' },
      ]);
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
        <div className="card p-5 border-aws-blue/20">
          <h3 className="font-bold text-white mb-3">What is a VPC?</h3>
          <p className="text-aws-gray-light mb-3">
            VPC gives your AWS resources a network environment where you can control how resources communicate.
            Think of it as building a private campus with different buildings for different purposes.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className="p-3 bg-aws-navy-dark rounded-lg border border-aws-blue/20">
              <Globe className="w-5 h-5 text-aws-blue mb-2" />
              <p className="text-xs text-aws-gray-light">Public Internet — where users come from</p>
            </div>
            <div className="p-3 bg-aws-navy-dark rounded-lg border border-aws-orange/20">
              <Network className="w-5 h-5 text-aws-orange mb-2" />
              <p className="text-xs text-aws-gray-light">VPC — your private network boundary</p>
            </div>
            <div className="p-3 bg-aws-navy-dark rounded-lg border border-aws-green/20">
              <Database className="w-5 h-5 text-aws-green mb-2" />
              <p className="text-xs text-aws-gray-light">Private subnets — isolated layers</p>
            </div>
          </div>
        </div>
        <HintSystem missionId={1} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
        <button onClick={() => setPhase('connect')} className="btn-primary w-full">
          Start Building Network
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MissionIntro
        code={mission.code}
        title={mission.title}
        service={mission.service}
        story="Connect the network layers in the correct order: Internet → VPC → Application → Database"
        points={mission.points}
      />
      <div className="card p-5">
        <h3 className="font-bold text-white mb-2">Where should your application infrastructure live?</h3>
        <p className="text-sm text-aws-gray mb-4">Click each layer in order from top to bottom to build the network.</p>
        <div className="space-y-2">
          {LAYERS.map((layer, i) => {
            const isConnected = connected.includes(layer.id);
            const isNext = i === connected.length;
            const Icon = layer.icon;
            return (
              <div key={layer.id}>
                <button
                  onClick={() => handleConnect(layer.id)}
                  disabled={isConnected || !isNext}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all duration-300 ${
                    isConnected
                      ? 'border-aws-green bg-aws-green/10'
                      : isNext
                      ? 'border-aws-orange bg-aws-orange/5 hover:bg-aws-orange/10 cursor-pointer animate-pulse-glow'
                      : 'border-aws-gray-dark/30 bg-aws-navy-dark opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isConnected ? 'bg-aws-green/20' : 'bg-aws-navy-dark'}`}>
                    {isConnected ? (
                      <CheckCircle2 className="w-5 h-5 text-aws-green" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isNext ? 'text-aws-orange' : 'text-aws-gray-dark'}`} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${isConnected ? 'text-aws-green' : isNext ? 'text-aws-orange' : 'text-aws-gray'}`}>
                      {layer.label}
                    </p>
                    <p className="text-xs text-aws-gray">{layer.desc}</p>
                  </div>
                  {!isConnected && !isNext && <Lock className="w-4 h-4 text-aws-gray-dark ml-auto" />}
                </button>
                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className={`w-4 h-4 ${isConnected ? 'text-aws-green' : 'text-aws-gray-dark'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {logs.length > 0 && <TerminalLog lines={logs} />}
      <HintSystem missionId={1} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Network Foundation Built!"
        points={mission.points}
        whatYouLearned="You used Amazon VPC to create a private network with separated layers: public internet, application network, and database network. Network separation matters because it isolates your databases from direct internet access while allowing your application servers to serve users."
        realAwsConnection="In real AWS, a VPC lets you create public and private subnets, control traffic with security groups and route tables, and keep sensitive resources like databases in private subnets that cannot be reached from the internet directly."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

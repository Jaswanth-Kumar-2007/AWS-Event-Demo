import { Cloud, Server, HardDrive, Database, Zap, ShieldCheck, Network, ArrowRight, Users, Activity } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  onServices: () => void;
  onLeaderboard: () => void;
}

export default function LandingPage({ onStart, onHowItWorks, onServices, onLeaderboard }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden grid-bg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-aws-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aws-navy-light/80 border border-aws-orange/30 mb-6 animate-fade-in">
            <Cloud className="w-4 h-4 text-aws-orange" />
            <span className="text-xs font-mono text-aws-orange uppercase tracking-widest">Interactive AWS Learning Game</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-3 animate-fade-in-up">
            <span className="text-gradient-orange">AWS CLOUD MISSION</span>
          </h1>
          <p className="text-lg sm:text-xl text-aws-gray-light mb-2 animate-fade-in-up">
            Build. Connect. Survive.
          </p>
          <p className="text-base text-aws-gray mb-8 max-w-2xl mx-auto animate-fade-in-up">
            Can you build a cloud architecture that survives the campus rush?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up">
            <button onClick={onStart} className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
              <Zap className="w-5 h-5" />
              START MISSION
            </button>
            <button onClick={onHowItWorks} className="btn-secondary">How It Works</button>
            <button onClick={onServices} className="btn-secondary">AWS Services</button>
            <button onClick={onLeaderboard} className="btn-secondary">Leaderboard</button>
          </div>
        </div>
      </div>

      {/* CampusConnect Story */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="card p-6 sm:p-8 border-aws-orange/20">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-aws-orange" />
            <h2 className="text-xl font-bold text-white">Your Mission</h2>
          </div>
          <p className="text-aws-gray-light mb-4 text-lg">
            You are the cloud engineer for <span className="text-aws-orange font-bold">CampusConnect</span>,
            a fictional college platform.
          </p>
          <p className="text-aws-gray mb-6">
            CampusConnect is launching a new platform for a major college event. The platform will have
            thousands of users. Students will register, log in, view event information, upload images,
            store registration information, and submit actions that trigger backend processing.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: 'User Authentication', desc: 'Sign-up and login' },
              { icon: Server, label: 'Application Servers', desc: 'Backend compute power' },
              { icon: HardDrive, label: 'Image / File Storage', desc: 'Store uploaded files' },
              { icon: Database, label: 'Student / App Data', desc: 'Structured data storage' },
              { icon: Zap, label: 'Event-Driven Processing', desc: 'Process registrations' },
              { icon: Network, label: 'Secure Networking', desc: 'Private cloud network' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-4 bg-aws-navy-dark rounded-lg border border-aws-gray-dark/30 hover:border-aws-orange/30 transition-all">
                  <Icon className="w-6 h-6 text-aws-orange mb-2" />
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-aws-gray">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Architecture Preview */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-aws-blue" />
            <h2 className="text-xl font-bold text-white">Architecture Preview</h2>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <Users className="w-10 h-10 text-aws-blue" />
              <span className="text-xs text-aws-gray">USERS</span>
            </div>
            <ArrowRight className="w-5 h-5 text-aws-gray-dark rotate-90" />
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-10 h-10 text-aws-orange" />
              <span className="text-xs text-aws-orange">COGNITO</span>
            </div>
            <ArrowRight className="w-5 h-5 text-aws-gray-dark rotate-90" />
            <div className="flex flex-col items-center gap-1">
              <Network className="w-10 h-10 text-aws-blue" />
              <span className="text-xs text-aws-blue">VPC</span>
            </div>
            <ArrowRight className="w-5 h-5 text-aws-gray-dark rotate-90" />
            <div className="flex flex-col items-center gap-1">
              <Server className="w-10 h-10 text-aws-orange" />
              <span className="text-xs text-aws-orange">EC2</span>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-1">
                <HardDrive className="w-10 h-10 text-aws-blue" />
                <span className="text-xs text-aws-blue">S3</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Database className="w-10 h-10 text-aws-green" />
                <span className="text-xs text-aws-green">DATABASE</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-aws-gray-dark rotate-90" />
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-10 h-10 text-aws-orange" />
              <span className="text-xs text-aws-orange">LAMBDA</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="card p-8 text-center border-aws-orange/20 glow-orange">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to begin?</h2>
          <p className="text-aws-gray mb-6">7 missions. 100 points. One architecture to build.</p>
          <button onClick={onStart} className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            <Zap className="w-5 h-5" />
            START MISSION
          </button>
          <p className="text-xs text-aws-gray-dark mt-4">
            SIMULATION — No real AWS resources created. No AWS credentials required.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-aws-gray-dark/20 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-aws-gray-dark">
            AWS Cloud Mission — Educational Simulation. Don't just learn the cloud. Build the architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}

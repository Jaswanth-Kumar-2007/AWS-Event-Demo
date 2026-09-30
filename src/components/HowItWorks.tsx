import { Rocket, Cloud, ArrowRight, ExternalLink } from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
  onStart: () => void;
}

const STEPS = [
  { num: '01', title: 'Register', desc: 'Enter your name and College ID to join the mission.' },
  { num: '02', title: 'Learn', desc: 'Each mission introduces an AWS service with simple explanations and real-world analogies.' },
  { num: '03', title: 'Decide', desc: 'Answer questions and make architecture decisions. Wrong answers give hints, not penalties.' },
  { num: '04', title: 'Build', desc: 'Launch simulated EC2 instances, create S3 buckets, configure databases, and more.' },
  { num: '05', title: 'Connect', desc: 'Connect services together to form a complete cloud architecture.' },
  { num: '06', title: 'Survive', desc: 'Handle a traffic spike of 50,000 students by routing events to the correct services.' },
  { num: '07', title: 'Complete', desc: 'Finish all 7 missions and earn 100 points to become a Cloud Engineer.' },
];

export default function HowItWorks({ onBack, onStart }: HowItWorksProps) {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-6">
      <button onClick={onBack} className="btn-ghost flex items-center gap-2 mb-6">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-aws-orange/10 mb-3">
          <Rocket className="w-8 h-8 text-aws-orange" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">How It Works</h1>
        <p className="text-sm text-aws-gray">7 missions from beginner to cloud engineer</p>
      </div>

      <div className="space-y-3 mb-8">
        {STEPS.map((step) => (
          <div key={step.num} className="card p-4 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-aws-navy-dark shrink-0">
              <span className="text-lg font-mono font-bold text-aws-orange">{step.num}</span>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-aws-gray-light">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 text-center border-aws-orange/20">
        <Cloud className="w-10 h-10 text-aws-orange mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Ready to start?</h2>
        <p className="text-sm text-aws-gray mb-4">
          Learn, decide, build, connect, survive, and complete your first AWS architecture.
        </p>
        <button onClick={onStart} className="btn-primary inline-flex items-center gap-2">
          Start Mission <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="card p-5 mt-4 border-aws-blue/20">
        <h3 className="font-bold text-white mb-2 text-sm">Ready to Build for Real?</h3>
        <p className="text-sm text-aws-gray-light mb-3">
          You've completed a simulated AWS architecture. Your next step is to continue learning
          through AWS Builder Center and AWS Student Builder Group activities.
        </p>
        <a
          href="https://aws.amazon.com/builder-center/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-2 text-sm"
        >
          Explore AWS Builder Center <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

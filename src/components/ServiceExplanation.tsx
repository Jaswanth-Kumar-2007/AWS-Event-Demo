import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import type { ServiceInfo } from '@/lib/gameData';

interface ServiceExplanationProps {
  service: ServiceInfo;
  analogy?: string;
  children?: React.ReactNode;
}

export default function ServiceExplanation({ service, analogy, children }: ServiceExplanationProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card p-5 border-aws-blue/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-aws-navy-dark">
            <ServiceIcon name={service.icon} className="w-7 h-7 text-aws-orange" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">{service.name}</h3>
            <span className="badge-info">{service.category}</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-aws-gray transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-aws-blue mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-aws-blue uppercase">What it is</span>
              <p className="text-sm text-aws-gray-light">{service.whatItIs}</p>
            </div>
          </div>
          {analogy && (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-aws-yellow mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-aws-yellow uppercase">Real-world analogy</span>
                <p className="text-sm text-aws-gray-light">{analogy}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-aws-green mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-aws-green uppercase">What problem it solves</span>
              <p className="text-sm text-aws-gray-light">{service.whatItSolves}</p>
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}

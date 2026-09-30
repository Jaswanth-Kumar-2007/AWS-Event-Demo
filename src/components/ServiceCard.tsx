import ServiceIcon from './ServiceIcon';
import type { ServiceInfo } from '@/lib/gameData';

interface ServiceCardProps {
  service: ServiceInfo;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

const colorMap: Record<string, string> = {
  orange: 'border-aws-orange/40 bg-aws-orange/5 hover:bg-aws-orange/10',
  blue: 'border-aws-blue/40 bg-aws-blue/5 hover:bg-aws-blue/10',
  green: 'border-aws-green/40 bg-aws-green/5 hover:bg-aws-green/10',
};

export default function ServiceCard({ service, onClick, selected, compact }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 border-2 transition-all duration-300 ${
        selected
          ? colorMap[service.color] + ' ring-2 ring-aws-orange/30'
          : onClick
          ? 'cursor-pointer hover:border-aws-orange/30 hover:shadow-lg'
          : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg bg-aws-navy-dark`}>
          <ServiceIcon name={service.icon} className="w-6 h-6 text-aws-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white truncate">{service.name}</h3>
          </div>
          <span className="badge-orange mb-2">{service.category}</span>
          {!compact && (
            <>
              <p className="text-sm text-aws-gray-light mb-2">{service.whatItIs}</p>
              <div className="space-y-1.5 text-xs">
                <p className="text-aws-gray">
                  <span className="text-aws-orange font-semibold">Solves: </span>
                  {service.whatItSolves}
                </p>
                <p className="text-aws-gray">
                  <span className="text-aws-blue font-semibold">Example: </span>
                  {service.example}
                </p>
                <p className="text-aws-gray-dark">
                  <span className="text-aws-green font-semibold">Mission: </span>
                  {service.mission}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

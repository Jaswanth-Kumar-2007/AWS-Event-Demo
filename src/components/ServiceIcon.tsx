import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export default function ServiceIcon({ name, className = 'w-6 h-6' }: ServiceIconProps) {
  const IconCmp = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Cloud;
  return <IconCmp className={className} />;
}

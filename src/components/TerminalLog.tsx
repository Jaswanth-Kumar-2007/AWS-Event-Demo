import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalLogProps {
  lines: { text: string; type?: 'info' | 'success' | 'warning' | 'error' }[];
}

const typeColors = {
  info: 'text-aws-blue-light',
  success: 'text-aws-green',
  warning: 'text-aws-yellow',
  error: 'text-aws-red',
};

export default function TerminalLog({ lines }: TerminalLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="terminal p-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-aws-gray-dark/30">
        <Terminal className="w-4 h-4 text-aws-orange" />
        <span className="text-xs text-aws-gray font-mono">terminal — campusconnect-sim</span>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
        {lines.map((line, i) => (
          <div key={i} className={`text-xs font-mono ${typeColors[line.type ?? 'info']} animate-fade-in`}>
            <span className="text-aws-gray-dark">$ </span>
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

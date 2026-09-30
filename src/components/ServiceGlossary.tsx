import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import ServiceCard from './ServiceCard';
import { SERVICES } from '@/lib/gameData';

interface ServiceGlossaryProps {
  onBack: () => void;
}

export default function ServiceGlossary({ onBack }: ServiceGlossaryProps) {
  const [query, setQuery] = useState('');

  const filtered = SERVICES.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.whatItIs.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-ghost flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">AWS Service Glossary</h1>
        <p className="text-sm text-aws-gray">All the AWS services you will use in this mission</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aws-gray-dark" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10"
          placeholder="Search services..."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((service) => (
          <ServiceCard key={service.key} service={service} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-aws-gray">No services found.</div>
      )}
    </div>
  );
}

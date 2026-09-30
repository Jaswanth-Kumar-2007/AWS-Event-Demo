import { useState } from 'react';
import { User, IdCard, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RegistrationProps {
  onRegistered: (participantId: string, name: string, collegeId: string) => void;
  onBack: () => void;
}

export default function Registration({ onRegistered, onBack }: RegistrationProps) {
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingParticipant, setExistingParticipant] = useState<{ participant_id: string; name: string; college_id: string; current_mission: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !collegeId.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the participation terms to continue.');
      return;
    }

    setLoading(true);

    try {
      // Check if college_id already exists
      const { data: existing } = await supabase
        .from('participants')
        .select('participant_id, name, college_id, current_mission')
        .eq('college_id', collegeId.trim())
        .maybeSingle();

      if (existing) {
        setExistingParticipant(existing);
        setLoading(false);
        return;
      }

      // Create new participant
      const participantId = crypto.randomUUID();
      const { error: insertError } = await supabase.from('participants').insert({
        participant_id: participantId,
        name: name.trim(),
        college_id: collegeId.trim(),
        started_at: new Date().toISOString(),
        current_mission: 1,
        score: 0,
        status: 'in_progress',
      });

      if (insertError) throw insertError;

      // Store in localStorage for convenience
      localStorage.setItem('aws_cloud_mission_participant', JSON.stringify({
        participant_id: participantId,
        name: name.trim(),
        college_id: collegeId.trim(),
      }));

      onRegistered(participantId, name.trim(), collegeId.trim());
    } catch (err) {
      setError('Could not register. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = () => {
    if (existingParticipant) {
      localStorage.setItem('aws_cloud_mission_participant', JSON.stringify({
        participant_id: existingParticipant.participant_id,
        name: existingParticipant.name,
        college_id: existingParticipant.college_id,
      }));
      onRegistered(existingParticipant.participant_id, existingParticipant.name, existingParticipant.college_id);
    }
  };

  if (existingParticipant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-6 max-w-md w-full border-aws-orange/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-aws-orange/20">
              <CheckCircle2 className="w-8 h-8 text-aws-orange" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome Back!</h2>
              <p className="text-sm text-aws-gray">Continue your previous mission</p>
            </div>
          </div>
          <div className="p-4 bg-aws-navy-dark rounded-lg mb-4">
            <p className="text-sm text-aws-gray-light">
              <span className="text-aws-gray">Name: </span>
              <span className="text-white font-medium">{existingParticipant.name}</span>
            </p>
            <p className="text-sm text-aws-gray-light mt-1">
              <span className="text-aws-gray">Current Mission: </span>
              <span className="text-aws-orange font-mono">{existingParticipant.current_mission} / 7</span>
            </p>
          </div>
          <p className="text-sm text-aws-gray mb-4">
            Your College ID is already registered. You can continue from where you left off.
          </p>
          <button onClick={handleResume} className="btn-primary w-full flex items-center justify-center gap-2">
            Continue Mission <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => { setExistingParticipant(null); setCollegeId(''); }} className="btn-ghost w-full mt-2">
            Use a different College ID
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-aws-orange/10 mb-3">
            <User className="w-8 h-8 text-aws-orange" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Participant Registration</h1>
          <p className="text-sm text-aws-gray">Register to start your AWS Cloud Mission</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-aws-gray-light mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-aws-orange" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Jane Doe"
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-aws-gray-light mb-2 flex items-center gap-2">
              <IdCard className="w-4 h-4 text-aws-orange" />
              College ID
            </label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              className="input-field"
              placeholder="CUST-2026-001"
              maxLength={50}
            />
            <p className="text-xs text-aws-gray-dark mt-1">
              Used to save and resume your progress. Not displayed publicly.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 bg-aws-navy-dark rounded-lg border border-aws-gray-dark/30 hover:border-aws-orange/30 transition-all">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-aws-orange"
            />
            <span className="text-sm text-aws-gray-light">
              I agree that my participation data may be used for this educational event.
            </span>
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-aws-red/10 border border-aws-red/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-aws-red shrink-0" />
              <p className="text-sm text-aws-red">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !agreed || !name.trim() || !collegeId.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</>
            ) : (
              <>Start Mission <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <button onClick={onBack} className="btn-ghost w-full mt-3">
          Back to Home
        </button>

        <p className="text-xs text-aws-gray-dark text-center mt-4">
          No passwords, AWS credentials, or personal data beyond name and College ID are collected.
        </p>
      </div>
    </div>
  );
}

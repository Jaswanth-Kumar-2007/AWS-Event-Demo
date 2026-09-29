import { useState } from 'react';
import { Cloud, User, IdCard, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';

export function Registration() {
  const { register, resumeByCollegeId, error } = useChallenge();
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!collegeId.trim()) {
      setLocalError('Please enter your college ID number.');
      return;
    }
    if (!agreed) {
      setLocalError('Please check the agreement box to continue.');
      return;
    }

    setSubmitting(true);
    // Try to resume first; if not found, register creates new
    const resumed = await resumeByCollegeId(collegeId.trim());
    if (!resumed) {
      await register(name.trim(), collegeId.trim());
    }
    setSubmitting(false);
  };

  const displayError = localError || error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud-950 p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-accent-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-xl shadow-accent-500/20">
            <Cloud className="h-8 w-8 text-cloud-950" strokeWidth={2.5} />
          </div>
          <h1 className="text-center text-2xl font-bold text-white">Welcome to the Cloud Builder Challenge</h1>
          <p className="mt-2 text-center text-sm text-cloud-400">
            Build your first cloud application by completing four connected missions.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-cloud-800 bg-cloud-900/80 p-7 backdrop-blur-sm">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cloud-200">
                <User className="h-4 w-4 text-cloud-400" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-3 text-sm text-white placeholder-cloud-500 outline-none transition focus:border-accent-500"
                disabled={submitting}
              />
            </div>

            {/* College ID */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cloud-200">
                <IdCard className="h-4 w-4 text-cloud-400" />
                College ID Number
              </label>
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="e.g. B26DS000"
                className="w-full rounded-lg border border-cloud-700 bg-cloud-900 px-4 py-3 text-sm text-white placeholder-cloud-500 outline-none transition focus:border-accent-500"
                disabled={submitting}
              />
              <p className="mt-1.5 text-xs text-cloud-500">
                Used to save and resume your progress. No password needed.
              </p>
            </div>

            {/* Agreement */}
            <button
              onClick={() => setAgreed(!agreed)}
              className="flex w-full items-start gap-3 rounded-lg border border-cloud-700 bg-cloud-850/50 p-3.5 text-left transition hover:border-cloud-600"
            >
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                agreed ? 'border-accent-500 bg-accent-500' : 'border-cloud-600 bg-cloud-900'
              }`}>
                {agreed && <CheckCircle2 className="h-3.5 w-3.5 text-cloud-950" />}
              </div>
              <span className="text-sm text-cloud-300">
                I agree to use this information for this educational event.
              </span>
            </button>

            {/* Error */}
            {displayError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span className="text-sm text-red-300">{displayError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3.5 text-sm font-semibold text-cloud-950 transition hover:bg-accent-400 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting Challenge...
                </>
              ) : (
                <>
                  Start Challenge
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-cloud-600">
          Simulated environment — no real AWS resources are created.
        </p>
      </div>
    </div>
  );
}

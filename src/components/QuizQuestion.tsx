import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import type { QuizOption } from '@/lib/gameData';

interface QuizQuestionProps {
  prompt: string;
  options: QuizOption[];
  onSelect: (correct: boolean) => void;
  hint?: string;
  attempts: number;
}

export default function QuizQuestion({ prompt, options, onSelect, hint, attempts }: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const handleSelect = (option: QuizOption) => {
    if (feedback === 'correct') return;
    setSelected(option.value);
    if (option.correct) {
      setFeedback('correct');
      setTimeout(() => onSelect(true), 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('none');
        setSelected(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg text-aws-gray-light font-medium">{prompt}</p>
      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selected === option.value;
          const showCorrect = feedback === 'correct' && option.correct;
          const showWrong = isSelected && feedback === 'wrong';
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              disabled={feedback === 'correct' || feedback === 'wrong'}
              className={`card p-4 text-left transition-all duration-300 flex items-center justify-between group ${
                showCorrect
                  ? 'border-aws-green bg-aws-green/10 glow-green'
                  : showWrong
                  ? 'border-aws-red bg-aws-red/10 animate-fade-in'
                  : isSelected
                  ? 'border-aws-orange'
                  : 'hover:border-aws-orange/40 hover:translate-x-1'
              }`}
            >
              <span className={`font-medium ${showCorrect ? 'text-aws-green' : showWrong ? 'text-aws-red' : 'text-aws-gray-light'}`}>
                {option.label}
              </span>
              {showCorrect && <CheckCircle2 className="w-5 h-5 text-aws-green" />}
              {showWrong && <XCircle className="w-5 h-5 text-aws-red" />}
              {!showCorrect && !showWrong && (
                <ArrowRight className="w-4 h-4 text-aws-gray-dark group-hover:text-aws-orange transition-colors" />
              )}
            </button>
          );
        })}
      </div>
      {feedback === 'wrong' && (
        <div className="flex items-center gap-2 p-3 bg-aws-red/10 border border-aws-red/30 rounded-lg animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-aws-red shrink-0" />
          <p className="text-sm text-aws-red">
            Not quite. Think about what this service is designed to do.
            {attempts >= 2 && hint && <span className="block mt-1 text-aws-yellow">{hint}</span>}
          </p>
        </div>
      )}
      {feedback === 'correct' && (
        <div className="flex items-center gap-2 p-3 bg-aws-green/10 border border-aws-green/30 rounded-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-aws-green shrink-0" />
          <p className="text-sm text-aws-green font-medium">Correct! Well done.</p>
        </div>
      )}
    </div>
  );
}

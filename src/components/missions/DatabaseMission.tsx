import { useState } from 'react';
import { Database, CheckCircle2, ArrowRight } from 'lucide-react';
import MissionIntro from '../MissionIntro';
import HintSystem from '../HintSystem';
import CompletionModal from '../CompletionModal';
import { MISSIONS, DATABASE_SCENARIOS } from '@/lib/gameData';

interface DatabaseMissionProps {
  onComplete: (score: number, hintsUsed: number) => void;
  hintsUsed: number;
  onHintUsed: () => void;
}

export default function DatabaseMission({ onComplete, hintsUsed, onHintUsed }: DatabaseMissionProps) {
  const mission = MISSIONS[3];
  const [phase, setPhase] = useState<'intro' | 'scenarios' | 'done'>('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (value: string) => {
    if (showExplanation) return;
    setSelectedAnswers([...selectedAnswers, value]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentScenario + 1 < DATABASE_SCENARIOS.length) {
      setCurrentScenario((s) => s + 1);
      setShowExplanation(false);
    } else {
      setPhase('done');
      setShowModal(true);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story={mission.story}
          points={mission.points}
        />
        <div className="card p-5 border-aws-green/20">
          <h3 className="font-bold text-white mb-4">Three Database Options</h3>
          <div className="space-y-3">
            <div className="p-4 bg-aws-navy-dark rounded-lg border border-aws-green/20">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-aws-green" />
                <h4 className="font-bold text-white">Amazon RDS</h4>
              </div>
              <p className="text-sm text-aws-gray-light">Managed relational database. Examples include MySQL and PostgreSQL.</p>
            </div>
            <div className="p-4 bg-aws-navy-dark rounded-lg border border-aws-green/20">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-aws-green" />
                <h4 className="font-bold text-white">Amazon Aurora</h4>
              </div>
              <p className="text-sm text-aws-gray-light">High-performance relational database. Designed for scalability and availability.</p>
            </div>
            <div className="p-4 bg-aws-navy-dark rounded-lg border border-aws-green/20">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-aws-green" />
                <h4 className="font-bold text-white">Amazon DynamoDB</h4>
              </div>
              <p className="text-sm text-aws-gray-light">Serverless NoSQL database. Fast, low-latency access. Automatic scaling.</p>
            </div>
          </div>
        </div>
        <HintSystem missionId={4} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
        <button onClick={() => setPhase('scenarios')} className="btn-primary w-full">
          Begin Scenarios
        </button>
      </div>
    );
  }

  if (phase === 'scenarios') {
    const scenario = DATABASE_SCENARIOS[currentScenario];
    const selectedValue = selectedAnswers[currentScenario];
    const selectedOption = scenario.options.find((o) => o.value === selectedValue);
    const isCorrect = selectedOption?.correct;

    return (
      <div className="space-y-4">
        <MissionIntro
          code={mission.code}
          title={mission.title}
          service={mission.service}
          story={`Scenario ${scenario.id} of ${String.fromCharCode(65 + DATABASE_SCENARIOS.length - 1)}`}
          points={mission.points}
        />
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-orange">SCENARIO {scenario.id}</span>
            <span className="text-xs text-aws-gray">{currentScenario + 1} / {DATABASE_SCENARIOS.length}</span>
          </div>
          <p className="text-lg text-aws-gray-light font-medium mb-4">{scenario.scenario}</p>
          <div className="grid gap-3">
            {scenario.options.map((option) => {
              const isSelected = selectedValue === option.value;
              const showCorrect = showExplanation && option.correct;
              const showWrong = isSelected && !option.correct;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={showExplanation}
                  className={`card p-4 text-left transition-all duration-300 flex items-center justify-between ${
                    showCorrect
                      ? 'border-aws-green bg-aws-green/10'
                      : showWrong
                      ? 'border-aws-red bg-aws-red/10'
                      : 'hover:border-aws-orange/40 hover:translate-x-1'
                  }`}
                >
                  <span className={`font-medium ${showCorrect ? 'text-aws-green' : showWrong ? 'text-aws-red' : 'text-aws-gray-light'}`}>
                    {option.label}
                  </span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-aws-green" />}
                </button>
              );
            })}
          </div>
          {showExplanation && (
            <div className={`mt-4 p-4 rounded-lg border animate-fade-in ${
              isCorrect ? 'bg-aws-green/10 border-aws-green/30' : 'bg-aws-red/10 border-aws-red/30'
            }`}>
              <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-aws-green' : 'text-aws-red'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="text-sm text-aws-gray-light">{scenario.explanation}</p>
            </div>
          )}
          {showExplanation && (
            <button onClick={handleNext} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              {currentScenario + 1 < DATABASE_SCENARIOS.length ? 'Next Scenario' : 'Complete Mission'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <HintSystem missionId={4} hintsUsed={hintsUsed} onHintUsed={onHintUsed} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MissionIntro
        code={mission.code}
        title={mission.title}
        service={mission.service}
        story="All scenarios complete!"
        points={mission.points}
      />
      <div className="card p-5 border-aws-green/20 glow-green">
        <h3 className="font-bold text-white mb-3">Database Choices Summary</h3>
        <div className="space-y-2">
          {DATABASE_SCENARIOS.map((s, i) => {
            const answer = scenario_answer(s, selectedAnswers[i]);
            return (
              <div key={s.id} className="flex items-center gap-2 p-3 bg-aws-navy-dark rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-aws-green" />
                <span className="text-sm text-aws-gray-light">
                  <strong>Scenario {s.id}:</strong> {answer}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <CompletionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Database Mission Complete!"
        points={mission.points}
        whatYouLearned="You learned the difference between three AWS database services: RDS for managed relational data with relationships, DynamoDB for fast key-value access with automatic scaling, and Aurora for high-performance relational workloads requiring scalability and availability."
        realAwsConnection="In real AWS, choosing the right database depends on your data structure and access patterns. RDS and Aurora use SQL, while DynamoDB uses a NoSQL key-value model. The right choice affects performance, cost, and scalability."
        nextMission={() => {
          setShowModal(false);
          onComplete(mission.points, hintsUsed);
        }}
      />
    </div>
  );
}

function scenario_answer(scenario: typeof DATABASE_SCENARIOS[0], _selected: string | undefined): string {
  const correct = scenario.options.find((o) => o.correct);
  return correct?.label ?? '';
}

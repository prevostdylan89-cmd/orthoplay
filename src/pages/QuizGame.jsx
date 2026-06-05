import { useState, useCallback } from 'react';
import { quizQuestions, LEVELS } from '../data/exercises';
import { useApp } from '../context/AppContext';
import GameShell from '../components/GameShell';
import LevelPicker from '../components/LevelPicker';
import ResultScreen from '../components/ResultScreen';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizGame() {
  const { addStars, markExerciseCompleted } = useApp();
  const [level, setLevel] = useState(LEVELS.EASY);
  const [phase, setPhase] = useState('pick'); // pick | play | result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const start = useCallback(() => {
    const filtered = shuffle(quizQuestions.filter(q => q.level === level)).slice(0, 5);
    setQuestions(filtered);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowExplanation(false);
    setPhase('play');
  }, [level]);

  function pick(opt) {
    if (selected !== null) return;
    setSelected(opt);
    setShowExplanation(true);
    if (opt === questions[current].answer) {
      setScore(s => s + 1);
    }
  }

  function next() {
    markExerciseCompleted(questions[current].id);
    if (current + 1 >= questions.length) {
      const earned = Math.ceil((score + (selected === questions[current].answer ? 1 : 0)) / questions.length * 3);
      addStars(earned);
      setPhase('result');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  }

  const finalScore = score + (selected === questions[current]?.answer ? 1 : 0);
  const stars = Math.ceil((finalScore / questions.length) * 3);

  if (phase === 'result') {
    return (
      <GameShell title="Quiz Orthographe" emoji="📝" color="from-blue-400 to-blue-600">
        <ResultScreen
          score={finalScore}
          total={questions.length}
          stars={stars}
          onReplay={() => setPhase('pick')}
        />
      </GameShell>
    );
  }

  if (phase === 'pick') {
    return (
      <GameShell title="Quiz Orthographe" emoji="📝" color="from-blue-400 to-blue-600">
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Réponds aux questions sur les mots et les sons !
          </p>
          <LevelPicker selected={level} onChange={setLevel} />
          <button
            onClick={start}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Commencer ! 🚀
          </button>
        </div>
      </GameShell>
    );
  }

  const q = questions[current];

  return (
    <GameShell title="Quiz Orthographe" emoji="📝" color="from-blue-400 to-blue-600">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-gray-200 rounded-full h-3">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${((current) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-500">{current + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
        <p className="text-xl font-bold text-gray-800 text-center leading-relaxed">{q.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
        {q.options.map(opt => {
          const isCorrect = opt === q.answer;
          const isSelected = opt === selected;
          let bg = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50';
          if (selected !== null) {
            if (isCorrect) bg = 'bg-green-100 border-2 border-green-500 text-green-800 font-bold';
            else if (isSelected) bg = 'bg-red-100 border-2 border-red-400 text-red-700';
            else bg = 'bg-gray-50 border-2 border-gray-100 text-gray-400';
          }
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              className={`${bg} rounded-2xl p-4 text-center font-semibold transition-all active:scale-95 text-sm`}
            >
              {isSelected && !isCorrect && '✗ '}
              {isCorrect && selected !== null && '✓ '}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-2xl p-4 mb-4 ${selected === q.answer ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="text-sm font-semibold text-gray-700">💡 {q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={next}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 rounded-2xl text-lg shadow hover:shadow-lg hover:scale-105 transition-all"
        >
          {current + 1 < questions.length ? 'Question suivante →' : 'Voir mon score 🏆'}
        </button>
      )}
    </GameShell>
  );
}

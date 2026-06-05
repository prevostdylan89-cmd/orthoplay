import { useState, useCallback } from 'react';
import { rhymeGames, LEVELS } from '../data/exercises';
import { useApp } from '../context/AppContext';
import GameShell from '../components/GameShell';
import LevelPicker from '../components/LevelPicker';
import ResultScreen from '../components/ResultScreen';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RhymesGame() {
  const { addStars, markExerciseCompleted } = useApp();
  const [level, setLevel] = useState(LEVELS.EASY);
  const [phase, setPhase] = useState('pick');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const start = useCallback(() => {
    const filtered = shuffle(rhymeGames.filter(q => q.level === level)).slice(0, 5);
    setQuestions(filtered);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setPhase('play');
  }, [level]);

  function pick(opt) {
    if (selected !== null) return;
    setSelected(opt);
    markExerciseCompleted(questions[current].id);
    if (opt === questions[current].answer) setScore(s => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) {
      const finalScore = score + (selected === questions[current].answer ? 1 : 0);
      const earned = Math.ceil((finalScore / questions.length) * 3);
      addStars(earned);
      setPhase('result');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  const finalScore = score + (selected === questions[current]?.answer ? 1 : 0);
  const stars = Math.ceil((finalScore / questions.length) * 3) || 1;

  if (phase === 'result') {
    return (
      <GameShell title="Les Rimes" emoji="🎵" color="from-pink-400 to-pink-600">
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
      <GameShell title="Les Rimes" emoji="🎵" color="from-pink-400 to-pink-600">
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Trouve le mot qui rime avec le mot donné ! 🎶
          </p>
          <LevelPicker selected={level} onChange={setLevel} />
          <button
            onClick={start}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Commencer ! 🚀
          </button>
        </div>
      </GameShell>
    );
  }

  const q = questions[current];

  return (
    <GameShell title="Les Rimes" emoji="🎵" color="from-pink-400 to-pink-600">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-gray-200 rounded-full h-3">
          <div
            className="h-full bg-pink-500 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-500">{current + 1}/{questions.length}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
        <p className="text-center text-gray-500 mb-2">Quel mot rime avec...</p>
        <div className="text-center mb-2">
          <span className="text-5xl font-bold text-pink-600 bg-pink-50 px-6 py-3 rounded-2xl inline-block">
            {q.word}
          </span>
        </div>
        {q.hint && (
          <p className="text-center text-xs text-gray-400 mt-2">💡 Indice : {q.hint}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map(opt => {
          const isCorrect = opt === q.answer;
          const isSelected = opt === selected;
          let style = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50';
          if (selected !== null) {
            if (isCorrect) style = 'bg-green-100 border-2 border-green-500 text-green-800 font-bold';
            else if (isSelected) style = 'bg-red-100 border-2 border-red-400 text-red-700';
            else style = 'bg-gray-50 border-2 border-gray-100 text-gray-400';
          }
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              className={`${style} rounded-2xl p-4 text-center font-semibold text-lg transition-all active:scale-95`}
            >
              {isSelected && !isCorrect && '✗ '}
              {isCorrect && selected !== null && '✓ '}
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={next}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-4 rounded-2xl text-lg shadow hover:shadow-lg hover:scale-105 transition-all"
        >
          {current + 1 < questions.length ? 'Suivant →' : 'Voir mon score 🏆'}
        </button>
      )}
    </GameShell>
  );
}

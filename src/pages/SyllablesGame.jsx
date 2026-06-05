import { useState, useCallback } from 'react';
import { syllableGames, LEVELS } from '../data/exercises';
import { useApp } from '../context/AppContext';
import GameShell from '../components/GameShell';
import LevelPicker from '../components/LevelPicker';
import ResultScreen from '../components/ResultScreen';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SyllablesGame() {
  const { addStars, markExerciseCompleted } = useApp();
  const [level, setLevel] = useState(LEVELS.EASY);
  const [phase, setPhase] = useState('pick');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [arranged, setArranged] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const start = useCallback(() => {
    const filtered = shuffle(syllableGames.filter(q => q.level === level)).slice(0, 5);
    setQuestions(filtered);
    setCurrent(0);
    setScore(0);
    setChecked(false);
    setArranged([]);
    setAvailable(shuffle(filtered[0].syllables));
    setPhase('play');
  }, [level]);

  function pickSyllable(syl, idx) {
    if (checked) return;
    const newAvail = [...available];
    newAvail.splice(idx, 1);
    setAvailable(newAvail);
    setArranged(a => [...a, syl]);
  }

  function removeSyllable(syl, idx) {
    if (checked) return;
    const newArr = [...arranged];
    newArr.splice(idx, 1);
    setArranged(newArr);
    setAvailable(a => [...a, syl]);
  }

  function check() {
    const q = questions[current];
    const isCorrect = arranged.join('') === q.word;
    setCorrect(isCorrect);
    setChecked(true);
    markExerciseCompleted(q.id);
    if (isCorrect) setScore(s => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) {
      const earned = Math.ceil((score + (correct ? 1 : 0)) / questions.length * 3);
      addStars(earned);
      setPhase('result');
    } else {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      setArranged([]);
      setAvailable(shuffle(questions[nextIdx].syllables));
      setChecked(false);
      setCorrect(false);
    }
  }

  const finalScore = score + (checked && correct ? 1 : checked ? 0 : 0);
  const stars = Math.ceil((finalScore / questions.length) * 3) || 1;

  if (phase === 'result') {
    return (
      <GameShell title="Les Syllabes" emoji="🔤" color="from-orange-400 to-orange-600">
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
      <GameShell title="Les Syllabes" emoji="🔤" color="from-orange-400 to-orange-600">
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Remets les syllabes dans le bon ordre pour former un mot ! 🧩
          </p>
          <LevelPicker selected={level} onChange={setLevel} />
          <button
            onClick={start}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Commencer ! 🚀
          </button>
        </div>
      </GameShell>
    );
  }

  const q = questions[current];

  return (
    <GameShell title="Les Syllabes" emoji="🔤" color="from-orange-400 to-orange-600">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-gray-200 rounded-full h-3">
          <div
            className="h-full bg-orange-500 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-500">{current + 1}/{questions.length}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
        <p className="text-center text-gray-600 mb-4 font-semibold">Forme le mot avec ces syllabes :</p>

        {/* Drop zone */}
        <div className={`min-h-16 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 p-3 mb-4 transition-all ${
          checked
            ? correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            : arranged.length > 0 ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-gray-50'
        }`}>
          {arranged.length === 0 ? (
            <span className="text-gray-400 text-sm">Clique sur les syllabes ci-dessous...</span>
          ) : (
            arranged.map((syl, i) => (
              <button
                key={i}
                onClick={() => removeSyllable(syl, i)}
                className="bg-orange-500 text-white font-bold text-lg px-3 py-2 rounded-xl shadow hover:bg-orange-600 active:scale-95 transition-all"
              >
                {syl}
              </button>
            ))
          )}
        </div>

        {checked && (
          <div className={`rounded-2xl p-3 mb-4 text-center font-semibold ${correct ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {correct ? `✅ Bravo ! "${q.word}" ✨` : `❌ Le mot était : "${q.word}"`}
          </div>
        )}

        {/* Available syllables */}
        <div className="flex flex-wrap gap-2 justify-center">
          {available.map((syl, i) => (
            <button
              key={i}
              onClick={() => pickSyllable(syl, i)}
              className="bg-gray-100 text-gray-800 font-bold text-lg px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-orange-100 hover:border-orange-400 active:scale-95 transition-all"
            >
              {syl}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {!checked && (
          <button
            onClick={check}
            disabled={arranged.length !== q.syllables.length}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold py-4 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Vérifier ✓
          </button>
        )}
        {checked && (
          <button
            onClick={next}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold py-4 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition-all"
          >
            {current + 1 < questions.length ? 'Suivant →' : 'Voir mon score 🏆'}
          </button>
        )}
      </div>
    </GameShell>
  );
}

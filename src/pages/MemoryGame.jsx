import { useState, useCallback, useEffect } from 'react';
import { memoryPairs, LEVELS } from '../data/exercises';
import { useApp } from '../context/AppContext';
import GameShell from '../components/GameShell';
import LevelPicker from '../components/LevelPicker';
import ResultScreen from '../components/ResultScreen';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const { addStars, markExerciseCompleted } = useApp();
  const [level, setLevel] = useState(LEVELS.EASY);
  const [phase, setPhase] = useState('pick');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const start = useCallback(() => {
    const pairs = shuffle(memoryPairs.filter(p => p.level === level)).slice(0, 4);
    const deck = shuffle([
      ...pairs.map(p => ({ id: `${p.id}_word`, pairId: p.id, content: p.word, type: 'word' })),
      ...pairs.map(p => ({ id: `${p.id}_emoji`, pairId: p.id, content: p.emoji, type: 'emoji' })),
    ]);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setPhase('play');
  }, [level]);

  function flip(cardId) {
    if (locked) return;
    if (flipped.includes(cardId)) return;
    if (matched.some(m => cards.find(c => c.id === cardId)?.pairId === m)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped.map(id => cards.find(c => c.id === id));
      if (a.pairId === b.pairId) {
        const newMatched = [...matched, a.pairId];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        markExerciseCompleted(a.pairId);
        if (newMatched.length === cards.length / 2) {
          const stars = moves < 6 ? 3 : moves < 10 ? 2 : 1;
          addStars(stars);
          setTimeout(() => setPhase('result'), 600);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  }

  const totalPairs = cards.length / 2;
  const stars = moves < 6 ? 3 : moves < 10 ? 2 : 1;

  if (phase === 'result') {
    return (
      <GameShell title="Jeu de Mémoire" emoji="🃏" color="from-green-400 to-green-600">
        <ResultScreen
          score={totalPairs}
          total={totalPairs}
          stars={stars}
          onReplay={() => setPhase('pick')}
        />
      </GameShell>
    );
  }

  if (phase === 'pick') {
    return (
      <GameShell title="Jeu de Mémoire" emoji="🃏" color="from-green-400 to-green-600">
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Associe chaque mot à son image ! 🖼️
          </p>
          <LevelPicker selected={level} onChange={setLevel} />
          <button
            onClick={start}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Commencer ! 🚀
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="Jeu de Mémoire" emoji="🃏" color="from-green-400 to-green-600">
      <div className="flex justify-between items-center mb-4 bg-white rounded-2xl px-4 py-2 shadow-sm">
        <span className="text-sm text-gray-500">Paires : <strong className="text-green-600">{matched.length}/{totalPairs}</strong></span>
        <span className="text-sm text-gray-500">Essais : <strong className="text-gray-700">{moves}</strong></span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.pairId);
          const show = isFlipped || isMatched;

          return (
            <button
              key={card.id}
              onClick={() => flip(card.id)}
              className={`aspect-square rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                isMatched
                  ? 'bg-green-100 border-2 border-green-400 scale-95'
                  : show
                  ? 'bg-white border-2 border-blue-300 shadow-md'
                  : 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              {show ? (
                card.type === 'emoji' ? (
                  <span className="text-2xl">{card.content}</span>
                ) : (
                  <span className="text-gray-700 text-xs text-center px-1 leading-tight">{card.content}</span>
                )
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}

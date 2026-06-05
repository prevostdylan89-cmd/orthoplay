import { useApp } from '../context/AppContext';

export default function ResultScreen({ score, total, stars, onReplay, onHome }) {
  const { setCurrentPage } = useApp();
  const pct = Math.round((score / total) * 100);

  const msg =
    pct === 100 ? 'Parfait ! 🎉' :
    pct >= 70 ? 'Très bien ! 😊' :
    pct >= 40 ? 'Continue ! 💪' :
    'Retente ta chance ! 🔄';

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
      <div className="text-6xl mb-4">{pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '😊' : '💪'}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{msg}</h2>
      <p className="text-gray-500 mb-4">
        {score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {total}
      </p>

      <div className="flex justify-center gap-1 mb-6">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReplay}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition-all"
        >
          Rejouer 🔄
        </button>
        <button
          onClick={onHome || (() => setCurrentPage('home'))}
          className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-all"
        >
          Accueil 🏠
        </button>
      </div>
    </div>
  );
}

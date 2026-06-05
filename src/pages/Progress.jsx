import { useApp } from '../context/AppContext';
import GameShell from '../components/GameShell';

const BADGE_INFO = {
  bronze: { emoji: '🥉', label: 'Bronze', desc: '10 étoiles' },
  argent: { emoji: '🥈', label: 'Argent', desc: '30 étoiles' },
  or: { emoji: '🥇', label: 'Or', desc: '60 étoiles' },
};

export default function Progress() {
  const { profile, resetProgress } = useApp();

  return (
    <GameShell title="Mes Progrès" emoji="📊" color="from-indigo-400 to-indigo-600">
      <div className="space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <div className="text-6xl mb-2">{profile.avatar}</div>
          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="text-yellow-500 text-2xl">⭐</span>
            <span className="text-3xl font-bold text-gray-700">{profile.stars}</span>
            <span className="text-gray-500">étoiles gagnées</span>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-lg">🏅 Mes Badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(BADGE_INFO).map(([key, info]) => {
              const earned = profile.badges.includes(key);
              return (
                <div
                  key={key}
                  className={`rounded-2xl p-4 text-center ${earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 opacity-50'}`}
                >
                  <div className="text-4xl mb-1">{earned ? info.emoji : '🔒'}</div>
                  <p className="font-bold text-sm text-gray-700">{info.label}</p>
                  <p className="text-xs text-gray-500">{info.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-lg">📈 Statistiques</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{profile.completedExercises.length}</div>
              <p className="text-sm text-gray-600">Exercices réussis</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{profile.badges.length}</div>
              <p className="text-sm text-gray-600">Badges obtenus</p>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white rounded-3xl shadow-xl p-4">
          <button
            onClick={() => {
              if (window.confirm('Effacer tous tes progrès ? Cette action est définitive.')) {
                resetProgress();
              }
            }}
            className="w-full text-red-400 text-sm py-2 hover:text-red-600 transition-colors"
          >
            🗑️ Recommencer à zéro
          </button>
        </div>
      </div>
    </GameShell>
  );
}

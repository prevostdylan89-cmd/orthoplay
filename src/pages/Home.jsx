import { useApp } from '../context/AppContext';

const GAMES = [
  {
    id: 'quiz',
    label: 'Quiz Orthographe',
    emoji: '📝',
    desc: 'Réponds aux questions sur les mots',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'memory',
    label: 'Jeu de Mémoire',
    emoji: '🃏',
    desc: 'Associe les mots et les images',
    color: 'from-green-400 to-green-600',
    bg: 'bg-green-50',
  },
  {
    id: 'syllables',
    label: 'Les Syllabes',
    emoji: '🔤',
    desc: "Remets les syllabes dans l'ordre",
    color: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-50',
  },
  {
    id: 'rhymes',
    label: 'Les Rimes',
    emoji: '🎵',
    desc: 'Trouve le mot qui rime',
    color: 'from-pink-400 to-pink-600',
    bg: 'bg-pink-50',
  },
  {
    id: 'sounds',
    label: 'Les Sons',
    emoji: '👂',
    desc: 'Identifie les sons dans les mots',
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
  },
];

const BADGE_INFO = {
  bronze: { emoji: '🥉', label: '10 étoiles' },
  argent: { emoji: '🥈', label: '30 étoiles' },
  or: { emoji: '🥇', label: '60 étoiles' },
};

export default function Home() {
  const { profile, setCurrentPage } = useApp();

  const nextBadge = !profile.badges.includes('bronze')
    ? { need: 10, name: 'Bronze' }
    : !profile.badges.includes('argent')
    ? { need: 30, name: 'Argent' }
    : !profile.badges.includes('or')
    ? { need: 60, name: 'Or' }
    : null;

  const progress = nextBadge
    ? Math.min((profile.stars / nextBadge.need) * 100, 100)
    : 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 bg-white rounded-3xl p-4 sm:p-5 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl">{profile.avatar}</span>
            <div>
              <p className="font-bold text-gray-800 text-lg sm:text-xl">{profile.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold text-gray-600 text-sm sm:text-base">{profile.stars} étoiles</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            {profile.badges.length > 0 && (
              <div className="flex gap-1 justify-end mb-1">
                {profile.badges.map(b => (
                  <span key={b} className="text-2xl" title={BADGE_INFO[b]?.label}>
                    {BADGE_INFO[b]?.emoji}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => setCurrentPage('progress')}
              className="text-xs sm:text-sm text-purple-500 underline"
            >
              Voir mes progrès
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {nextBadge && (
          <div className="bg-white rounded-2xl p-3 shadow-sm mb-4 sm:mb-6 flex items-center gap-3">
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              Badge {nextBadge.name} :
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-orange-500 whitespace-nowrap">
              {profile.stars}/{nextBadge.need} ⭐
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-700 mb-4 sm:mb-6">
          Quel jeu aujourd'hui ? 🎯
        </h2>

        {/* Game cards : 1 col mobile, 2 col tablet+, 3 col desktop large */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => setCurrentPage(game.id)}
              className={`${game.bg} rounded-3xl p-4 sm:p-5 flex items-center gap-4 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-left border-2 border-transparent hover:border-white`}
            >
              <div className={`bg-gradient-to-br ${game.color} text-white text-2xl sm:text-3xl w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                {game.emoji}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-base sm:text-lg">{game.label}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{game.desc}</p>
              </div>
              <span className="ml-auto text-gray-400 text-2xl">›</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 pb-4">
          OrthoPlay — Pour t'entraîner entre tes séances 💜
        </p>
      </div>
    </div>
  );
}

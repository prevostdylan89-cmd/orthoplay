import { useApp } from '../context/AppContext';

export default function GameShell({ title, emoji, color, children, onBack }) {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack || (() => setCurrentPage('home'))}
            className="bg-white rounded-2xl px-4 py-2 shadow-md font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            ← Retour
          </button>
          <div className={`bg-gradient-to-br ${color} text-white text-2xl w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
            {emoji}
          </div>
          <h1 className="font-bold text-gray-800 text-xl">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  );
}

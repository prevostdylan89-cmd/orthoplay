import { useApp } from '../context/AppContext';

export default function GameShell({ title, emoji, color, children, onBack }) {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <button
            onClick={onBack || (() => setCurrentPage('home'))}
            className="bg-white rounded-2xl px-4 py-2 shadow-md font-semibold text-gray-600 text-sm sm:text-base hover:bg-gray-50 active:scale-95 transition-all"
          >
            ← Retour
          </button>
          <div className={`bg-gradient-to-br ${color} text-white text-xl sm:text-2xl w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
            {emoji}
          </div>
          <h1 className="font-bold text-gray-800 text-lg sm:text-xl">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  );
}

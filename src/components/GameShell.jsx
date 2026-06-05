import { useApp } from '../context/AppContext';

export default function GameShell({ title, emoji, color, children, onBack }) {
  const { setCurrentPage } = useApp();

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1b4332 0%, #2d6a4f 60%, #1b4332 100%)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-black/25 text-white">
        <button
          onClick={onBack || (() => setCurrentPage('home'))}
          className="bg-white/20 hover:bg-white/30 active:scale-95 rounded-xl px-4 py-2 font-bold text-sm transition-all"
        >
          ← Retour
        </button>
        <div
          className={`bg-gradient-to-br ${color} text-xl w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
        >
          {emoji}
        </div>
        <h1 className="font-black text-lg leading-tight">{title}</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}

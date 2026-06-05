import { useApp } from '../context/AppContext';

const COLS = 5;
const TOTAL = 20;

const GAMES = [
  { id: 'quiz',      label: 'Quiz',     emoji: '📝', gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)' },
  { id: 'memory',    label: 'Mémoire',  emoji: '🃏', gradient: 'linear-gradient(135deg,#059669,#047857)' },
  { id: 'syllables', label: 'Syllabes', emoji: '🔤', gradient: 'linear-gradient(135deg,#ea580c,#c2410c)' },
  { id: 'rhymes',    label: 'Rimes',    emoji: '🎵', gradient: 'linear-gradient(135deg,#db2777,#be185d)' },
  { id: 'sounds',    label: 'Sons',     emoji: '👂', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
];

// Cycling pastel colors for squares
const SQUARE_STYLES = [
  { bg: '#fde8d8', border: '#f97316' },
  { bg: '#fef9c3', border: '#eab308' },
  { bg: '#dcfce7', border: '#22c55e' },
  { bg: '#dbeafe', border: '#3b82f6' },
  { bg: '#f3e8ff', border: '#a855f7' },
  { bg: '#fce7f3', border: '#ec4899' },
  { bg: '#e0f2fe', border: '#0ea5e9' },
  { bg: '#fff7ed', border: '#f97316' },
  { bg: '#f0fdf4', border: '#16a34a' },
  { bg: '#faf5ff', border: '#9333ea' },
];

const SPECIALS = {
  1:  { icon: '🚩', label: 'Départ' },
  5:  { icon: '⭐', label: 'Bonus' },
  10: { icon: '🎲', label: 'Chance' },
  15: { icon: '🌈', label: 'Arc-en-ciel' },
  20: { icon: '🏆', label: 'Arrivée' },
};

function buildBoard() {
  const rows = Math.ceil(TOTAL / COLS);
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    const rowFromBottom = rows - 1 - r;
    const startNum = rowFromBottom * COLS + 1;
    for (let c = 0; c < COLS; c++) {
      const num = rowFromBottom % 2 === 0
        ? startNum + c
        : startNum + (COLS - 1 - c);
      if (num <= TOTAL) row.push(num);
    }
    board.push(row);
  }
  return board;
}

const BOARD = buildBoard();

export default function Home() {
  const { profile, setCurrentPage } = useApp();
  const playerPos = Math.min(profile.completedExercises.length, TOTAL);

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1b4332 0%, #2d6a4f 60%, #1b4332 100%)' }}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-black/25 text-white">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{profile.avatar}</span>
          <div className="leading-tight">
            <p className="font-black text-base">{profile.name}</p>
            <p className="text-xs text-yellow-300">⭐ {profile.stars} étoile{profile.stars !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile.badges.map(b => (
            <span key={b} className="text-xl leading-none">
              {b === 'or' ? '🥇' : b === 'argent' ? '🥈' : '🥉'}
            </span>
          ))}
          <button
            onClick={() => setCurrentPage('progress')}
            className="text-xs font-bold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl transition-all"
          >
            Progrès
          </button>
        </div>
      </div>

      {/* ── Subtitle ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 text-center py-1">
        <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">
          Case {playerPos} / {TOTAL} — avance en jouant !
        </span>
      </div>

      {/* ── Board ────────────────────────────────────────────────── */}
      <div className="flex-1 px-3 pb-1 min-h-0">
        <div
          className="h-full rounded-2xl p-2 flex flex-col gap-1.5"
          style={{
            background: 'linear-gradient(135deg, #fef9f0 0%, #fdf0d5 100%)',
            border: '4px solid #92400e',
            boxShadow: '0 0 0 2px #fbbf24, inset 0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          {BOARD.map((row, ri) => (
            <div key={ri} className="flex-1 flex gap-1.5 min-h-0">
              {row.map(num => {
                const isPlayer  = num === playerPos;
                const isPassed  = num < playerPos;
                const style     = SQUARE_STYLES[(num - 1) % SQUARE_STYLES.length];
                const special   = SPECIALS[num];

                return (
                  <div
                    key={num}
                    className="flex-1 rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-transform"
                    style={{
                      background: style.bg,
                      border: `2px solid ${style.border}`,
                      transform: isPlayer ? 'scale(1.06)' : undefined,
                      boxShadow: isPlayer
                        ? `0 0 0 3px #fbbf24, 0 4px 12px rgba(0,0,0,0.25)`
                        : '0 1px 3px rgba(0,0,0,0.08)',
                      zIndex: isPlayer ? 10 : undefined,
                      opacity: isPassed && !isPlayer ? 0.65 : 1,
                    }}
                  >
                    {/* Passed overlay */}
                    {isPassed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                        <span className="text-green-700 font-black text-xl">✓</span>
                      </div>
                    )}

                    {/* Number */}
                    <span
                      className="absolute top-0.5 left-1 text-[10px] font-black leading-none"
                      style={{ color: style.border }}
                    >
                      {num}
                    </span>

                    {/* Icon: player > special > dot */}
                    {isPlayer ? (
                      <span className="text-2xl sm:text-3xl lg:text-4xl leading-none">{profile.avatar}</span>
                    ) : special ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xl sm:text-2xl lg:text-3xl leading-none">{special.icon}</span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 leading-none mt-0.5 hidden sm:block">{special.label}</span>
                      </div>
                    ) : (
                      <span className="text-base sm:text-xl text-gray-300">·</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Game buttons ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex gap-2 px-3 py-2">
        {GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => setCurrentPage(g.id)}
            className="flex-1 rounded-2xl py-2 px-1 flex flex-col items-center text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{ background: g.gradient }}
          >
            <span className="text-2xl sm:text-3xl leading-none">{g.emoji}</span>
            <span className="text-[10px] sm:text-xs font-black mt-0.5 tracking-wide">{g.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

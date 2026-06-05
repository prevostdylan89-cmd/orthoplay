import { LEVELS } from '../data/exercises';

const LEVEL_CONFIG = {
  [LEVELS.EASY]: { label: 'Facile', emoji: '🌱', color: 'bg-green-100 border-green-400 text-green-700' },
  [LEVELS.MEDIUM]: { label: 'Moyen', emoji: '🌻', color: 'bg-orange-100 border-orange-400 text-orange-700' },
  [LEVELS.HARD]: { label: 'Difficile', emoji: '🌟', color: 'bg-purple-100 border-purple-400 text-purple-700' },
};

export default function LevelPicker({ selected, onChange }) {
  return (
    <div className="flex gap-3 justify-center mb-6">
      {Object.values(LEVELS).map(level => {
        const cfg = LEVEL_CONFIG[level];
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${cfg.color} ${
              selected === level ? 'scale-105 shadow-md' : 'opacity-60 hover:opacity-90'
            }`}
          >
            <div className="text-xl">{cfg.emoji}</div>
            <div>{cfg.label}</div>
          </button>
        );
      })}
    </div>
  );
}

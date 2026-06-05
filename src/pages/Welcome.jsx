import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Welcome() {
  const { saveProfile, AVATARS } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦊');

  return (
    <div
      className="h-screen w-full overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #1b4332 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎲','🃏','⭐','🎯','🏆','🎲','🃏','⭐'].map((e, i) => (
          <span
            key={i}
            className="absolute text-4xl opacity-10 select-none"
            style={{
              top: `${10 + i * 11}%`,
              left: `${5 + i * 12}%`,
              transform: `rotate(${i * 37}deg)`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg overflow-hidden">
        {/* Top banner */}
        <div
          className="py-6 px-6 text-center"
          style={{ background: 'linear-gradient(135deg, #2d6a4f, #52b788)' }}
        >
          <div className="text-5xl mb-2">🎮</div>
          <h1 className="text-3xl font-black text-white tracking-wide">OrthoPlay</h1>
          <p className="text-green-100 text-sm mt-1">Le jeu qui t'aide à progresser !</p>
        </div>

        <div className="p-6">
          {/* Avatar picker */}
          <p className="font-bold text-gray-700 mb-3 text-center">Choisis ton pion :</p>
          <div className="flex flex-wrap justify-center gap-3 mb-5">
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`text-3xl p-2 rounded-2xl transition-all ${
                  avatar === a
                    ? 'bg-green-200 scale-125 shadow-lg ring-2 ring-green-500'
                    : 'bg-gray-100 hover:bg-green-100 hover:scale-110'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            type="text"
            placeholder="Ton prénom..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && saveProfile(name.trim(), avatar)}
            maxLength={20}
            className="w-full border-2 border-green-200 rounded-2xl px-4 py-3 text-center text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 mb-4"
          />

          <button
            onClick={() => name.trim() && saveProfile(name.trim(), avatar)}
            disabled={!name.trim()}
            className="w-full font-black py-4 rounded-2xl text-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: name.trim() ? 'linear-gradient(135deg, #2d6a4f, #52b788)' : undefined }}
          >
            Lancer la partie ! {avatar}
          </button>
        </div>
      </div>
    </div>
  );
}

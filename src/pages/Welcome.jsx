import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Welcome() {
  const { saveProfile, AVATARS } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦊');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold text-purple-700 mb-2">OrthoPlay</h1>
        <p className="text-gray-500 mb-8 text-sm">Entraîne-toi entre tes séances !</p>

        <div className="mb-6">
          <p className="font-semibold text-gray-700 mb-3">Choisis ton avatar :</p>
          <div className="flex flex-wrap justify-center gap-3">
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`text-3xl p-2 rounded-2xl transition-all ${
                  avatar === a
                    ? 'bg-purple-200 scale-125 shadow-lg'
                    : 'bg-gray-100 hover:bg-purple-100 hover:scale-110'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Ton prénom..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            className="w-full border-2 border-purple-200 rounded-2xl px-4 py-3 text-center text-lg font-semibold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <button
          onClick={() => name.trim() && saveProfile(name.trim(), avatar)}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Jouer ! {avatar}
        </button>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  avatar: '🦊',
  stars: 0,
  badges: [],
  completedExercises: [],
};

const AVATARS = ['🦊', '🐸', '🦁', '🐼', '🦋', '🐙', '🦄', '🐧'];

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('orthoplay_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [currentPage, setCurrentPage] = useState(profile.name ? 'home' : 'welcome');

  useEffect(() => {
    localStorage.setItem('orthoplay_profile', JSON.stringify(profile));
  }, [profile]);

  function addStars(count) {
    setProfile(p => {
      const newStars = p.stars + count;
      const badges = [...p.badges];
      if (newStars >= 10 && !badges.includes('bronze')) badges.push('bronze');
      if (newStars >= 30 && !badges.includes('argent')) badges.push('argent');
      if (newStars >= 60 && !badges.includes('or')) badges.push('or');
      return { ...p, stars: newStars, badges };
    });
  }

  function markExerciseCompleted(id) {
    setProfile(p => ({
      ...p,
      completedExercises: p.completedExercises.includes(id)
        ? p.completedExercises
        : [...p.completedExercises, id],
    }));
  }

  function saveProfile(name, avatar) {
    setProfile(p => ({ ...p, name, avatar }));
    setCurrentPage('home');
  }

  function resetProgress() {
    setProfile(DEFAULT_PROFILE);
    setCurrentPage('welcome');
  }

  return (
    <AppContext.Provider value={{
      profile,
      currentPage,
      setCurrentPage,
      addStars,
      markExerciseCompleted,
      saveProfile,
      resetProgress,
      AVATARS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

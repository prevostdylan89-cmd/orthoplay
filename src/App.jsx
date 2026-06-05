import { AppProvider, useApp } from './context/AppContext';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import QuizGame from './pages/QuizGame';
import MemoryGame from './pages/MemoryGame';
import SyllablesGame from './pages/SyllablesGame';
import RhymesGame from './pages/RhymesGame';
import SoundsGame from './pages/SoundsGame';
import Progress from './pages/Progress';

const PAGES = {
  welcome: Welcome,
  home: Home,
  quiz: QuizGame,
  memory: MemoryGame,
  syllables: SyllablesGame,
  rhymes: RhymesGame,
  sounds: SoundsGame,
  progress: Progress,
};

function Router() {
  const { currentPage } = useApp();
  const Page = PAGES[currentPage] || Home;
  return <Page />;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

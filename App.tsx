
import React, { useState } from 'react';
import { Home } from './components/Home.tsx';
import { SimulatorView } from './components/SimulatorView.tsx';

type ViewState = 'home' | 'simulator';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  return (
    <>
      {currentView === 'home' && (
        <Home onStart={() => setCurrentView('simulator')} />
      )}
      
      {currentView === 'simulator' && (
        <SimulatorView onBack={() => setCurrentView('home')} />
      )}
    </>
  );
};

export default App;

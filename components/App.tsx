import React, { useState } from 'react';
import { AppView, GameDifficulty, GameMode } from '../types';
import SplashScreen from './SplashScreen';
import MainMenu from './MainMenu';
import Game from './Game';
import AdFrame from './AdFrame';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvC);
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>(GameDifficulty.HARD);
  
  // Global Settings State
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(true);

  const toggleSound = () => setIsSoundOn(!isSoundOn);
  const toggleVibration = () => setIsVibrationOn(!isVibrationOn);

  const handleSplashComplete = () => {
    setView(AppView.MENU);
  };

  const handleSelectMode = (mode: GameMode, difficulty?: GameDifficulty) => {
    setGameMode(mode);
    if (difficulty) {
        setGameDifficulty(difficulty);
    }
    setView(AppView.GAME);
  };

  const handleBackToMenu = () => {
    setView(AppView.MENU);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050b14] overflow-hidden flex flex-col font-[Rajdhani] selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050b14] to-[#050b14]"></div>
      
      {/* Dynamic Grid Floor */}
      <div className="absolute inset-0 z-0 opacity-20 perspective-grid"></div>

      {/* Animated Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
             <div 
                key={i}
                className="absolute rounded-full bg-cyan-400 blur-[2px] animate-[float_15s_infinite_linear]"
                style={{
                    width: Math.random() * 3 + 1 + 'px',
                    height: Math.random() * 3 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.5 + 0.1,
                    animationDelay: Math.random() * -15 + 's',
                    animationDuration: Math.random() * 20 + 15 + 's',
                    boxShadow: '0 0 10px rgba(34,211,238,0.5)'
                }}
             />
          ))}
      </div>

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] scanline mix-blend-overlay"></div>
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.15] vignette"></div>

      <div className="relative z-10 w-full max-w-lg mx-auto h-[100dvh] flex flex-col">
        {view === AppView.SPLASH ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <>
            <div className="flex-grow flex flex-col overflow-hidden relative">
                {view === AppView.MENU && (
                  <div className="flex-grow flex items-center justify-center">
                    <MainMenu 
                      onSelectMode={handleSelectMode} 
                      isSoundOn={isSoundOn}
                      toggleSound={toggleSound}
                      isVibrationOn={isVibrationOn}
                      toggleVibration={toggleVibration}
                    />
                  </div>
                )}
                
                {view === AppView.GAME && (
                  <Game 
                    mode={gameMode} 
                    difficulty={gameDifficulty} 
                    onBack={handleBackToMenu}
                    isSoundOn={isSoundOn}
                    toggleSound={toggleSound}
                    isVibrationOn={isVibrationOn}
                    toggleVibration={toggleVibration}
                  />
                )}
            </div>

            {/* Ad Section - Bottom Side */}
            <div className="flex-shrink-0 z-50 animate-[slideUp_0.5s_ease-out]">
                <AdFrame />
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes float {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.6; }
            100% { transform: translateY(-100px) translateX(20px) scale(0); opacity: 0; }
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .perspective-grid {
            background-size: 40px 40px;
            background-image:
              linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
            transform: perspective(500px) rotateX(20deg) scale(1.5);
            transform-origin: top;
        }
        .vignette {
            background: radial-gradient(circle, transparent 50%, black 120%);
        }
      `}</style>
    </div>
  );
};

export default App;
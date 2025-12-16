import React, { useState } from 'react';
import { GameDifficulty, GameMode } from '../types';
import NeonButton from './NeonButton';
import { playClickSound, playStartGameSound } from '../utils/sounds';
import SettingsModal from './SettingsModal';

interface MainMenuProps {
  onSelectMode: (mode: GameMode, difficulty?: GameDifficulty) => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  isVibrationOn: boolean;
  toggleVibration: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  onSelectMode, isSoundOn, toggleSound, isVibrationOn, toggleVibration 
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
      if (isSoundOn) playClickSound();
      setShowSettings(true);
  };

  const handleModeSelect = (mode: GameMode, difficulty?: GameDifficulty) => {
      if (isSoundOn) playStartGameSound();
      onSelectMode(mode, difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto animate-[fadeIn_0.5s_ease-out] relative z-20">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isSoundOn={isSoundOn}
        toggleSound={toggleSound}
        isVibrationOn={isVibrationOn}
        toggleVibration={toggleVibration}
      />

      {/* Title */}
      <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-500 mb-2 tracking-[0.2em] font-[Orbitron] text-center drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
        SELECT
      </h2>
      <h2 className="text-4xl font-black text-white mb-10 tracking-[0.3em] font-[Orbitron] text-center opacity-80 animate-pulse">
        LEVEL
      </h2>

      {/* Decorative Grid Preview with Glow */}
      <div className="mb-12 relative w-32 h-32 transform hover:scale-105 transition-transform duration-500">
         <div className="absolute inset-0 border-[3px] border-cyan-500 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-[pulse_4s_infinite]"></div>
         <div className="absolute -inset-4 border border-cyan-500/20 rounded-[20px] animate-[spin_10s_linear_infinite]"></div>
         <div className="grid grid-cols-3 h-full w-full p-2 gap-1 relative z-10 bg-[#0f172a]/80 backdrop-blur-sm rounded-xl">
             {[...Array(9)].map((_, i) => (
                 <div key={i} className="flex items-center justify-center border border-cyan-800/30 rounded bg-cyan-950/20">
                     {i === 4 && <div className="w-6 h-6 rounded-full border-[3px] border-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>}
                     {(i === 0 || i === 8) && (
                         <div className="relative w-5 h-5 opacity-60">
                            <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rotate-45 bg-pink-500 shadow-[0_0_5px_#ec4899]"></div>
                            <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 -rotate-45 bg-pink-500 shadow-[0_0_5px_#ec4899]"></div>
                         </div>
                     )}
                 </div>
             ))}
         </div>
      </div>

      <div className="space-y-5 w-full px-6">
        {/* PvC Row - Perfectly aligned on the same line */}
        <div className="grid grid-cols-2 gap-4">
            <NeonButton 
                onClick={() => handleModeSelect(GameMode.PvC, GameDifficulty.EASY)} 
                color="blue" 
                className="w-full h-24 hover:-translate-y-1"
            >
                <div className="flex flex-col items-center leading-none">
                     <div className="mb-2 opacity-80">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <span className="text-[9px] tracking-[0.2em] font-bold opacity-70 mb-1 text-cyan-200">AI OPPONENT</span>
                     <span className="text-xl font-bold tracking-wider">EASY</span>
                </div>
            </NeonButton>

            <NeonButton 
                onClick={() => handleModeSelect(GameMode.PvC, GameDifficulty.HARD)} 
                color="blue" 
                className="w-full h-24 hover:-translate-y-1"
            >
                <div className="flex flex-col items-center leading-none">
                     <div className="mb-2 opacity-80">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     </div>
                     <span className="text-[9px] tracking-[0.2em] font-bold opacity-70 mb-1 text-cyan-200">AI OPPONENT</span>
                     <span className="text-xl font-bold tracking-wider text-pink-300 neon-text-pink">HARD</span>
                </div>
            </NeonButton>
        </div>
        
        {/* PvP Button */}
        <NeonButton 
            onClick={() => handleModeSelect(GameMode.PvP)} 
            color="yellow" 
            className="w-full h-20 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]"
        >
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-2 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div className="flex flex-col items-start">
                <span className="text-[9px] tracking-[0.2em] opacity-80">MULTIPLAYER</span>
                <span className="tracking-widest text-lg font-bold">HUMAN VS HUMAN</span>
            </div>
          </div>
        </NeonButton>

        {/* Settings Button - Added at bottom center */}
        <button 
            onClick={handleSettingsClick}
            className="mx-auto flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs tracking-widest uppercase font-bold"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
        </button>
      </div>

       <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;
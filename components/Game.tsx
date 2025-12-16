import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GameDifficulty, Player } from '../types';
import Board from './Board';
import { calculateWinner, getBestMove, getRandomMove, isBoardFull } from '../utils/gameLogic';
import { playMoveSound, playWinSound, playDrawSound, playClickSound, vibrate } from '../utils/sounds';
import SettingsModal from './SettingsModal';

interface GameProps {
  mode: GameMode;
  difficulty?: GameDifficulty;
  onBack: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  isVibrationOn: boolean;
  toggleVibration: () => void;
}

const Game: React.FC<GameProps> = ({ 
  mode, difficulty = GameDifficulty.HARD, onBack,
  isSoundOn, toggleSound, isVibrationOn, toggleVibration
}) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(false);
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [history, setHistory] = useState<Player[][]>([]);
  
  // Animation state for exiting
  const [isExiting, setIsExiting] = useState(false);

  // Local Settings Modal State
  const [showSettings, setShowSettings] = useState(false);

  const currentPlayer = xIsNext ? 'X' : 'O';

  // Handle Turn
  const handleSquareClick = useCallback((i: number) => {
    if (board[i] || winner || isAiTurn || isExiting) return;

    if (isSoundOn) playMoveSound(currentPlayer);
    if (isVibrationOn) vibrate(20);

    setHistory(prev => [...prev, board]);

    const newBoard = [...board];
    newBoard[i] = currentPlayer;
    setBoard(newBoard);
    
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (isSoundOn) setTimeout(playWinSound, 300);
      if (isVibrationOn) vibrate(200);
    } else if (isBoardFull(newBoard)) {
      setWinner('DRAW');
      if (isSoundOn) setTimeout(playDrawSound, 300);
      if (isVibrationOn) vibrate(50);
    } else {
      setXIsNext(!xIsNext);
    }
  }, [board, winner, isAiTurn, currentPlayer, xIsNext, isSoundOn, isVibrationOn, isExiting]);

  // AI Effect
  useEffect(() => {
    if (mode === GameMode.PvC && !winner && currentPlayer === 'X' && !isExiting) {
      setIsAiTurn(true);
      const timer = setTimeout(() => {
        let bestMove = -1;
        if (difficulty === GameDifficulty.EASY) {
            bestMove = getRandomMove(board);
        } else {
            bestMove = getBestMove(board, 'X');
        }

        if (bestMove !== -1) {
            setHistory(prev => [...prev, board]);
            const newBoard = [...board];
            newBoard[bestMove] = 'X';
            
            if (isSoundOn) playMoveSound('X');
            if (isVibrationOn) vibrate(20);
            
            setBoard(newBoard);
            
            const result = calculateWinner(newBoard);
            if (result) {
              setWinner(result.winner);
              setWinningLine(result.line);
              if (isSoundOn) setTimeout(playWinSound, 300);
              if (isVibrationOn) vibrate(200);
            } else if (isBoardFull(newBoard)) {
              setWinner('DRAW');
              if (isSoundOn) setTimeout(playDrawSound, 300);
              if (isVibrationOn) vibrate(50);
            } else {
              setXIsNext(false); // Back to O
            }
        }
        setIsAiTurn(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [mode, currentPlayer, winner, board, difficulty, isSoundOn, isVibrationOn, isExiting]);

  const resetGame = () => {
    if (isSoundOn) playClickSound();
    setBoard(Array(9).fill(null));
    setHistory([]);
    setWinner(null);
    setWinningLine(null);
    setXIsNext(false);
    setIsAiTurn(false);
  };

  const handleUndo = () => {
    if (isAiTurn || history.length === 0 || isExiting) return;
    if (isSoundOn) playClickSound();

    const restoreState = (prevBoard: Player[], isXNext: boolean) => {
        setBoard(prevBoard);
        setWinner(null);
        setWinningLine(null);
        setXIsNext(isXNext);
    };

    if (mode === GameMode.PvC) {
        if (winner === 'O' || winner === 'DRAW') {
             const prev = history[history.length - 1];
             setHistory(prevHist => prevHist.slice(0, -1));
             restoreState(prev, false);
             return;
        }

        if (history.length >= 2) {
            const prev = history[history.length - 2];
            setHistory(prevHist => prevHist.slice(0, -2));
            restoreState(prev, false);
        } else if (history.length === 1) {
             const prev = history[0];
             setHistory([]);
             restoreState(prev, false);
        }
    } else {
        const prev = history[history.length - 1];
        setHistory(prevHist => prevHist.slice(0, -1));
        restoreState(prev, !xIsNext);
    }
  };

  const handleBackClick = () => {
      if (isSoundOn) playClickSound();
      setIsExiting(true);
      setTimeout(() => {
          onBack();
      }, 400); // Wait for animation
  };

  const handleToggleSettings = () => {
      if (isSoundOn) playClickSound();
      setShowSettings(!showSettings);
  };

  let statusText = '';
  if (isAiTurn) {
      statusText = 'COMPUTER IS THINKING...';
  } else {
      if (mode === GameMode.PvC && currentPlayer === 'X') {
          statusText = "COMPUTER'S TURN";
      } else {
          statusText = `${currentPlayer === 'O' ? 'PLAYER 1' : 'PLAYER 2'}'S TURN`;
      }
  }

  return (
    <div className={`flex flex-col items-center justify-between h-full py-6 relative transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 animate-[fadeIn_0.5s_ease-out]'}`}>
      
      {/* Reusable Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isSoundOn={isSoundOn}
        toggleSound={toggleSound}
        isVibrationOn={isVibrationOn}
        toggleVibration={toggleVibration}
      />

      {/* Winner Overlay - Centered */}
      {winner && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a]/95 backdrop-blur-md animate-[fadeIn_0.5s_ease-out]">
            {/* Neon Confetti Effect - Centered Explosion */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex justify-center items-center">
                 {[...Array(40)].map((_, i) => (
                     <div 
                        key={i} 
                        className={`absolute w-2 h-4 animate-[confetti_1.5s_ease-out_forwards] ${Math.random() > 0.5 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-pink-500 shadow-[0_0_10px_#ec4899]'}`}
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: `rotate(${Math.random() * 360}deg)`,
                            animationDelay: `${Math.random() * 0.2}s`,
                            '--tx': `${(Math.random() - 0.5) * 800}px`,
                            '--ty': `${(Math.random() - 0.5) * 800}px`,
                            '--r': `${Math.random() * 1080}deg`
                        } as React.CSSProperties}
                     />
                 ))}
            </div>

            <div className="flex flex-col items-center animate-[popIn_0.6s_cubic-bezier(0.34,1.56,0.64,1)] z-50 p-6">
                {winner === 'DRAW' ? (
                     <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] font-[Orbitron] tracking-widest mb-4 text-center">
                        DRAW
                     </h1>
                ) : (
                    <>
                        <h1 className={`text-6xl md:text-8xl font-black font-[Orbitron] tracking-wider mb-2 text-center ${winner === 'O' ? 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-pink-300 to-purple-600 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]'}`}>
                            BOOYAH
                        </h1>
                         <div className="text-xl md:text-2xl text-white/80 font-bold tracking-[0.5em] uppercase border-t border-white/20 pt-4 mt-2">
                             {winner === 'O' ? 'PLAYER 1 WINS' : (mode === GameMode.PvC ? 'COMPUTER WINS' : 'PLAYER 2 WINS')}
                         </div>
                    </>
                )}

                <button 
                    onClick={resetGame}
                    className="mt-16 px-10 py-4 bg-white text-slate-900 rounded-full font-black tracking-[0.2em] text-lg hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] border-4 border-white/50 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80"
                >
                    PLAY AGAIN
                </button>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full mb-2 relative z-10">
         <div className="flex items-center justify-between w-full px-6 md:px-8">
            <button onClick={handleBackClick} className="text-cyan-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 active:scale-95">
                 <svg className="w-8 h-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div className="text-xl font-bold tracking-wider flex flex-col items-center">
                <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm shadow-xl">
                    <span className={`transition-all duration-300 ${!xIsNext && !winner ? 'text-cyan-400 neon-text-blue scale-110 font-bold' : 'text-slate-500 scale-95'}`}>P1 (O)</span>
                    <span className="text-[10px] text-slate-600 font-mono">VS</span>
                    <span className={`transition-all duration-300 ${xIsNext && !winner ? 'text-pink-500 neon-text-pink scale-110 font-bold' : 'text-slate-500 scale-95'}`}>
                        {mode === GameMode.PvC ? 'CPU (X)' : 'P2 (X)'}
                    </span>
                </div>
            </div>

            <button onClick={handleToggleSettings} className="transition-colors p-2 rounded-full hover:bg-white/10 text-cyan-400 active:scale-95">
                 <svg className="w-7 h-7 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
            </button>
         </div>
         
         <div className="flex gap-4">
             <span className="px-3 py-1 rounded border border-cyan-500/30 bg-cyan-950/30 text-[10px] text-cyan-300/80 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                {mode === GameMode.PvC ? `${difficulty} Mode` : 'Versus Mode'}
             </span>
         </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full my-4 perspective-1000 z-0">
         <Board squares={board} onClick={handleSquareClick} winningLine={winningLine} />
      </div>

      <div className="w-full flex flex-col items-center gap-6 mb-8 min-h-[140px] justify-end relative z-10">
          {!winner && (
              <div className="flex flex-col items-center gap-6 animate-[fadeIn_0.5s]">
                  <div className="text-slate-500 text-xs tracking-[0.3em] font-bold animate-pulse uppercase border-b border-slate-800 pb-1">
                      {statusText}
                  </div>

                  <button 
                        onClick={handleUndo}
                        disabled={history.length === 0 || isAiTurn}
                        className={`
                            group relative w-16 h-16 flex items-center justify-center rounded-2xl border 
                            transition-all duration-300 overflow-hidden
                            ${history.length > 0 && !isAiTurn 
                                ? 'border-cyan-500/50 bg-cyan-900/10 shadow-[0_0_20px_rgba(34,211,238,0.1)] text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:-translate-y-1' 
                                : 'border-slate-800 bg-slate-900/50 text-slate-700 cursor-not-allowed opacity-50'}
                        `}
                    >
                        {history.length > 0 && !isAiTurn && <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                        <svg className="w-6 h-6 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span className="absolute -bottom-6 text-[9px] text-cyan-500/0 group-hover:text-cyan-500/70 transition-all font-mono tracking-widest">UNDO</span>
                    </button>
              </div>
          )}
      </div>

      <style>{`
         @keyframes popIn {
             from { opacity: 0; transform: scale(0.5); }
             to { opacity: 1; transform: scale(1); }
         }
         @keyframes confetti {
             0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
             100% { transform: translate(var(--tx), var(--ty)) rotate(var(--r)); opacity: 0; }
         }
         .perspective-1000 {
             perspective: 1000px;
         }
      `}</style>
    </div>
  );
};

export default Game;
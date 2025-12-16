import React, { useMemo } from 'react';
import { Player } from '../types';

interface BoardProps {
  squares: Player[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  
  // Calculate SVG line coordinates for the winning line
  const winningLineCoords = useMemo(() => {
    if (!winningLine) return null;

    const startIdx = winningLine[0];
    const endIdx = winningLine[2];

    const getCoord = (idx: number) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        // Assuming 100x100 cells in a 300x300 grid
        return { x: col * 100 + 50, y: row * 100 + 50 };
    };

    const start = getCoord(startIdx);
    const end = getCoord(endIdx);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    const ux = length > 0 ? dx / length : 0;
    const uy = length > 0 ? dy / length : 0;

    const extension = 45;
    
    return {
        x1: start.x - ux * extension,
        y1: start.y - uy * extension,
        x2: end.x + ux * extension,
        y2: end.y + uy * extension
    };

  }, [winningLine]);

  const renderSquare = (i: number) => {
    const isWinningSquare = winningLine?.includes(i);
    const value = squares[i];
    
    let content = null;
    
    if (value === 'O') {
      content = (
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            <circle 
                cx="50" cy="50" r="35" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="8" 
                strokeLinecap="round"
                className="animate-[drawCircle_0.4s_ease-out_forwards]"
                style={{ strokeDasharray: 220, strokeDashoffset: 220 }} 
            />
        </svg>
      );
    } else if (value === 'X') {
      content = (
         <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
            <line 
                x1="25" y1="25" x2="75" y2="75" 
                stroke="#ec4899" 
                strokeWidth="8" 
                strokeLinecap="round"
                className="animate-[drawLine_0.3s_ease-out_forwards]"
                style={{ strokeDasharray: 71, strokeDashoffset: 71 }} 
            />
            <line 
                x1="75" y1="25" x2="25" y2="75" 
                stroke="#ec4899" 
                strokeWidth="8" 
                strokeLinecap="round"
                className="animate-[drawLine_0.3s_ease-out_0.15s_forwards]"
                style={{ strokeDasharray: 71, strokeDashoffset: 71 }} 
            />
         </svg>
      );
    }

    return (
      <button
        key={i}
        className={`
          h-24 w-24 md:h-32 md:w-32 
          flex items-center justify-center 
          relative z-10
          transition-all duration-300
          ${isWinningSquare ? 'bg-white/5' : 'hover:bg-white/5'}
        `}
        onClick={() => onClick(i)}
        disabled={value !== null}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="relative p-1">
      {/* Outer Glow Container */}
      <div className="absolute -inset-1 border-4 border-cyan-500/30 rounded-3xl blur-md"></div>
      <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.1)]"></div>
      
      {/* Inner Grid */}
      <div className="relative bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 grid grid-cols-3 gap-0 z-10 overflow-hidden">
        
        {/* Animated Grid Lines Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none p-4 md:p-6">
            <svg width="100%" height="100%" viewBox="0 0 300 300" preserveAspectRatio="none">
                 {/* Vertical Lines */}
                 <line x1="100" y1="10" x2="100" y2="290" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="2" strokeLinecap="round" className="animate-[growH_0.6s_ease-out_forwards]" style={{transformOrigin: 'top'}} />
                 <line x1="200" y1="10" x2="200" y2="290" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="2" strokeLinecap="round" className="animate-[growH_0.6s_ease-out_0.2s_forwards]" style={{transformOrigin: 'bottom'}} />
                 
                 {/* Horizontal Lines */}
                 <line x1="10" y1="100" x2="290" y2="100" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="2" strokeLinecap="round" className="animate-[growW_0.6s_ease-out_0.4s_forwards]" style={{transformOrigin: 'left'}} />
                 <line x1="10" y1="200" x2="290" y2="200" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="2" strokeLinecap="round" className="animate-[growW_0.6s_ease-out_0.6s_forwards]" style={{transformOrigin: 'right'}} />
            </svg>
        </div>

        {squares.map((_, i) => renderSquare(i))}

        {/* Winning Line Overlay */}
        {winningLineCoords && (
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 300 300">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <line 
                    x1={winningLineCoords.x1} y1={winningLineCoords.y1}
                    x2={winningLineCoords.x2} y2={winningLineCoords.y2}
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="animate-[drawWinLine_0.5s_ease-out_forwards]"
                    style={{ strokeDasharray: 450, strokeDashoffset: 450, filter: 'url(#glow)' }}
                />
                 <line 
                    x1={winningLineCoords.x1} y1={winningLineCoords.y1}
                    x2={winningLineCoords.x2} y2={winningLineCoords.y2}
                    stroke={squares[winningLine[0]] === 'X' ? '#ec4899' : '#22d3ee'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-[drawWinLine_0.5s_ease-out_forwards]"
                    style={{ strokeDasharray: 450, strokeDashoffset: 450 }}
                />
             </svg>
        )}
      </div>
      
       <style>{`
        @keyframes drawCircle {
            to { stroke-dashoffset: 0; }
        }
        @keyframes drawLine {
            to { stroke-dashoffset: 0; }
        }
        @keyframes drawWinLine {
            to { stroke-dashoffset: 0; }
        }
        @keyframes growH {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
        }
        @keyframes growW {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default Board;
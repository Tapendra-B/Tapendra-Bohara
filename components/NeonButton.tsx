import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: 'blue' | 'yellow' | 'pink';
  className?: string;
  icon?: React.ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({ children, onClick, color = 'blue', className = '', icon }) => {
  const colorClasses = {
    blue: 'border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6),inset_0_0_15px_rgba(34,211,238,0.4)] hover:bg-cyan-900/30 border-cyan-400/80',
    yellow: 'border-yellow-400 text-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.4),inset_0_0_10px_rgba(250,204,21,0.2)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6),inset_0_0_15px_rgba(250,204,21,0.4)] hover:bg-yellow-900/30 border-yellow-400/80',
    pink: 'border-pink-500 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.4),inset_0_0_10px_rgba(236,72,153,0.2)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6),inset_0_0_15px_rgba(236,72,153,0.4)] hover:bg-pink-900/30 border-pink-500/80',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative group flex items-center justify-center gap-3
        px-6 py-5 rounded-2xl border-[1.5px]
        transition-all duration-200 transform active:scale-95 active:duration-75
        uppercase tracking-widest font-bold text-lg
        backdrop-blur-md bg-opacity-10 bg-slate-900
        ${colorClasses[color]}
        ${className}
      `}
    >
      {icon && <span className="text-2xl drop-shadow-[0_0_5px_currentColor]">{icon}</span>}
      {children}
    </button>
  );
};

export default NeonButton;
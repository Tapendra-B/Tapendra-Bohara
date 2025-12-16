import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Made by Tapendra";

  useEffect(() => {
    let currentIndex = 0;
    // Initial delay before typing starts
    const startDelay = setTimeout(() => {
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                // Pause at the end before finishing
                setTimeout(() => {
                    onComplete();
                }, 1200);
            }
        }, 120); // Typing speed in ms
        
        return () => clearInterval(typingInterval);
    }, 500);

    return () => clearTimeout(startDelay);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col items-center justify-center selection:bg-cyan-500/30">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0f172a] to-[#0f172a]"></div>
      
      <div className="relative z-10 p-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-wider font-[Orbitron] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
            {displayText}
            <span className="text-cyan-400 animate-[blink_0.8s_infinite] ml-1">|</span>
          </h1>
      </div>

      <style>{`
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
import React from 'react';
import { playClickSound, vibrate } from '../utils/sounds';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  isVibrationOn: boolean;
  toggleVibration: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, isSoundOn, toggleSound, isVibrationOn, toggleVibration 
}) => {
  if (!isOpen) return null;

  const handleShare = async () => {
    if (isSoundOn) playClickSound();
    
    const currentUrl = window.location.href;
    const baseText = 'Play Tic Tac Toe MAX! \nClassic neon game. Made by Tapendra.';

    const shareData: ShareData = {
      title: 'Tic Tac Toe MAX',
      text: baseText,
      url: currentUrl,
    };

    try {
      // 1. Try Native Share (Mobile - WhatsApp, Bluetooth, etc)
      if (typeof navigator.share === 'function') {
        // Validation check if supported
        if (navigator.canShare && !navigator.canShare(shareData)) {
             // Fallback for strict implementations: Put URL in text
             await navigator.share({
                 title: shareData.title,
                 text: `${baseText}\n${currentUrl}`
             });
        } else {
            await navigator.share(shareData);
        }
      } else {
        throw new Error('Web Share API not available');
      }
    } catch (err: any) {
      // 2. Handle Errors / Fallback
      if (err.name !== 'AbortError') {
         try {
             // Clipboard Fallback
             const clipboardText = `${baseText}\n${currentUrl}`;
             await navigator.clipboard.writeText(clipboardText);
             alert('Link copied to clipboard! You can paste it in WhatsApp, Facebook, or any other app.');
         } catch (clipboardErr) {
             console.error('Share failed:', clipboardErr);
             // 3. Last Resort Fallback
             prompt("Copy this link to share:", currentUrl);
         }
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-[#0f172a]/90 border border-cyan-500/50 rounded-2xl p-6 w-72 shadow-[0_0_50px_rgba(34,211,238,0.2)] scale-100 ring-1 ring-white/10">
            <h3 className="text-xl font-bold text-center text-cyan-400 mb-8 tracking-[0.2em] font-[Orbitron] border-b border-white/5 pb-2">SETTINGS</h3>
            
            <div className="space-y-4">
                <button 
                    onClick={() => { toggleSound(); if(!isSoundOn) playClickSound(); }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-cyan-500/30 group"
                >
                    <span className="text-slate-300 font-bold tracking-wider group-hover:text-white transition-colors">SOUND FX</span>
                    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isSoundOn ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isSoundOn ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </button>
                
                <button 
                    onClick={() => { toggleVibration(); if(isSoundOn) playClickSound(); if(!isVibrationOn) vibrate(50); }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-pink-500/30 group"
                >
                    <span className="text-slate-300 font-bold tracking-wider group-hover:text-white transition-colors">VIBRATION</span>
                    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isVibrationOn ? 'bg-pink-500 shadow-[0_0_10px_#ec4899]' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isVibrationOn ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </button>

                <button 
                    onClick={handleShare}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-yellow-500/30 group"
                >
                    <span className="text-slate-300 font-bold tracking-wider group-hover:text-white transition-colors">SHARE APP</span>
                    <div className="w-12 h-6 flex items-center justify-end text-slate-500 group-hover:text-yellow-400 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                </button>

                <button 
                    onClick={() => { onClose(); if(isSoundOn) playClickSound(); }}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-300 border border-cyan-500/30 rounded-xl hover:text-white hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all uppercase tracking-widest font-bold text-sm"
                >
                    Close
                </button>

                <div className="text-center mt-2">
                     <p className="text-[10px] text-slate-500 font-mono">Made by Tapendra</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsModal;
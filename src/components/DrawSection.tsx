import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Dices, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';
import { fireWinnerCelebration } from '../utils/confetti';

interface DrawSectionProps {
  participants: string[];
  isMuted: boolean;
  onWinnerSelected: (winner: string) => void;
  winnerCardRef: React.RefObject<HTMLDivElement | null>;
}

export const DrawSection: React.FC<DrawSectionProps> = ({
  participants,
  isMuted,
  onWinnerSelected,
  winnerCardRef
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShuffleName, setCurrentShuffleName] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const handleStartDraw = () => {
    setWarningMessage(null);

    // Rule: "Bo‘sh ro‘yxatdan g‘olib tanlanmasin" & "Faqat haqiqiy yuklangan obunachilar orasidan tanlansin"
    if (!participants || participants.length === 0) {
      setWarningMessage("Iltimos, g‘olibni tanlashdan oldin yuqorida haqiqiy obunachilar ro‘yxatini yuklang!");
      return;
    }

    if (isDrawing) return;

    setIsDrawing(true);

    // Cryptographically secure random selection from real participants
    const cryptoBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(cryptoBuffer);
    const chosenWinnerIndex = cryptoBuffer[0] % participants.length;
    const finalWinner = participants[chosenWinnerIndex];

    // High energy roulette / shuffle animation
    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds animation sequence

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Random name from current pool for rolling visual
      const randomDisplayIndex = Math.floor(Math.random() * participants.length);
      setCurrentShuffleName(participants[randomDisplayIndex]);

      soundEffects.playTick(isMuted);

      if (progress < 1) {
        // Progressive slowdown curve (quadratic ease-out)
        const delay = 45 + Math.pow(progress, 2.4) * 320;
        animationTimerRef.current = setTimeout(tick, delay);
      } else {
        // Animation complete! Set final real winner
        setCurrentShuffleName(finalWinner);
        setIsDrawing(false);
        soundEffects.playWinnerFanfare(isMuted);
        fireWinnerCelebration();
        onWinnerSelected(finalWinner);

        // Smoothly scroll down to winner card
        setTimeout(() => {
          winnerCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    };

    tick();
  };

  const hasParticipants = participants.length > 0;

  return (
    <section className="w-full max-w-4xl mx-auto py-8 px-4 text-center">
      {/* Visual rolling display while drawing */}
      {isDrawing && currentShuffleName && (
        <div className="mb-6 p-6 rounded-2xl bg-[#141724] border-2 border-pink-500 shadow-2xl shadow-pink-500/30 max-w-lg mx-auto transform animate-pulse">
          <div className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>TASODIFIY TANLANMOQDA...</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wide truncate">
            @{currentShuffleName}
          </div>
        </div>
      )}

      {/* 2. O‘rta qism — Katta, chiroyli tugma */}
      <div className="relative inline-block group">
        {/* Glow effect */}
        <div
          className={`absolute -inset-1 rounded-2xl instagram-gradient opacity-70 blur-xl transition duration-500 group-hover:opacity-100 ${
            isDrawing ? 'animate-pulse opacity-100' : ''
          }`}
        />

        <button
          type="button"
          onClick={handleStartDraw}
          disabled={isDrawing || !hasParticipants}
          className={`relative z-10 px-8 sm:px-12 py-5 sm:py-6 rounded-2xl font-black text-lg sm:text-2xl tracking-wide text-white transition-all transform flex items-center justify-center gap-3 sm:gap-4 shadow-2xl ${
            !hasParticipants
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
              : isDrawing
              ? 'instagram-gradient cursor-wait scale-[0.98]'
              : 'instagram-gradient hover:scale-[1.02] active:scale-[0.99] cursor-pointer hover:shadow-pink-500/40'
          }`}
        >
          {isDrawing ? (
            <>
              <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>G‘OLIB ANIQLANMOQDA...</span>
            </>
          ) : (
            <>
              <span className="text-2xl sm:text-3xl">🎲</span>
              <span>TASODIFIY G‘OLIBNI TANLASH</span>
            </>
          )}
        </button>
      </div>

      {/* Subtext info */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>
          {hasParticipants
            ? `${participants.length} ta haqiqiy obunachi orasidan 100% tasodifiy tanlanadi`
            : "G‘olibni tanlash uchun avval obunachilar ro‘yxatini yuklang"}
        </span>
      </div>

      {/* Warning message if list is empty */}
      {warningMessage && (
        <div className="mt-4 max-w-md mx-auto p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}
    </section>
  );
};

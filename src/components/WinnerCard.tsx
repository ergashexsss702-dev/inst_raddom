import React, { useState } from 'react';
import { 
  Trophy, 
  Copy, 
  Check, 
  Dices, 
  RotateCcw, 
  ExternalLink, 
  Share2, 
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface WinnerCardProps {
  winner: string | null;
  onRedraw: () => void;
  onReset: () => void;
  isMuted: boolean;
  winnerCardRef: React.RefObject<HTMLDivElement | null>;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({
  winner,
  onRedraw,
  onReset,
  isMuted,
  winnerCardRef
}) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const cleanWinner = winner ? winner.replace(/^@+/, '') : '';

  const handleCopyUsername = async () => {
    if (!winner) return;
    try {
      await navigator.clipboard.writeText(`@${cleanWinner}`);
      setCopied(true);
      soundEffects.playSuccess(isMuted);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleCopyShareText = async () => {
    if (!winner) return;
    const text = `🏆 INSTAGRAM TANLOV G‘OLIBI ANIQLANDI!\n\n🎉 TABRIKLAYMIZ! 🎉\n@${cleanWinner}\nSiz Instagram tanlovida g‘olib bo‘ldingiz!\n\n#Giveaway #InstaWinner #${cleanWinner}`;
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      soundEffects.playSuccess(isMuted);
      setTimeout(() => setShareCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <section 
      ref={winnerCardRef}
      className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4"
    >
      {/* 3. Pastki qism — Alohida katta kartada joylashgan YUTGAN AKKAUNT NOMI */}
      <div className={`relative rounded-3xl p-6 sm:p-10 transition-all duration-700 ${
        winner 
          ? 'bg-gradient-to-b from-[#181a28] to-[#0f111a] border-2 border-pink-500/80 shadow-[0_0_60px_-10px_rgba(225,48,108,0.35)]'
          : 'bg-[#10121a]/80 border border-white/10 shadow-xl'
      }`}>
        {/* Decorative corner glows if winner exists */}
        {winner && (
          <>
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="text-center relative z-10">
          {/* Sarlavha: 🏆 TANLOV G‘OLIBI */}
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl sm:text-4xl">🏆</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
              TANLOV G‘OLIBI
            </h2>
          </div>

          {winner ? (
            <div className="space-y-6">
              {/* Tabrik matni */}
              <div className="space-y-2">
                <div className="text-lg sm:text-2xl font-black text-amber-300 tracking-wider flex items-center justify-center gap-2">
                  <span>🎉</span>
                  <span>TABRIKLAYMIZ!</span>
                  <span>🎉</span>
                </div>
                <p className="text-base sm:text-xl font-semibold text-slate-200">
                  Siz Instagram tanlovida g‘olib bo‘ldingiz!
                </p>
              </div>

              {/* G‘olibning Instagram akkaunt nomi katta harflarda va aniq ko‘rinsin */}
              <div className="py-6 sm:py-8 px-4 rounded-2xl bg-[#090a0f] border-2 border-pink-500/40 relative overflow-hidden group shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 pointer-events-none" />
                
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
                  G‘olibning rasmiy username’i
                </div>

                <div className="text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white select-all break-all instagram-text-gradient drop-shadow-lg">
                  @{cleanWinner}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <a
                    href={`https://instagram.com/${cleanWinner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <span>Instagram profilini ochish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* G‘olib kartasidagi tugmalar:
                  - 📋 Username’ni nusxalash
                  - 🎲 Qayta tanlash
                  - 🔄 Yangi tanlov */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-2xl mx-auto">
                {/* 1. Username'ni nusxalash */}
                <button
                  type="button"
                  onClick={handleCopyUsername}
                  className={`py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 active:scale-[0.98]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-300" />
                      <span>Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-pink-400" />
                      <span>Username’ni nusxalash</span>
                    </>
                  )}
                </button>

                {/* 2. Qayta tanlash */}
                <button
                  type="button"
                  onClick={onRedraw}
                  className="py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base instagram-gradient text-white hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
                >
                  <Dices className="w-5 h-5" />
                  <span>Qayta tanlash</span>
                </button>

                {/* 3. Yangi tanlov */}
                <button
                  type="button"
                  onClick={onReset}
                  className="py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5 text-slate-400" />
                  <span>Yangi tanlov</span>
                </button>
              </div>

              {/* Share congratulation announcement snippet */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleCopyShareText}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareCopied ? "Post matni nusxalandi!" : "E'lon qilish matnini nusxalash (Stories / Post)"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-600">
                <Trophy className="w-8 h-8" />
              </div>
              <p className="text-base font-medium text-slate-400">
                G‘olib hali aniqlanmadi
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Yuqorida obunachilarni yuklang va «🎲 TASODIFIY G‘OLIBNI TANLASH» tugmasini bosing
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onResetAll: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onResetAll,
  onOpenHelp
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone: 1 clean text element wordmark with Instagram gradient badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl instagram-gradient p-[2px] flex items-center justify-center shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-[#08090d] rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            INSTA <span className="instagram-text-gradient font-black">RANDOM WINNER</span>
          </span>
        </div>

        {/* Clean nav/help items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={onOpenHelp}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Qo‘llanma va Eksport
          </button>
          <a
            href="#qoidalar"
            onClick={(e) => {
              e.preventDefault();
              onOpenHelp();
            }}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Shaffoflik kafolati
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenHelp}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Qo‘llanma"
            aria-label="Qo‘llanma"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isMuted
                ? 'border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5'
                : 'border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 shadow-sm'
            }`}
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            aria-label={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Barcha ma'lumotlarni tozalash"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Yangi tanlov</span>
          </button>
        </div>
      </div>
    </header>
  );
};

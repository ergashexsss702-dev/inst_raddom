import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { AccountInputSection } from './components/AccountInputSection';
import { DrawSection } from './components/DrawSection';
import { WinnerCard } from './components/WinnerCard';
import { HistorySection, WinnerRecord } from './components/HistorySection';
import { InfoModal } from './components/InfoModal';
import { ParticipantsModal } from './components/ParticipantsModal';
import { soundEffects } from './utils/soundEffects';

export default function App() {
  const [instagramAccount, setInstagramAccount] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [winnerHistory, setWinnerHistory] = useState<WinnerRecord[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState<boolean>(false);

  const winnerCardRef = useRef<HTMLDivElement | null>(null);

  const handleWinnerSelected = (winner: string) => {
    setCurrentWinner(winner);
    
    // Add to history
    const newRecord: WinnerRecord = {
      id: Date.now().toString(),
      username: winner,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      orderNumber: winnerHistory.length + 1
    };
    setWinnerHistory((prev) => [newRecord, ...prev]);
  };

  const handleRedraw = () => {
    if (participants.length === 0) return;
    
    // Scroll up smoothly to draw section
    window.scrollTo({ top: 380, behavior: 'smooth' });

    // Trigger draw again
    const cryptoBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(cryptoBuffer);
    const chosenWinnerIndex = cryptoBuffer[0] % participants.length;
    const finalWinner = participants[chosenWinnerIndex];

    setTimeout(() => {
      handleWinnerSelected(finalWinner);
      soundEffects.playWinnerFanfare(isMuted);
    }, 400);
  };

  const handleResetAll = () => {
    setInstagramAccount('');
    setParticipants([]);
    setCurrentWinner(null);
    setWinnerHistory([]);
    soundEffects.playSuccess(isMuted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Decorative gradient blur background lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[#833AB4]/15 via-[#E1306C]/15 to-[#FCB045]/15 blur-[120px] pointer-events-none -z-10" />

      {/* Top Bar Contract compliant navigation */}
      <Header
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onResetAll={handleResetAll}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="flex-1 flex flex-col justify-start">
        {/* 1. Yuqori qism — Instagram akkaunt va Obunachilarni yuklash */}
        <AccountInputSection
          instagramAccount={instagramAccount}
          setInstagramAccount={setInstagramAccount}
          participants={participants}
          setParticipants={setParticipants}
          isMuted={isMuted}
          onOpenParticipantsModal={() => setIsParticipantsModalOpen(true)}
        />

        {/* 2. O‘rta qism — Katta chiroyli tugma: 🎲 TASODIFIY G‘OLIBNI TANLASH */}
        <DrawSection
          participants={participants}
          isMuted={isMuted}
          onWinnerSelected={handleWinnerSelected}
          winnerCardRef={winnerCardRef}
        />

        {/* 3. Pastki qism — YUTGAN AKKAUNT NOMI alohida katta kartada */}
        <WinnerCard
          winner={currentWinner}
          onRedraw={handleRedraw}
          onReset={handleResetAll}
          isMuted={isMuted}
          winnerCardRef={winnerCardRef}
        />

        {/* History of winners (if more than 1 winner drawn) */}
        <HistorySection
          history={winnerHistory}
          onClearHistory={() => setWinnerHistory([])}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-[#06070a]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">INSTA RANDOM WINNER</span>
            <span>·</span>
            <span>Instagram tanlovlari uchun tasodifiy va adolatli g‘olib generatori</span>
          </div>
          <div className="text-slate-400">
            Haqiqiy kriptografik tasodifiylik bilan ishlaydi
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InfoModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        participants={participants}
        setParticipants={setParticipants}
      />
    </div>
  );
}

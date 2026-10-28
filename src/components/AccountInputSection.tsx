import React, { useState, useRef } from 'react';
import { 
  Users, 
  Upload, 
  FileText, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  List
} from 'lucide-react';
import { 
  normalizeUsername, 
  isValidInstagramUsername, 
  parseFileContent, 
  parseRawTextParticipants, 
  DEMO_PARTICIPANTS,
  downloadSampleCsvTemplate
} from '../utils/instagramParser';
import { soundEffects } from '../utils/soundEffects';

interface AccountInputSectionProps {
  instagramAccount: string;
  setInstagramAccount: (val: string) => void;
  participants: string[];
  setParticipants: (list: string[]) => void;
  isMuted: boolean;
  onOpenParticipantsModal: () => void;
}

export const AccountInputSection: React.FC<AccountInputSectionProps> = ({
  instagramAccount,
  setInstagramAccount,
  participants,
  setParticipants,
  isMuted,
  onOpenParticipantsModal
}) => {
  const [inputValue, setInputValue] = useState(instagramAccount || '');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const clean = normalizeUsername(inputValue);
    if (!clean) {
      setErrorMessage('Iltimos, Instagram akkaunt nomini kiriting!');
      return;
    }

    if (!isValidInstagramUsername(clean)) {
      setErrorMessage("Instagram akkaunt nomi noto'g'ri formatda. Faqat harflar, raqamlar, nuqta va pastki chiziq bo'lishi mumkin.");
      return;
    }

    setIsLoading(true);
    setInstagramAccount(clean);
    setInputValue('@' + clean);

    setTimeout(() => {
      setIsLoading(false);
      soundEffects.playSuccess(isMuted);
      if (participants.length > 0) {
        setSuccessNotice(`@${clean} akkaunti uchun ${participants.length} ta mavjud obunachi tayyor.`);
      } else {
        setSuccessNotice(`@${clean} akkaunti tasdiqlandi. Quyidan CSV/TXT fayl yuklang yoki namunaviy ro'yxatni tanlang.`);
      }
    }, 600);
  };

  const handleFileUpload = (file: File) => {
    setErrorMessage(null);
    setSuccessNotice(null);

    const validExtensions = ['.csv', '.txt', '.json'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExt) {
      setErrorMessage("Faqat CSV yoki TXT (.csv, .txt) formatidagi fayllar qabul qilinadi.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseFileContent(content, removeDuplicates);

        if (parsed.length === 0) {
          setErrorMessage("Fayl ichidan birorta ham haqiqiy Instagram username topilmadi.");
          return;
        }

        setParticipants(parsed);
        soundEffects.playSuccess(isMuted);
        setSuccessNotice(`${file.name} faylidan ${parsed.length} ta haqiqiy obunachi muvaffaqiyatli yuklandi!`);
      } catch {
        setErrorMessage("Faylni o'qishda xatolik yuz berdi. Fayl kodirovkasini tekshiring.");
      }
    };
    reader.onerror = () => {
      setErrorMessage("Faylni yuklashda xatolik yuz berdi.");
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!pasteText.trim()) {
      setErrorMessage("Iltimos, obunachilar ro'yxatini matn sifatida joylashtiring.");
      return;
    }

    const parsed = parseRawTextParticipants(pasteText, removeDuplicates);
    if (parsed.length === 0) {
      setErrorMessage("Kiritilgan matndan haqiqiy Instagram username'lar topilmadi.");
      return;
    }

    setParticipants(parsed);
    soundEffects.playSuccess(isMuted);
    setSuccessNotice(`Matndan ${parsed.length} ta haqiqiy ishtirokchi muvaffaqiyatli ajratib olindi!`);
  };

  const handleLoadDemo = () => {
    setErrorMessage(null);
    setParticipants([...DEMO_PARTICIPANTS]);
    if (!instagramAccount) {
      setInstagramAccount('uzb_giveaway_official');
      setInputValue('@uzb_giveaway_official');
    }
    soundEffects.playSuccess(isMuted);
    setSuccessNotice(`Namunaviy ro'yxat yuklandi: ${DEMO_PARTICIPANTS.length} ta haqiqiy formatdagi ishtirokchi tayyor!`);
  };

  const handleClearParticipants = () => {
    setParticipants([]);
    setSuccessNotice(null);
    setErrorMessage(null);
  };

  return (
    <section className="w-full max-w-4xl mx-auto pt-8 pb-6 px-4">
      {/* 1. Yuqori qism — Instagram akkaunt Sarlavha va Matn */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-pink-400 font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
          <span>100% Shaffof va Adolatli Random Tanlov</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          🎁 INSTAGRAM RANDOM WINNER
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
          Instagram tanlovingiz g‘olibini tasodifiy tanlang!
        </p>
      </div>

      {/* Account Input Card */}
      <div className="bg-[#10121a] rounded-2xl border border-white/10 p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-1 instagram-gradient opacity-90" />

        <form onSubmit={handleAccountSubmit} className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="insta-username" 
              className="block text-sm font-semibold text-slate-200"
            >
              Instagram akkaunt nomini kiriting
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="insta-username"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-[#0a0b10] border border-white/15 focus:border-[#E1306C] focus:ring-2 focus:ring-[#E1306C]/25 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-base font-medium outline-none transition-all"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="instagram-gradient text-white font-bold px-6 py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>OBUNACHILARNI YUKLASH</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Status Notice or Error */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Current Active Account Status */}
        {instagramAccount && (
          <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Faol akkaunt:</span>
              <span className="font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 font-mono">
                @{instagramAccount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Haqiqiy ishtirokchilar:</span>
              <span className="font-bold text-pink-400 font-mono tabular-nums text-sm">
                {participants.length} ta
              </span>
            </div>
          </div>
        )}

        {/* File and Data Upload Drawer */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Upload className="w-4 h-4 text-pink-400" />
              <span>Obunachilar ro‘yxatini manbadan yuklash</span>
            </div>
            
            {/* Quick Demo Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadDemo}
                className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                title="Sinab ko'rish uchun 50 ta haqiqiy obunachi namunasi"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Namunaviy ro‘yxat bilan sinash (50 ta)</span>
              </button>
            </div>
          </div>

          {/* Toggle between Upload File and Paste List */}
          <div className="flex items-center gap-2 p-1 bg-[#0a0b10] rounded-xl border border-white/10 max-w-sm mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CSV / TXT fayl</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'paste'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Matn ko‘rinishida</span>
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-white/15 hover:border-white/30 bg-[#090a0f]/60 hover:bg-[#090a0f]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-pink-400">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                CSV yoki TXT faylni bu yerga tashlang yoki tanlang
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-3">
                Instagram eksport vositasi yoki izohlardan olingan .csv yoki .txt fayl
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs text-pink-400 font-medium underline underline-offset-4">
                  Faylni tanlash
                </span>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadSampleCsvTemplate();
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV shablonni yuklab olish</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="@dilshod_official&#10;@madina_karimova&#10;@islombek_uz&#10;@sarvinoz_art"
                rows={4}
                className="w-full bg-[#0a0b10] border border-white/15 focus:border-[#E1306C] focus:ring-2 focus:ring-[#E1306C]/25 text-white placeholder-slate-600 rounded-xl p-3.5 text-sm font-mono outline-none transition-all resize-y"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Har bir qatorda bittadan yoki vergul bilan ajratilgan akkaunt nomlari
                </p>
                <button
                  type="button"
                  onClick={handlePasteSubmit}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Ro‘yxatni saqlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Manage Participants Strip */}
          {participants.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-300">
                  Yuklangan: <strong className="text-white font-mono">{participants.length}</strong> ta akkaunt
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="rounded border-white/20 text-pink-500 focus:ring-0 bg-transparent"
                  />
                  <span>Duplikatlarni tozalash</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenParticipantsModal}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>Ro‘yxatni ko‘rish</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearParticipants}
                  className="px-2.5 py-1 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  title="Ro'yxatni tozalash"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Tozalash</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

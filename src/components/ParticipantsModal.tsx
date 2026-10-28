import React, { useState } from 'react';
import { X, Search, Trash2, Plus, Copy, Check, Users } from 'lucide-react';
import { normalizeUsername, isValidInstagramUsername } from '../utils/instagramParser';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: string[];
  setParticipants: (list: string[]) => void;
}

export const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  isOpen,
  onClose,
  participants,
  setParticipants
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = participants.filter((uname) =>
    uname.toLowerCase().includes(searchTerm.toLowerCase().trim().replace(/^@+/, ''))
  );

  const handleRemove = (uname: string) => {
    setParticipants(participants.filter((p) => p !== uname));
  };

  const handleAddOne = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = normalizeUsername(newUsername);
    if (!clean) return;
    if (!isValidInstagramUsername(clean)) {
      setErrorMsg("Noto'g'ri username formati");
      return;
    }
    if (participants.includes(clean)) {
      setErrorMsg("Bu akkaunt ro'yxatda allaqachon mavjud");
      return;
    }

    setParticipants([clean, ...participants]);
    setNewUsername('');
  };

  const handleCopyAll = async () => {
    try {
      const text = participants.map((p) => `@${p}`).join('\n');
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#12141f] border border-white/15 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Obunachilar ro‘yxati
              </h3>
              <p className="text-xs text-slate-400">
                Jami: <span className="text-white font-mono">{participants.length}</span> ta haqiqiy ishtirokchi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Add */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-[#0c0d14]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ro‘yxatdan qidirish (@username)..."
              className="w-full bg-[#181a28] border border-white/10 focus:border-pink-500 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          <form onSubmit={handleAddOne} className="flex gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Yangi @username qo‘shish..."
              className="flex-1 bg-[#181a28] border border-white/10 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Qo‘shish</span>
            </button>
          </form>

          {errorMsg && (
            <p className="text-xs text-red-400">{errorMsg}</p>
          )}
        </div>

        {/* List of participants */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Hech qanday akkaunt topilmadi.
            </div>
          ) : (
            filtered.map((uname, index) => (
              <div
                key={uname + index}
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] transition-colors text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-xs w-6 text-right">
                    {index + 1}.
                  </span>
                  <span className="font-mono text-slate-200">
                    @{uname}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(uname)}
                  className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#0c0d14]">
          <button
            type="button"
            onClick={handleCopyAll}
            className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nusxalandi!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-400" />
                <span>Barcha username’larni nusxalash</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

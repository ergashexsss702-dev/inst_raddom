import React from 'react';
import { History, Award, ExternalLink, Trash2 } from 'lucide-react';

export interface WinnerRecord {
  id: string;
  username: string;
  timestamp: string;
  orderNumber: number;
}

interface HistorySectionProps {
  history: WinnerRecord[];
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onClearHistory
}) => {
  if (history.length <= 1) return null;

  return (
    <section className="w-full max-w-4xl mx-auto pb-12 px-4">
      <div className="bg-[#10121a]/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Tanlov g‘oliblari tarixi ({history.length} ta)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Tarixni tozalash</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {history.map((record) => (
            <div
              key={record.id}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs">
                  {record.orderNumber}
                </span>
                <div>
                  <div className="font-mono font-bold text-white">
                    @{record.username}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {record.timestamp}
                  </div>
                </div>
              </div>
              <a
                href={`https://instagram.com/${record.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-500 hover:text-pink-400 transition-colors"
                title="Instagram profil"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

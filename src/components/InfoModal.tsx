import React from 'react';
import { X, ShieldCheck, FileSpreadsheet, Lock, HelpCircle, CheckCircle, Download } from 'lucide-react';
import { downloadSampleCsvTemplate } from '../utils/instagramParser';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#12141f] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl instagram-gradient flex items-center justify-center text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Instagram Tanlov Qo‘llanmasi va Shaffoflik
            </h3>
            <p className="text-xs text-slate-400">
              Obunachilar ro‘yxati va xolislik qoidalari
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300">
          {/* Section 1 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Lock className="w-4 h-4 text-pink-400" />
              <span>Nima uchun obunachilar CSV/TXT orqali yuklanadi?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instagram (Meta) rasmiy xavfsizlik siyosatiga ko‘ra, foydalanuvchilarning obunachilar ro‘yxatini ruxsatsiz yoki parolsiz to‘g‘ridan-to‘g‘ri tortib olish taqiqlanadi. Shuning uchun biz sizning akkauntingiz xavfsizligini 100% himoya qilamiz: hech qanday parol yoki shaxsiy kalit talab qilinmaydi.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Obunachilar yoki izohlarni qanday eksport qilish mumkin?</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0a0b10] border border-white/10">
                <span className="font-bold text-white block mb-1">1. Meta Accounts Center orqali:</span>
                <p className="text-slate-400">
                  Instagram Sozlamalari &rarr; Hisoblar markazi &rarr; Ma‘lumotlaringizni yuklab olish &rarr; «Obunachilar va kuzatuvlar» (JSON/HTML fayl).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0b10] border border-white/10">
                <span className="font-bold text-white block mb-1">2. Izohlar orqali tanlov:</span>
                <p className="text-slate-400">
                  Giveaway postingiz izohlarini Excel yoki matnli faylga nusxalang va faylni bu yerga yuklang.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0b10] border border-white/10">
                <span className="font-bold text-white block mb-1">3. To‘g‘ridan-to‘g‘ri matn:</span>
                <p className="text-slate-400">
                  Ishtirokchilar nomlarini ro‘yxat shaklida nusxalab, «Matn ko‘rinishida» oynasiga joylashtiring.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0b10] border border-white/10">
                <span className="font-bold text-white block mb-1">4. Namunaviy shablon:</span>
                <p className="text-slate-400 mb-2">
                  Biz tayyorlab qo‘ygan CSV formatini yuklab olib, o‘z akkauntlaringizni kiriting.
                </p>
                <button
                  type="button"
                  onClick={downloadSampleCsvTemplate}
                  className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV shablonni olish</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Tasodifiy tanlash adolat kafolati</span>
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              G‘olibni aniqlash uchun kompyuteringizdagi apparat darajasidagi kriptografik tasodifiy generator (<code>window.crypto.getRandomValues</code>) ishlatiladi. Natijani oldindan bilish yoki o‘zgartirish mutlaqo mumkin emas. Jonli efirda ekranni bemalol yozib olishingiz mumkin!
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};

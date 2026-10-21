import React from 'react';
import {
  Award,
  Star,
  RefreshCw,
  Printer,
  X,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { getGradeTitle } from '../game/quizEngine';
import { playClickSound } from '../utils/audio';

type LeaderboardStatus = 'idle' | 'saving' | 'saved' | 'error';

interface CertificateModalProps {
  score: number;
  stars: number;
  correctCount: number;
  totalQuestions: number;
  playerName: string;
  leaderboardStatus: LeaderboardStatus;
  leaderboardError: string;
  onRetrySubmit: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  score,
  stars,
  correctCount,
  totalQuestions,
  playerName,
  leaderboardStatus,
  leaderboardError,
  onRetrySubmit,
  onRestart,
  onClose
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const gradeTitle = getGradeTitle(stars);

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup sertifikat"
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container with Decorative Javanese Style Border */}
        <div className="border-4 border-double border-amber-600 rounded-2xl p-6 sm:p-8 bg-amber-50/40 text-center relative overflow-hidden">
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 text-amber-400 font-jawa text-2xl select-none">ꦲ</div>
          <div className="absolute top-2 right-2 text-amber-400 font-jawa text-2xl select-none">ꦏ</div>
          <div className="absolute bottom-2 left-2 text-amber-400 font-jawa text-2xl select-none">ꦢ</div>
          <div className="absolute bottom-2 right-2 text-amber-400 font-jawa text-2xl select-none">ꦔ</div>

          {/* Badge Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-lg mb-3">
            <Award className="w-9 h-9" />
          </div>

          {/* Certificate Title */}
          <h2 className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-1">
            Piagam Penghargaan & Kelulusan
          </h2>
          <h1 className="font-child text-2xl sm:text-3xl font-bold text-amber-950 tracking-tight mb-2">
            SINAU AKSARA JAWA KELAS 5 SD
          </h1>

          <p className="text-xs text-amber-700/80 mb-5">
            Diberikan sebagai bukti kelulusan petualangan membaca dan menulis Aksara Jawa.
          </p>

          {/* Student Name */}
          <div className="my-4">
            <p className="text-xs uppercase text-amber-800 font-semibold mb-1">Diberikan kepada:</p>
            <span className="font-child text-xl sm:text-2xl font-bold text-amber-900">
              {playerName}
            </span>
          </div>

          {/* Star Rating Display */}
          <div className="flex items-center justify-center gap-1.5 my-4">
            {[1, 2, 3].map((starNum) => (
              <Star
                key={starNum}
                className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform ${
                  starNum <= stars
                    ? 'fill-amber-400 text-amber-500 drop-shadow-md scale-110'
                    : 'text-amber-200 fill-amber-100'
                }`}
              />
            ))}
          </div>

          {/* Grade Title */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-200/80 border border-amber-300 text-amber-900 font-bold text-sm mb-4">
            {gradeTitle}
          </div>

          {/* Score recap details */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs sm:text-sm my-2">
            <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200">
              <span className="text-amber-700 block text-[11px]">Total Skor</span>
              <span className="font-bold text-amber-950 text-lg">
                {score}
                <span className="text-xs text-amber-700"> / 100</span>
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200">
              <span className="text-amber-700 block text-[11px]">Jawaban Benar</span>
              <span className="font-bold text-emerald-700 text-lg">{correctCount} / {totalQuestions}</span>
            </div>
          </div>

          {/* Footer Date and Signature */}
          <div className="mt-6 pt-4 border-t border-amber-300/60 flex items-center justify-between text-[11px] text-amber-800 px-4">
            <div className="text-left">
              <span>Tanggal: {currentDate}</span>
              <p className="font-semibold text-amber-950">Materi Kelas 5 SD</p>
            </div>
            <div className="text-right">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi Lulus
              </span>
              <p className="italic text-amber-700">Guru Sinau Jawa</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-semibold text-sm shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-600" /> Cetak Sertifikat
          </button>

          <button
            onClick={() => {
              playClickSound();
              onRestart();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/30 transition-all hover:scale-102"
          >
            <RefreshCw className="w-4 h-4" /> Main Lagi
          </button>
        </div>

        {/* Automatic leaderboard submission status */}
        <div
          className={`mt-4 rounded-2xl border-2 p-4 text-left text-xs ${
            leaderboardStatus === 'error'
              ? 'border-rose-300 bg-rose-50'
              : leaderboardStatus === 'saved'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-amber-300 bg-amber-50/70'
          }`}
        >
          {leaderboardStatus === 'saving' && (
            <p className="flex items-center gap-2 font-semibold text-amber-900">
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim skor ke Peringkat...
            </p>
          )}

          {leaderboardStatus === 'saved' && (
            <p className="flex items-start gap-2 font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Skor otomatis masuk ke Peringkat sebagai <strong>{playerName}</strong>.
              </span>
            </p>
          )}

          {leaderboardStatus === 'error' && (
            <div className="space-y-2">
              <p className="flex items-start gap-2 font-semibold text-rose-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Skor gagal dikirim otomatis. {leaderboardError}</span>
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  onRetrySubmit();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Kirim Lagi
              </button>
            </div>
          )}

          {leaderboardStatus === 'idle' && (
            <p className="flex items-center gap-2 font-semibold text-amber-900">
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyiapkan skor untuk Peringkat...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

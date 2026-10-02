'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Download, RotateCcw, Clock, Building2 } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onExport: () => void;
  onResetData: () => void;
  overdueCount: number;
}

export function Navbar({ onOpenAddModal, onExport, onResetData, overdueCount }: NavbarProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setTime(formatted + ' WIB');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  SIMPRES Asrama
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Tracker Kepulangan
                </span>
                {overdueCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    {overdueCount} Terlambat!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Monitoring presensi kepulangan & deteksi santri/siswa terlambat kembali
              </p>
            </div>
          </div>

          {/* Clock & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
              <span>{time || 'Memuat waktu...'}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetData}
              title="Reset ke Data Contoh Asrama"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={onExport}
              title="Ekspor laporan ke file CSV"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>

            {/* Add Record Primary Button */}
            <button
              onClick={onOpenAddModal}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Catat Izin Pulang</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import { Users, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FilterStatus } from '@/types/attendance';

interface StatsProps {
  total: number;
  outOnTime: number;
  outOverdue: number;
  returnedTotal: number;
  returnedOnTime: number;
  returnedLate: number;
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export function StatsCards({
  total,
  outOnTime,
  outOverdue,
  returnedTotal,
  returnedOnTime,
  returnedLate,
  activeFilter,
  onSelectFilter,
}: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Total Siswa Izin Pulang */}
      <div
        onClick={() => onSelectFilter('all')}
        className={`cursor-pointer p-4 rounded-xl border transition-all ${
          activeFilter === 'all'
            ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Izin
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">santri / siswa</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 truncate">Semua catatan kepulangan</p>
      </div>

      {/* 2. Sedang di Luar (Aman / Dalam Batas) */}
      <div
        onClick={() => onSelectFilter('out_all')}
        className={`cursor-pointer p-4 rounded-xl border transition-all ${
          activeFilter === 'out_all'
            ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sedang di Luar
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-amber-600">
            {outOnTime + outOverdue}
          </span>
          <span className="text-xs text-amber-700 font-medium">
            ({outOnTime} dalam batas)
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 truncate">Belum check-in kembali</p>
      </div>

      {/* 3. ⚠️ TERLAMBAT BALIK (OVERDUE) - HIGHLIGHT UTAMA */}
      <div
        onClick={() => onSelectFilter('out_overdue')}
        className={`cursor-pointer p-4 rounded-xl border transition-all relative overflow-hidden ${
          activeFilter === 'out_overdue'
            ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/30 shadow-md'
            : outOverdue > 0
            ? 'bg-rose-50/60 border-rose-300 hover:border-rose-400 hover:shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        {outOverdue > 0 && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
            <div className="absolute transform rotate-45 bg-rose-500 text-white text-[9px] font-bold py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow-xs">
              PERHATIAN
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Terlambat Balik
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">{outOverdue}</span>
          <span className="text-xs font-semibold text-rose-600">siswa lewat batas!</span>
        </div>
        <p className="mt-1 text-xs text-rose-600/90 font-medium truncate">
          {outOverdue > 0 ? 'Perlu segera dihubungi/cek' : 'Semua kembali sesuai jadwal'}
        </p>
      </div>

      {/* 4. Sudah Kembali */}
      <div
        onClick={() => onSelectFilter('returned_all')}
        className={`cursor-pointer p-4 rounded-xl border transition-all ${
          activeFilter === 'returned_all'
            ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sudah Kembali
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{returnedTotal}</span>
          <span className="text-xs text-slate-500">
            ({returnedOnTime} tepat, {returnedLate} telat)
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 truncate">Sudah berada di asrama</p>
      </div>

    </div>
  );
}


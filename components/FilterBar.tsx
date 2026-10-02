'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterStatus } from '@/types/attendance';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  dormFilter: string;
  onDormChange: (dorm: string) => void;
  sortBy: 'overdue_first' | 'expected_asc' | 'name_asc' | 'created_desc';
  onSortChange: (sort: 'overdue_first' | 'expected_asc' | 'name_asc' | 'created_desc') => void;
  dormList: string[];
  counts: {
    all: number;
    outOverdue: number;
    outAll: number;
    returnedAll: number;
    returnedLate: number;
  };
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dormFilter,
  onDormChange,
  sortBy,
  onSortChange,
  dormList,
  counts,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6 space-y-3">
      
      {/* Top row: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama santri, NIS, kamar, alasan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Gedung & Sort Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          
          {/* Dorm Filter */}
          <div className="relative flex-1 sm:flex-initial min-w-[160px]">
            <select
              value={dormFilter}
              onChange={(e) => onDormChange(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="ALL">Semua Gedung</option>
              {dormList.map((dorm) => (
                <option key={dorm} value={dorm}>
                  {dorm}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'overdue_first' | 'expected_asc' | 'name_asc' | 'created_desc')}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="overdue_first">⚡ Prioritas: Terlambat Duluan</option>
              <option value="expected_asc">🕒 Batas Waktu Terdekat</option>
              <option value="name_asc">🔤 Nama Siswa (A-Z)</option>
              <option value="created_desc">🆕 Terbaru Dicatat</option>
            </select>
          </div>

        </div>
      </div>

      {/* Bottom row: Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
        <button
          onClick={() => onStatusChange('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua ({counts.all})
        </button>

        <button
          onClick={() => onStatusChange('out_overdue')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'out_overdue'
              ? 'bg-rose-600 text-white shadow-xs font-semibold'
              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          ⚠️ Terlambat Balik ({counts.outOverdue})
        </button>

        <button
          onClick={() => onStatusChange('out_all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            statusFilter === 'out_all'
              ? 'bg-amber-600 text-white shadow-xs font-semibold'
              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          Sedang di Luar ({counts.outAll})
        </button>

        <button
          onClick={() => onStatusChange('returned_all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            statusFilter === 'returned_all'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          Sudah Kembali ({counts.returnedAll})
        </button>

        <button
          onClick={() => onStatusChange('returned_late')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            statusFilter === 'returned_late'
              ? 'bg-orange-600 text-white shadow-xs font-semibold'
              : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
          }`}
        >
          Riwayat Telat ({counts.returnedLate})
        </button>
      </div>

    </div>
  );
}

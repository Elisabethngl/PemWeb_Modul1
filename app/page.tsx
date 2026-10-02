'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsCards } from '@/components/StatsCards';
import { FilterBar } from '@/components/FilterBar';
import { AttendanceTable } from '@/components/AttendanceTable';
import { AddRecordModal } from '@/components/AddRecordModal';
import { CheckInModal } from '@/components/CheckInModal';
import { StudentDetailModal } from '@/components/StudentDetailModal';
import { AttendanceRecord, FilterStatus } from '@/types/attendance';
import { getInitialMockData } from '@/lib/mock-data';
import { exportToCSV, getRecordStatus } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'asrama_attendance_records_v1';

export default function Home() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [dormFilter, setDormFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'overdue_first' | 'expected_asc' | 'name_asc' | 'created_desc'>('overdue_first');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [checkInTarget, setCheckInTarget] = useState<AttendanceRecord | null>(null);
  const [detailTarget, setDetailTarget] = useState<AttendanceRecord | null>(null);

  // Current clock ticker to re-evaluate overdue status live
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Load from localStorage or mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setRecords(JSON.parse(saved));
        } else {
          const initial = getInitialMockData();
          setRecords(initial);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
      } catch (e) {
        console.error('Failed to load from storage', e);
        setRecords(getInitialMockData());
      } finally {
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records, isLoaded]);

  // Timer ticker every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic dorm list
  const dormList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.dormBlock));
    if (set.size === 0) {
      return ['Gedung A (Putra)', 'Gedung B (Putra)', 'Gedung C (Putri)', 'Gedung D (Putri)'];
    }
    return Array.from(set).sort();
  }, [records]);

  // Compute counts
  const counts = useMemo(() => {
    let outOverdue = 0;
    let outAll = 0;
    let outOnTime = 0;
    let returnedAll = 0;
    let returnedOnTime = 0;
    let returnedLate = 0;

    records.forEach((r) => {
      const status = getRecordStatus(r, currentTime);
      if (status === 'out_overdue') {
        outOverdue++;
        outAll++;
      } else if (status === 'out_ontime') {
        outOnTime++;
        outAll++;
      } else if (status === 'returned_ontime') {
        returnedAll++;
        returnedOnTime++;
      } else if (status === 'returned_late') {
        returnedAll++;
        returnedLate++;
      }
    });

    return {
      all: records.length,
      outOverdue,
      outAll,
      outOnTime,
      returnedAll,
      returnedOnTime,
      returnedLate,
    };
  }, [records, currentTime]);

  // Filtered & sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((item) => {
        // 1. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.studentName.toLowerCase().includes(q);
          const matchId = item.studentId.toLowerCase().includes(q);
          const matchRoom = item.roomNumber.toLowerCase().includes(q);
          const matchDorm = item.dormBlock.toLowerCase().includes(q);
          const matchReason = item.reason.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchRoom && !matchDorm && !matchReason) {
            return false;
          }
        }

        // 2. Dorm Filter
        if (dormFilter !== 'ALL' && item.dormBlock !== dormFilter) {
          return false;
        }

        // 3. Status Filter
        const status = getRecordStatus(item, currentTime);
        if (statusFilter === 'out_overdue' && status !== 'out_overdue') {
          return false;
        }
        if (statusFilter === 'out_all' && !(status === 'out_ontime' || status === 'out_overdue')) {
          return false;
        }
        if (statusFilter === 'returned_all' && !(status === 'returned_ontime' || status === 'returned_late')) {
          return false;
        }
        if (statusFilter === 'returned_late' && status !== 'returned_late') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const statusA = getRecordStatus(a, currentTime);
        const statusB = getRecordStatus(b, currentTime);

        if (sortBy === 'overdue_first') {
          // Priority 1: out_overdue
          if (statusA === 'out_overdue' && statusB !== 'out_overdue') return -1;
          if (statusB === 'out_overdue' && statusA !== 'out_overdue') return 1;

          // Priority 2: out_ontime
          if (statusA === 'out_ontime' && statusB !== 'out_ontime') return -1;
          if (statusB === 'out_ontime' && statusA !== 'out_ontime') return 1;

          // By expected return time ascending
          return new Date(a.expectedReturnTime).getTime() - new Date(b.expectedReturnTime).getTime();
        }

        if (sortBy === 'expected_asc') {
          return new Date(a.expectedReturnTime).getTime() - new Date(b.expectedReturnTime).getTime();
        }

        if (sortBy === 'name_asc') {
          return a.studentName.localeCompare(b.studentName);
        }

        if (sortBy === 'created_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return 0;
      });
  }, [records, searchQuery, dormFilter, statusFilter, sortBy, currentTime]);

  // Actions
  const handleAddRecord = (data: Omit<AttendanceRecord, 'id' | 'createdAt'>) => {
    const newRecord: AttendanceRecord = {
      ...data,
      id: `REC-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleConfirmCheckIn = (recordId: string, actualTime: string, notes?: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            actualReturnTime: actualTime,
            notes: notes !== undefined ? notes : r.notes,
          };
        }
        return r;
      })
    );
  };

  const handleCancelCheckIn = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            actualReturnTime: null,
          };
        }
        return r;
      })
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetDemo = () => {
    if (confirm('Reset semua data presensi ke data contoh simulasi awal?')) {
      const initial = getInitialMockData();
      setRecords(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  const handleExport = () => {
    exportToCSV(records);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExport={handleExport}
        onResetData={handleResetDemo}
        overdueCount={counts.outOverdue}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Banner Alert if students are overdue */}
        {counts.outOverdue > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold">
                  Perhatian: Ada {counts.outOverdue} Siswa yang Terlambat Balik ke Asrama!
                </h2>
                <p className="text-xs text-rose-100 mt-0.5">
                  Batas waktu kepulangan santri telah terlewati. Hubungi santri atau orang tua melalui tombol WhatsApp untuk konfirmasi keberadaan.
                </p>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('out_overdue')}
              className="px-4 py-2 text-xs font-bold bg-white text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-xl shadow-xs transition-colors shrink-0 text-center"
            >
              Lihat Santri Terlambat ({counts.outOverdue})
            </button>
          </div>
        )}

        {/* Top Summary Stats */}
        <StatsCards
          total={counts.all}
          outOnTime={counts.outOnTime}
          outOverdue={counts.outOverdue}
          returnedTotal={counts.returnedAll}
          returnedOnTime={counts.returnedOnTime}
          returnedLate={counts.returnedLate}
          activeFilter={statusFilter}
          onSelectFilter={(filter) => setStatusFilter(filter)}
        />

        {/* Filter, Search & Sorting Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dormFilter={dormFilter}
          onDormChange={setDormFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          dormList={dormList}
          counts={counts}
        />

        {/* Main Attendance Table */}
        <AttendanceTable
          records={filteredRecords}
          onCheckIn={(record) => setCheckInTarget(record)}
          onViewDetails={(record) => setDetailTarget(record)}
          onCancelCheckIn={handleCancelCheckIn}
        />

      </main>

      {/* Modals */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRecord}
      />

      <CheckInModal
        isOpen={Boolean(checkInTarget)}
        onClose={() => setCheckInTarget(null)}
        record={checkInTarget}
        onConfirmCheckIn={handleConfirmCheckIn}
      />

      <StudentDetailModal
        isOpen={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        record={detailTarget}
        onCheckIn={(record) => setCheckInTarget(record)}
        onDelete={handleDeleteRecord}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">SIMPRES Asrama - Sistem Presensi Kepulangan & Kedatangan Asrama</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Dibuat untuk mempermudah pamong, musyrif, dan pengurus asrama dalam memantau santri/siswa yang pulang terlambat balik.
        </p>
      </footer>

    </div>
  );
}


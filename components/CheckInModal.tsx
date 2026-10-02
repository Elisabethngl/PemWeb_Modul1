'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { AttendanceRecord } from '@/types/attendance';
import { formatDateTime, getDelayDuration, toInputDateTime } from '@/lib/utils';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onConfirmCheckIn: (recordId: string, actualTime: string, notes?: string) => void;
}

function CheckInForm({
  record,
  onClose,
  onConfirmCheckIn,
}: {
  record: AttendanceRecord;
  onClose: () => void;
  onConfirmCheckIn: (recordId: string, actualTime: string, notes?: string) => void;
}) {
  const [actualTime, setActualTime] = useState<string>(() => toInputDateTime(new Date()));
  const [lateReason, setLateReason] = useState<string>(record.notes || '');

  const actualDate = actualTime ? new Date(actualTime) : new Date();
  const delayInfo = getDelayDuration(record.expectedReturnTime, actualDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCheckIn(record.id, actualTime, lateReason.trim() || undefined);
    onClose();
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold">Konfirmasi Kedatangan Siswa</h2>
            <p className="text-xs text-slate-400">Presensi kembali ke lingkungan asrama</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        
        {/* Student Info Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{record.studentName}</h3>
              <p className="text-xs text-slate-500">NIS: {record.studentId} • {record.dormBlock} ({record.roomNumber})</p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
              {record.reason}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Batas Waktu Kembali:
            </span>
            <span className="font-semibold text-slate-800">{formatDateTime(record.expectedReturnTime)}</span>
          </div>
        </div>

        {/* Actual Arrival Time Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Waktu Realisasi Kedatangan (Check-In) <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={actualTime}
            onChange={(e) => setActualTime(e.target.value)}
            className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Otomatis terisi waktu saat ini, sesuaikan jika perlu.</p>
        </div>

        {/* Status Detection Banner */}
        {delayInfo.isLate ? (
          <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-800">
                TERLAMBAT BALIK KE ASRAMA
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Siswa terlambat selama <strong>{delayInfo.text}</strong> dari batas waktu yang ditetapkan.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Kembali Tepat Waktu</span>
              <p className="text-[11px] text-emerald-700">Tiba sebelum batas waktu kembali.</p>
            </div>
          </div>
        )}

        {/* Reason / Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {delayInfo.isLate ? 'Alasan Keterlambatan (Wajib dicatat)' : 'Catatan Kedatangan (Opsional)'}
          </label>
          <textarea
            rows={2}
            required={delayInfo.isLate}
            placeholder={delayInfo.isLate ? 'Contoh: Terjebak macet arus balik, bus mogok di tol...' : 'Contoh: Kondisi sehat, langsung menuju kamar'}
            value={lateReason}
            onChange={(e) => setLateReason(e.target.value)}
            className={`w-full text-xs sm:text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              delayInfo.isLate
                ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                : 'border-slate-300 focus:ring-blue-500 bg-white'
            }`}
          ></textarea>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className={`px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
              delayInfo.isLate
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Check-In</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export function CheckInModal({ isOpen, onClose, record, onConfirmCheckIn }: CheckInModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <CheckInForm
        key={record.id}
        record={record}
        onClose={onClose}
        onConfirmCheckIn={onConfirmCheckIn}
      />
    </div>
  );
}


'use client';

import React from 'react';
import { X, Phone, Clock, AlertTriangle, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import { AttendanceRecord } from '@/types/attendance';
import { formatDateTime, getDelayDuration, getRecordStatus, generateWhatsAppLink } from '@/lib/utils';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onCheckIn: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
}

export function StudentDetailModal({
  isOpen,
  onClose,
  record,
  onCheckIn,
  onDelete,
}: StudentDetailModalProps) {
  if (!isOpen || !record) return null;

  const now = new Date();
  const status = getRecordStatus(record, now);
  const isOverdue = status === 'out_overdue';
  const isReturnedLate = status === 'returned_late';
  const isReturnedOntime = status === 'returned_ontime';
  const isOutOntime = status === 'out_ontime';

  let delayNotice: { isLate: boolean; text: string } | null = null;
  if (isOverdue) {
    delayNotice = getDelayDuration(record.expectedReturnTime, now);
  } else if (isReturnedLate && record.actualReturnTime) {
    delayNotice = getDelayDuration(record.expectedReturnTime, record.actualReturnTime);
  }

  const studentWaLink = generateWhatsAppLink(
    record.phoneNumber,
    record.studentName,
    record.expectedReturnTime,
    record.dormBlock
  );

  const parentWaLink = record.parentPhone
    ? generateWhatsAppLink(
        record.parentPhone,
        `${record.studentName} (Putra/Putri Bapak/Ibu)`,
        record.expectedReturnTime,
        record.dormBlock
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Detail Presensi Kepulangan
            </span>
            <h2 className="text-lg font-bold">{record.studentName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Status banner */}
          {isOverdue && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  STATUS: TERLAMBAT BALIK (MASIH DI LUAR)
                </span>
                <p className="text-xs text-rose-700 mt-0.5">
                  Santri telah melewati batas waktu kepulangan selama{' '}
                  <strong className="font-bold underline">{delayNotice?.text}</strong>. Segera hubungi santri atau orang tua.
                </p>
              </div>
            </div>
          )}

          {isOutOntime && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Sedang izin di luar. Masih dalam batas waktu kepulangan.
              </span>
            </div>
          )}

          {isReturnedOntime && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Sudah kembali ke asrama dengan <strong>Tepat Waktu</strong> ({formatDateTime(record.actualReturnTime)}).
              </span>
            </div>
          )}

          {isReturnedLate && (
            <div className="p-3.5 bg-orange-50 border border-orange-300 rounded-xl flex items-start gap-3 text-xs text-orange-900">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sudah Kembali (Tercatat Terlambat)</span>
                <p className="text-orange-800 mt-0.5">
                  Tiba pada {formatDateTime(record.actualReturnTime)} (Terlambat {delayNotice?.text}).
                </p>
              </div>
            </div>
          )}

          {/* Identity Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Nomor Induk (NIS/NIM)</span>
              <span className="font-semibold text-slate-800">{record.studentId}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Jenis Kelamin</span>
              <span className="font-semibold text-slate-800">
                {record.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Gedung / Asrama</span>
              <span className="font-semibold text-slate-800">{record.dormBlock}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Nomor Kamar</span>
              <span className="font-semibold text-slate-800">{record.roomNumber}</span>
            </div>
          </div>

          {/* Timeline details */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Jadwal Waktu Kepulangan
            </h4>
            
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              
              {/* Departure */}
              <div className="relative">
                <span className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-xs"></span>
                <span className="text-[11px] text-slate-400 block">Waktu Keberangkatan / Izin Keluar</span>
                <span className="text-xs font-semibold text-slate-800">
                  {formatDateTime(record.departureTime)}
                </span>
              </div>

              {/* Deadline */}
              <div className="relative">
                <span className={`absolute -left-[23px] top-0.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                  isOverdue ? 'bg-rose-500 ring-2 ring-rose-300' : 'bg-amber-500'
                }`}></span>
                <span className="text-[11px] text-slate-400 block">Batas Waktu Wajib Kembali (Curfew)</span>
                <span className={`text-xs font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                  {formatDateTime(record.expectedReturnTime)}
                </span>
              </div>

              {/* Actual return */}
              <div className="relative">
                <span className={`absolute -left-[23px] top-0.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                  record.actualReturnTime ? (isReturnedLate ? 'bg-orange-500' : 'bg-emerald-500') : 'bg-slate-300'
                }`}></span>
                <span className="text-[11px] text-slate-400 block">Realisasi Kedatangan di Asrama</span>
                <span className="text-xs font-semibold text-slate-800">
                  {record.actualReturnTime ? formatDateTime(record.actualReturnTime) : 'Belum Check-In'}
                </span>
              </div>

            </div>
          </div>

          {/* Reason & Notes */}
          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <div>
              <span className="text-slate-400 block">Alasan / Keperluan:</span>
              <p className="font-medium text-slate-800 mt-0.5">{record.reason}</p>
            </div>
            {record.notes && (
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                <span className="text-amber-800 font-semibold block mb-0.5">Catatan / Alasan Terlambat:</span>
                <p className="text-amber-900">{record.notes}</p>
              </div>
            )}
          </div>

          {/* Kontak & Tindakan Cepat WhatsApp */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Hubungi Santri / Wali (WhatsApp 1-Klik)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={studentWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Siswa ({record.phoneNumber})</span>
              </a>

              {parentWaLink ? (
                <a
                  href={parentWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Orang Tua ({record.parentPhone})</span>
                </a>
              ) : (
                <div className="flex items-center justify-center px-3 py-2 text-xs text-slate-400 bg-slate-100 rounded-lg border border-dashed border-slate-200">
                  No HP Ortu Belum Diisi
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm(`Yakin ingin menghapus catatan izin ${record.studentName}?`)) {
                  onDelete(record.id);
                  onClose();
                }
              }}
              className="p-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Data</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Tutup
              </button>

              {!record.actualReturnTime && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCheckIn(record);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Balik (Check-In)</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

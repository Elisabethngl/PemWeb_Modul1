'use client';

import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Eye, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { AttendanceRecord } from '@/types/attendance';
import { 
  formatDateTime, 
  formatTimeOnly, 
  getDelayDuration, 
  getRecordStatus, 
  generateWhatsAppLink 
} from '@/lib/utils';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onCheckIn: (record: AttendanceRecord) => void;
  onViewDetails: (record: AttendanceRecord) => void;
  onCancelCheckIn: (recordId: string) => void;
}

export function AttendanceTable({
  records,
  onCheckIn,
  onViewDetails,
  onCancelCheckIn,
}: AttendanceTableProps) {
  const now = new Date();

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Tidak ada data presensi</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tidak ada data santri yang cocok dengan filter atau kata kunci pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Desktop / Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Santri / Siswa</th>
              <th className="py-3.5 px-4">Kamar & Gedung</th>
              <th className="py-3.5 px-4">Waktu Izin & Batas Kembali</th>
              <th className="py-3.5 px-4">Status & Keterlambatan</th>
              <th className="py-3.5 px-4">Alasan & Catatan</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {records.map((record) => {
              const status = getRecordStatus(record, now);
              const isOverdue = status === 'out_overdue';
              const isOutOntime = status === 'out_ontime';
              const isReturnedLate = status === 'returned_late';
              const isReturnedOntime = status === 'returned_ontime';

              const waLink = generateWhatsAppLink(
                record.phoneNumber,
                record.studentName,
                record.expectedReturnTime,
                record.dormBlock
              );

              // Delay calculations
              let delay = null;
              if (isOverdue) {
                delay = getDelayDuration(record.expectedReturnTime, now);
              } else if (isReturnedLate && record.actualReturnTime) {
                delay = getDelayDuration(record.expectedReturnTime, record.actualReturnTime);
              } else if (isOutOntime) {
                delay = getDelayDuration(record.expectedReturnTime, now);
              }

              return (
                <tr
                  key={record.id}
                  className={`transition-colors hover:bg-slate-50/70 ${
                    isOverdue ? 'bg-rose-50/40' : ''
                  }`}
                >
                  {/* Siswa */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          record.gender === 'L'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {record.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onViewDetails(record)}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {record.studentName}
                          </button>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              record.gender === 'L'
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-pink-50 text-pink-600 border border-pink-200'
                            }`}
                          >
                            {record.gender === 'L' ? 'L' : 'P'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          NIS: {record.studentId} • {record.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kamar & Gedung */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 text-xs">{record.roomNumber}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{record.dormBlock}</div>
                  </td>

                  {/* Waktu Berangkat & Batas Kembali */}
                  <td className="py-3.5 px-4">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">Batas Wajib Kembali:</span>
                      <span className={`font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        {formatDateTime(record.expectedReturnTime)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Keluar: {formatTimeOnly(record.departureTime)} ({new Date(record.departureTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
                    </div>
                  </td>

                  {/* Status & Keterlambatan */}
                  <td className="py-3.5 px-4">
                    {/* 1. Belum Balik & Terlambat */}
                    {isOverdue && (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          LEWAT BATAS WAKTU!
                        </span>
                        <div className="text-[11px] font-semibold text-rose-600">
                          Terlambat: {delay?.text}
                        </div>
                      </div>
                    )}

                    {/* 2. Sedang di luar (Dalam batas) */}
                    {isOutOntime && (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Sedang Izin Keluar
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Sisa waktu: {delay?.text}
                        </div>
                      </div>
                    )}

                    {/* 3. Sudah Kembali Tepat Waktu */}
                    {isReturnedOntime && (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Kembali Tepat Waktu
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Tiba: {formatTimeOnly(record.actualReturnTime)}
                        </div>
                      </div>
                    )}

                    {/* 4. Sudah Kembali Tapi Terlambat */}
                    {isReturnedLate && (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                          Kembali (Terlambat)
                        </span>
                        <div className="text-[11px] text-orange-700 font-medium">
                          Telat: {delay?.text}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Alasan & Catatan */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-slate-700 font-medium line-clamp-1">
                      {record.reason}
                    </p>
                    {record.notes && (
                      <p className="text-[11px] text-amber-700 line-clamp-1 italic mt-0.5">
                        &ldquo;{record.notes}&rdquo;
                      </p>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* WhatsApp Button (Especially for overdue) */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Hubungi Siswa via WhatsApp"
                        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          isOverdue
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-2'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {isOverdue && <span className="text-[11px] font-semibold">WA</span>}
                      </a>

                      {/* Check-In Button (If student hasn't returned yet) */}
                      {!record.actualReturnTime ? (
                        <button
                          onClick={() => onCheckIn(record)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Sudah Balik</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (confirm(`Batalkan status kepulangan ${record.studentName}?`)) {
                              onCancelCheckIn(record.id);
                            }
                          }}
                          title="Batalkan status kedatangan"
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* View Details Button */}
                      <button
                        onClick={() => onViewDetails(record)}
                        title="Lihat detail lengkap"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, User, Clock, AlertCircle } from 'lucide-react';
import { AttendanceRecord } from '@/types/attendance';
import { toInputDateTime } from '@/lib/utils';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => void;
}

export function AddRecordModal({ isOpen, onClose, onAdd }: AddRecordModalProps) {
  const now = new Date();
  
  // Default expected return: today at 21:00 or tomorrow at 17:00
  const defaultDeparture = toInputDateTime(now);
  const tomorrowAfternoon = new Date(now);
  tomorrowAfternoon.setDate(tomorrowAfternoon.getDate() + 1);
  tomorrowAfternoon.setHours(17, 0, 0, 0);
  const defaultExpected = toInputDateTime(tomorrowAfternoon);

  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [dormBlock, setDormBlock] = useState('Gedung A (Putra)');
  const [roomNumber, setRoomNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [departureTime, setDepartureTime] = useState(defaultDeparture);
  const [expectedReturnTime, setExpectedReturnTime] = useState(defaultExpected);
  const [reason, setReason] = useState('Pulang mingguan ke rumah keluarga');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Preset deadline helpers
  const applyPreset = (type: 'today_21' | 'tomorrow_17' | 'sunday_17' | 'plus_2days') => {
    const base = new Date();
    if (type === 'today_21') {
      base.setHours(21, 0, 0, 0);
    } else if (type === 'tomorrow_17') {
      base.setDate(base.getDate() + 1);
      base.setHours(17, 0, 0, 0);
    } else if (type === 'sunday_17') {
      const day = base.getDay(); // 0 is Sunday
      const daysUntilSunday = (7 - day) % 7 || 7;
      base.setDate(base.getDate() + daysUntilSunday);
      base.setHours(17, 0, 0, 0);
    } else if (type === 'plus_2days') {
      base.setDate(base.getDate() + 2);
      base.setHours(17, 0, 0, 0);
    }
    setExpectedReturnTime(toInputDateTime(base));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('Nama siswa wajib diisi');
      return;
    }
    if (!roomNumber.trim()) {
      setError('Nomor kamar wajib diisi');
      return;
    }
    if (!departureTime || !expectedReturnTime) {
      setError('Waktu berangkat dan batas waktu kembali wajib diisi');
      return;
    }

    if (new Date(expectedReturnTime) <= new Date(departureTime)) {
      setError('Batas waktu kembali harus setelah waktu keberangkatan');
      return;
    }

    onAdd({
      studentName: studentName.trim(),
      studentId: studentId.trim() || `NIS-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      dormBlock,
      roomNumber: roomNumber.trim(),
      phoneNumber: phoneNumber.trim() || '08123456789',
      parentPhone: parentPhone.trim() || undefined,
      departureTime,
      expectedReturnTime,
      actualReturnTime: null,
      reason,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Catat Izin Kepulangan Santri/Siswa</h2>
            <p className="text-xs text-blue-100">
              Formulir pencatatan presensi kepulangan dan penetapan batas waktu kembali
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Identitas Siswa */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Data Identitas Siswa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Raihan"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setError('');
                  }}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIS / NIM
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 20241089"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Gender & Dorm Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin
                </label>
                <div className="flex gap-2">
                  <label className={`flex-1 text-center py-2 px-3 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                    gender === 'L' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="gender"
                      value="L"
                      checked={gender === 'L'}
                      onChange={() => {
                        setGender('L');
                        setDormBlock('Gedung A (Putra)');
                      }}
                      className="hidden"
                    />
                    Laki-laki
                  </label>
                  <label className={`flex-1 text-center py-2 px-3 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                    gender === 'P' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="gender"
                      value="P"
                      checked={gender === 'P'}
                      onChange={() => {
                        setGender('P');
                        setDormBlock('Gedung C (Putri)');
                      }}
                      className="hidden"
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gedung / Asrama
                </label>
                <select
                  value={dormBlock}
                  onChange={(e) => setDormBlock(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Gedung A (Putra)">Gedung A (Putra)</option>
                  <option value="Gedung B (Putra)">Gedung B (Putra)</option>
                  <option value="Gedung C (Putri)">Gedung C (Putri)</option>
                  <option value="Gedung D (Putri)">Gedung D (Putri)</option>
                  <option value="Asrama Tahfidz">Asrama Tahfidz</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Kamar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kamar 204"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Kontak WA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. WhatsApp Siswa
                </label>
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. WhatsApp Orang Tua / Wali
                </label>
                <input
                  type="tel"
                  placeholder="081398765432"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Waktu & Batas Kepulangan */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Waktu Izin & Batas Kembali (Curfew)
            </h3>

            {/* Quick presets for Curfew */}
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Batas Waktu Cepat:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => applyPreset('today_21')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-700 font-medium transition-colors"
                >
                  Malam Ini 21:00
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('tomorrow_17')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-700 font-medium transition-colors"
                >
                  Besok Sore 17:00
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('sunday_17')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-700 font-medium transition-colors"
                >
                  Hari Minggu 17:00
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('plus_2days')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-700 font-medium transition-colors"
                >
                  +2 Hari (17:00)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waktu Keberangkatan / Keluar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batas Waktu Wajib Kembali <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={expectedReturnTime}
                  onChange={(e) => setExpectedReturnTime(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-amber-50/50 border border-amber-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section: Alasan & Catatan */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan / Keperluan Izin
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Pulang mingguan ke rumah keluarga">Pulang mingguan ke rumah keluarga</option>
                <option value="Izin berobat / kontrol medis RS">Izin berobat / kontrol medis RS</option>
                <option value="Acara keluarga penting / duka / nikahan">Acara keluarga penting / duka / nikahan</option>
                <option value="Keperluan akademik / tugas / lomba kampus">Keperluan akademik / tugas / lomba kampus</option>
                <option value="Keperluan mendesak lainnya">Keperluan mendesak lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Sudah melapor ke pamong asrama / surat izin dari wali santri"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 transition-all"
            >
              Simpan Data Izin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

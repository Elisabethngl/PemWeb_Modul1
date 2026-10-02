export type ReturnStatus = 'out_ontime' | 'out_overdue' | 'returned_ontime' | 'returned_late';

export interface AttendanceRecord {
  id: string;
  studentName: string;
  studentId: string; // NIS / NIM
  gender: 'L' | 'P'; // Laki-laki / Perempuan
  dormBlock: string; // Gedung / Asrama (e.g. Asrama Putra A, Asrama Putri B)
  roomNumber: string; // Nomor Kamar
  phoneNumber: string; // No WhatsApp Siswa
  parentPhone?: string; // No WhatsApp Ortu / Wali
  departureTime: string; // ISO string / YYYY-MM-DDTHH:mm
  expectedReturnTime: string; // Batas Waktu Kembali (ISO / YYYY-MM-DDTHH:mm)
  actualReturnTime?: string | null; // Waktu Realisasi Kembali (ISO / YYYY-MM-DDTHH:mm)
  reason: string; // Alasan Kepulangan
  notes?: string; // Catatan tambahan / Alasan jika terlambat
  createdAt: string;
}

export type FilterStatus = 'all' | 'out_all' | 'out_overdue' | 'returned_all' | 'returned_late';


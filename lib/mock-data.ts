import { AttendanceRecord } from '@/types/attendance';

export function getInitialMockData(): AttendanceRecord[] {
  const now = new Date();

  // Helper to format ISO
  const isoOffset = (hoursOffset: number): string => {
    const d = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
    return d.toISOString();
  };

  return [
    {
      id: 'REC-001',
      studentName: 'Ahmad Fauzan',
      studentId: '20241001',
      gender: 'L',
      dormBlock: 'Gedung A (Putra)',
      roomNumber: 'Kamar 102',
      phoneNumber: '081234567890',
      parentPhone: '081298765432',
      departureTime: isoOffset(-28), // Berangkat kemarin siang
      expectedReturnTime: isoOffset(-4), // Batas kembali 4 jam yang lalu (OVERDUE / TERLAMBAT!)
      actualReturnTime: null,
      reason: 'Pulang mingguan ke rumah keluarga',
      notes: 'Belum ada kabar saat dihubungi jam 18:00',
      createdAt: isoOffset(-28),
    },
    {
      id: 'REC-002',
      studentName: 'Siti Nurhaliza',
      studentId: '20241045',
      gender: 'P',
      dormBlock: 'Gedung C (Putri)',
      roomNumber: 'Kamar 205',
      phoneNumber: '082155667788',
      parentPhone: '082199887766',
      departureTime: isoOffset(-48),
      expectedReturnTime: isoOffset(-2), // Batas kembali 2 jam yang lalu (OVERDUE / TERLAMBAT!)
      actualReturnTime: null,
      reason: 'Izin menghadiri pernikahan saudara kandung',
      notes: 'Konfirmasi WA: bus mogok di tol',
      createdAt: isoOffset(-48),
    },
    {
      id: 'REC-003',
      studentName: 'Budi Santoso',
      studentId: '20241012',
      gender: 'L',
      dormBlock: 'Gedung B (Putra)',
      roomNumber: 'Kamar 301',
      phoneNumber: '085711223344',
      parentPhone: '085799001122',
      departureTime: isoOffset(-8),
      expectedReturnTime: isoOffset(4), // Batas kembali 4 jam ke depan (SEDANG DI LUAR - AMAN)
      actualReturnTime: null,
      reason: 'Izin kontrol dokter ke RS Kota',
      notes: 'Membawa surat rujukan dokter',
      createdAt: isoOffset(-8),
    },
    {
      id: 'REC-004',
      studentName: 'Clara Anindya',
      studentId: '20241088',
      gender: 'P',
      dormBlock: 'Gedung D (Putri)',
      roomNumber: 'Kamar 110',
      phoneNumber: '087812344321',
      parentPhone: '087855443322',
      departureTime: isoOffset(-12),
      expectedReturnTime: isoOffset(6), // Batas kembali 6 jam ke depan (SEDANG DI LUAR - AMAN)
      actualReturnTime: null,
      reason: 'Keperluan perlombaan sains kampus',
      notes: 'Didampingi pembimbing lomba',
      createdAt: isoOffset(-12),
    },
    {
      id: 'REC-005',
      studentName: 'Rian Pratama',
      studentId: '20241030',
      gender: 'L',
      dormBlock: 'Gedung A (Putra)',
      roomNumber: 'Kamar 204',
      phoneNumber: '081399881122',
      parentPhone: '081377665544',
      departureTime: isoOffset(-52),
      expectedReturnTime: isoOffset(-6),
      actualReturnTime: isoOffset(-3), // Kembali 3 jam setelah batas (SUDAH KEMBALI TAPI TERLAMBAT)
      reason: 'Libur akhir pekan keluarga di Bandung',
      notes: 'Terlambat 3 jam karena antrean tiket kereta penuh',
      createdAt: isoOffset(-52),
    },
    {
      id: 'REC-006',
      studentName: 'Dewi Lestari',
      studentId: '20241062',
      gender: 'P',
      dormBlock: 'Gedung C (Putri)',
      roomNumber: 'Kamar 304',
      phoneNumber: '089611229988',
      parentPhone: '089655441122',
      departureTime: isoOffset(-30),
      expectedReturnTime: isoOffset(-5),
      actualReturnTime: isoOffset(-6), // Kembali 1 jam sebelum batas (SUDAH KEMBALI TEPAT WAKTU)
      reason: 'Izin mengambil berkas beasiswa di rumah',
      notes: 'Tepat waktu, lapor ke pos sekuriti',
      createdAt: isoOffset(-30),
    },
    {
      id: 'REC-007',
      studentName: 'Dimas Anggoro',
      studentId: '20241019',
      gender: 'L',
      dormBlock: 'Gedung B (Putra)',
      roomNumber: 'Kamar 105',
      phoneNumber: '082233445566',
      parentPhone: '082266778899',
      departureTime: isoOffset(-26),
      expectedReturnTime: isoOffset(-8),
      actualReturnTime: isoOffset(-8), // Pas tepat waktu
      reason: 'Menjenguk nenek sakit',
      notes: 'Lapor tepat jam kembali',
      createdAt: isoOffset(-26),
    },
  ];
}


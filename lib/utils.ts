import { AttendanceRecord, ReturnStatus } from '@/types/attendance';

export function getRecordStatus(record: AttendanceRecord, currentTime: Date = new Date()): ReturnStatus {
  if (record.actualReturnTime) {
    const actual = new Date(record.actualReturnTime);
    const expected = new Date(record.expectedReturnTime);
    return actual > expected ? 'returned_late' : 'returned_ontime';
  } else {
    const expected = new Date(record.expectedReturnTime);
    return currentTime > expected ? 'out_overdue' : 'out_ontime';
  }
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d) + ' WIB';
}

export function formatTimeOnly(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d) + ' WIB';
}

export function toInputDateTime(d: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getDelayDuration(targetTime: string, compareTime: string | Date): { isLate: boolean; text: string; totalMinutes: number } {
  const target = new Date(targetTime).getTime();
  const compare = typeof compareTime === 'string' ? new Date(compareTime).getTime() : compareTime.getTime();

  const diffMs = compare - target;
  const isLate = diffMs > 0;
  const absDiff = Math.abs(diffMs);

  const diffMinutes = Math.floor(absDiff / (1000 * 60));
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  let text = '';
  if (days > 0) {
    text += `${days} hari `;
  }
  if (hours > 0 || days > 0) {
    text += `${hours} jam `;
  }
  text += `${minutes} mnt`;

  return {
    isLate,
    text: text.trim(),
    totalMinutes: diffMinutes,
  };
}

export function generateWhatsAppLink(
  phone: string,
  studentName: string,
  expectedReturnTime: string,
  dormBlock: string
): string {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }

  const expectedStr = formatDateTime(expectedReturnTime);
  const message = encodeURIComponent(
    `Halo ${studentName} (${dormBlock}),\n\nKami dari Pengurus/Pembina Asrama menginformasikan bahwa batas waktu kepulangan asrama Anda adalah ${expectedStr}.\n\nHingga saat ini status Anda tercatat BELUM KEMBALI ke asrama. Mohon segera konfirmasi keberadaan Anda dan estimasi waktu ketibaan di asrama.\n\nTerima kasih atas kerjasamanya.`
  );

  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export function exportToCSV(records: AttendanceRecord[], filename = 'presensi_kepulangan_asrama.csv') {
  const headers = [
    'ID',
    'Nama Siswa',
    'NIS/NIM',
    'Gender',
    'Gedung/Asrama',
    'Kamar',
    'No HP Siswa',
    'No HP Wali',
    'Waktu Keluar',
    'Batas Waktu Kembali',
    'Waktu Kembali Aktual',
    'Status',
    'Keterlambatan',
    'Alasan Izin',
    'Catatan',
  ];

  const now = new Date();
  const rows = records.map((r) => {
    const status = getRecordStatus(r, now);
    let statusText = '';
    let lateText = '-';

    if (status === 'out_overdue') {
      statusText = 'Belum Balik (TERLAMBAT)';
      const delay = getDelayDuration(r.expectedReturnTime, now);
      lateText = `Terlambat ${delay.text}`;
    } else if (status === 'out_ontime') {
      statusText = 'Sedang Izin Keluar (Dalam Batas)';
    } else if (status === 'returned_late') {
      statusText = 'Sudah Balik (TERLAMBAT)';
      if (r.actualReturnTime) {
        const delay = getDelayDuration(r.expectedReturnTime, r.actualReturnTime);
        lateText = `Terlambat ${delay.text}`;
      }
    } else {
      statusText = 'Sudah Balik (Tepat Waktu)';
    }

    return [
      `"${r.id}"`,
      `"${r.studentName}"`,
      `"${r.studentId}"`,
      `"${r.gender === 'L' ? 'Laki-laki' : 'Perempuan'}"`,
      `"${r.dormBlock}"`,
      `"${r.roomNumber}"`,
      `"${r.phoneNumber}"`,
      `"${r.parentPhone || '-'}"`,
      `"${formatDateTime(r.departureTime)}"`,
      `"${formatDateTime(r.expectedReturnTime)}"`,
      `"${formatDateTime(r.actualReturnTime)}"`,
      `"${statusText}"`,
      `"${lateText}"`,
      `"${r.reason}"`,
      `"${r.notes || '-'}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


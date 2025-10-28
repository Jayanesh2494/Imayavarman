export interface Attendance {
  _id: string;
  studentId: {
    _id: string;
    name: string;
  };
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late';
  method: 'face_recognition' | 'manual';
}

export interface AttendanceStats {
  presentToday: number;
  totalStudents: number;
  attendanceRate: string;
}

export interface MarkAttendanceResponse {
  message: string;
  attendance: Attendance;
  confidence?: number;
}

export type DeviceStatus =
  | 'Tốt'
  | 'Hỏng nhẹ'
  | 'Đang bảo trì'
  | 'Đang được mượn';

export type RequestStatus =
  | 'Chờ duyệt'
  | 'Đã duyệt'
  | 'Bị từ chối'
  | 'Đã trả'
  | 'Quá hạn';

export interface StudentUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'student';
}

export interface Device {
  id: string;
  name: string;
  category: string;
  condition: DeviceStatus;
  totalQuantity: number;
  availableQuantity: number;
  description: string;
}

export interface BorrowRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  deviceId: string;
  deviceName: string;
  quantity: number;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  reason: string;
  status: RequestStatus;
  rejectReason?: string;
  createdAt: string;
}

export interface StudentNotification {
  id: string;
  studentId: string;
  title: string;
  content: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRead: boolean;
  createdAt: string;
}
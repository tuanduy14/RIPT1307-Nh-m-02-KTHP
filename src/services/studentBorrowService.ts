import { BorrowRequest, Device, StudentNotification, StudentUser } from '@/types/studentBorrow';
import { getLocalData, setLocalData, removeLocalData } from '@/utils/storage';

const DEVICE_KEY = 'student_devices';
const REQUEST_KEY = 'student_borrow_requests';
const NOTIFICATION_KEY = 'student_notifications';
const USER_KEY = 'student_user';
const TOKEN_KEY = 'student_token';

const mockDevices: Device[] = [
	{
		id: 'TB001',
		name: 'Máy chiếu Epson',
		category: 'Trình chiếu',
		condition: 'Tốt',
		totalQuantity: 3,
		availableQuantity: 2,
		description: 'Máy chiếu dùng cho thuyết trình, hội thảo và sự kiện.',
	},
	{
		id: 'TB002',
		name: 'Micro không dây',
		category: 'Âm thanh',
		condition: 'Tốt',
		totalQuantity: 8,
		availableQuantity: 5,
		description: 'Micro không dây dùng cho chương trình, sự kiện.',
	},
	{
		id: 'TB003',
		name: 'Loa Bluetooth JBL',
		category: 'Âm thanh',
		condition: 'Đang được mượn',
		totalQuantity: 4,
		availableQuantity: 0,
		description: 'Loa di động phục vụ sinh hoạt câu lạc bộ.',
	},
	{
		id: 'TB004',
		name: 'Bộ dây HDMI',
		category: 'Phụ kiện',
		condition: 'Hỏng nhẹ',
		totalQuantity: 10,
		availableQuantity: 4,
		description: 'Dây HDMI dùng kết nối laptop với máy chiếu.',
	},
	{
		id: 'TB005',
		name: 'Bàn gấp sự kiện',
		category: 'Dụng cụ sự kiện',
		condition: 'Tốt',
		totalQuantity: 12,
		availableQuantity: 7,
		description: 'Bàn gấp dùng cho gian hàng, check-in hoặc hậu cần.',
	},
];

const mockNotifications: StudentNotification[] = [
	{
		id: 'NTF001',
		studentId: 'SV001',
		title: 'Chào mừng bạn đến với hệ thống',
		content: 'Bạn có thể xem thiết bị, gửi yêu cầu mượn và theo dõi lịch sử mượn tại đây.',
		type: 'info',
		isRead: false,
		createdAt: new Date().toISOString(),
	},
];

export function initStudentData(): void {
	const devices = localStorage.getItem(DEVICE_KEY);
	const notifications = localStorage.getItem(NOTIFICATION_KEY);

	if (!devices) {
		setLocalData<Device[]>(DEVICE_KEY, mockDevices);
	}

	if (!notifications) {
		setLocalData<StudentNotification[]>(NOTIFICATION_KEY, mockNotifications);
	}
}

export function loginStudent(email: string, password: string): StudentUser {
	const user: StudentUser = {
		id: 'SV001',
		fullName: 'Nguyễn Văn A',
		email,
		phone: '0123456789',
		role: 'student',
	};

	setLocalData<StudentUser>(USER_KEY, user);
	localStorage.setItem(TOKEN_KEY, password || 'mock-token');

	return user;
}

export function logoutStudent(): void {
	removeLocalData(USER_KEY);
	removeLocalData(TOKEN_KEY);
}

export function getCurrentStudent(): StudentUser | null {
	return getLocalData<StudentUser | null>(USER_KEY, null);
}

export function getDevices(): Device[] {
	initStudentData();

	return getLocalData<Device[]>(DEVICE_KEY, mockDevices);
}

export function saveDevices(devices: Device[]): void {
	setLocalData<Device[]>(DEVICE_KEY, devices);
}

export function getBorrowRequests(): BorrowRequest[] {
	return getLocalData<BorrowRequest[]>(REQUEST_KEY, []);
}

export function saveBorrowRequests(requests: BorrowRequest[]): void {
	setLocalData<BorrowRequest[]>(REQUEST_KEY, requests);
}

export function createBorrowRequest(request: BorrowRequest): BorrowRequest {
	const requests = getBorrowRequests();

	const newRequests = [request, ...requests];

	saveBorrowRequests(newRequests);

	createNotification({
		id: `NTF${Date.now()}`,
		studentId: request.studentId,
		title: 'Gửi yêu cầu mượn thành công',
		content: `Yêu cầu mượn ${request.deviceName} của bạn đã được gửi và đang chờ quản trị viên duyệt.`,
		type: 'success',
		isRead: false,
		createdAt: new Date().toISOString(),
	});

	return request;
}

export function getStudentBorrowHistory(studentId: string): BorrowRequest[] {
	const requests = getBorrowRequests();

	return requests.filter((item) => item.studentId === studentId);
}

export function getNotifications(): StudentNotification[] {
	initStudentData();

	return getLocalData<StudentNotification[]>(NOTIFICATION_KEY, mockNotifications);
}

export function createNotification(notification: StudentNotification): void {
	const notifications = getNotifications();

	setLocalData<StudentNotification[]>(NOTIFICATION_KEY, [notification, ...notifications]);
}

export function markAllNotificationsAsRead(): void {
	const notifications = getNotifications();

	const newNotifications = notifications.map((item) => ({
		...item,
		isRead: true,
	}));

	setLocalData<StudentNotification[]>(NOTIFICATION_KEY, newNotifications);
}

export function resetStudentDemoData(): void {
	setLocalData<Device[]>(DEVICE_KEY, mockDevices);
	setLocalData<BorrowRequest[]>(REQUEST_KEY, []);
	setLocalData<StudentNotification[]>(NOTIFICATION_KEY, mockNotifications);
}

// src/access.ts
export default function access(_initialState: any) {
	// Đọc role từ localStorage (được lưu sau khi login thành công)
	let role = '';
	try {
		const raw = localStorage.getItem('ript_user');
		if (raw) {
			const user = JSON.parse(raw);
			role = user?.role || '';
		}
	} catch {
		role = '';
	}

	return {
		isAdmin: role === 'admin',
		isStudent: role === 'student',
		// Giữ các access cũ để không break các component khác
		accessFilter: () => true,
		manyAccessFilter: () => true,
	};
}
import apiFetch from './api';

const USER_KEY = 'ript_user';

export const login = async (email: string, password: string) => {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }
  return res;
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): { id: number; name: string; email: string; role: string } | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const getMe = async () => apiFetch('/me');

export default { login, logout, getCurrentUser, isAuthenticated, getMe };

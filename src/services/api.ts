// Get API base URL based on environment
const getAPIBase = () => {
  // In development with proxy, use relative path
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }
  // In production, use backend URL
  return 'https://club-backend-dmy7.onrender.com/api';
};

const API_BASE = getAPIBase();

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default apiFetch;

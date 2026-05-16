import apiFetch from './api';

export const getMe = async () => apiFetch('/me');

export default { getMe };

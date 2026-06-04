import apiFetch from './api';

export const createRequest = async (data: any) => apiFetch('/requests', { method: 'POST', body: JSON.stringify(data) });
export const getMyRequests = async (userId?: number) => apiFetch(`/requests/mine${userId ? `?userId=${userId}` : ''}`);
export const getRequests = async () => apiFetch('/requests');
export const approveRequest = async (id: number) => apiFetch(`/requests/${id}/approve`, { method: 'POST' });
export const returnRequest = async (id: number) => apiFetch(`/requests/${id}/return`, { method: 'POST' });
export const cancelRequest = async (id: number) => apiFetch(`/requests/${id}/cancel`, { method: 'POST' });

export default { createRequest, getMyRequests, getRequests, approveRequest, returnRequest, cancelRequest };
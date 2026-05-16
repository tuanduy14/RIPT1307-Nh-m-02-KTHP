import apiFetch from './api';

export const createRequest = async (data: any) => apiFetch('/requests', { method: 'POST', body: JSON.stringify(data) });
export const getMyRequests = async () => apiFetch('/requests/mine');
export const getRequests = async () => apiFetch('/requests');
export const approveRequest = async (id: number) => apiFetch(`/requests/${id}/approve`, { method: 'POST' });

export default { createRequest, getMyRequests, getRequests, approveRequest };

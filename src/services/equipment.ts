import apiFetch from './api';

export const getEquipments = async () => apiFetch('/equipments');
export const getStats = async () => apiFetch('/equipments/stats');
export const adjustQuantity = async (id: number, delta: number) => apiFetch(`/equipments/${id}/adjust`, { method: 'POST', body: JSON.stringify({ delta }) });
export const updateEquipment = async (id: number, data: { name: string; quantity: number }) => apiFetch(`/equipments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const createEquipment = async (data: { name: string; quantity: number }) => apiFetch('/equipments', { method: 'POST', body: JSON.stringify(data) });
export const deleteEquipment = async (id: number) => apiFetch(`/equipments/${id}`, { method: 'DELETE' });

export default { getEquipments, getStats, adjustQuantity, updateEquipment, createEquipment, deleteEquipment };
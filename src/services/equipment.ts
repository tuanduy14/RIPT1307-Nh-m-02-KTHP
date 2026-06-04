import apiFetch from './api';

export const getEquipments = async () => apiFetch('/equipments');
export const getStats = async () => apiFetch('/equipments/stats');
export const adjustQuantity = async (id: number, delta: number) => apiFetch(`/equipments/${id}/adjust`, { method: 'POST', body: JSON.stringify({ delta }) });
export const updateEquipment = async (id: number, data: { name: string; quantity: number }) => apiFetch(`/equipments/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export default { getEquipments, getStats, adjustQuantity, updateEquipment };
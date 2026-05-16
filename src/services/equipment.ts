import apiFetch from './api';

export const getEquipments = async () => apiFetch('/equipments');
export const getStats = async () => apiFetch('/equipments/stats');
export const adjustQuantity = async (id: number, delta: number) => apiFetch(`/equipments/${id}/adjust`, { method: 'POST', body: JSON.stringify({ delta }) });

export default { getEquipments, getStats, adjustQuantity };

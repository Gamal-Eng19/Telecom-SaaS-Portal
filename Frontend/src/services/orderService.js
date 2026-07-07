import api from './api';

export const getOrders = () => api.getJson('orders');

export default { getOrders };

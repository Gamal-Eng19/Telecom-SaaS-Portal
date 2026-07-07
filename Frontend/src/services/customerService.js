import api from './api';

export const getCustomers = () => api.getJson('customers');

export default { getCustomers };

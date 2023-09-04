import wretch from 'wretch';

const instance = wretch(import.meta.env.VITE_API_URL);

export const useApi = () => instance;

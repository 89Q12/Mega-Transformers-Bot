import wretch from 'wretch'

const instance = wretch(import.meta.env.API_URL)

export const useApi = () => instance
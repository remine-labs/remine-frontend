import { api } from './client'

export const getMe = async () => {
    const res = await api.get('/api/users/me')
    return res.data
}
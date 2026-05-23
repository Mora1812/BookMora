import api from './axios'

export const login = (credentials) => api.post('/auth/login/', credentials)
export const register = (data) => api.post('/auth/register/', data)
export const logout = (refresh) => api.post('/auth/logout/', { refresh })
export const getMe = () => api.get('/auth/me/')
export const updateMe = (data) => api.patch('/auth/me/', data)
export const getAuthor = (username) => api.get(`/auth/authors/${username}/`)

// Admin
export const getAdminUsers = (params) => api.get('/auth/admin/users/', { params })
export const updateAdminUser = (id, data) => api.patch(`/auth/admin/users/${id}/`, data)
export const deleteAdminUser = (id) => api.delete(`/auth/admin/users/${id}/`)
export const toggleSuspendUser = (id) => api.post(`/auth/admin/users/${id}/toggle_suspend/`)
export const changeUserRole = (id, role) => api.post(`/auth/admin/users/${id}/change_role/`, { role })

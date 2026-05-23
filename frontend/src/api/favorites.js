import api from './axios'

export const getFavorites = () => api.get('/favorites/')
export const toggleFavorite = (storyId) => api.post('/favorites/', { story: storyId })
export const checkFavorite = (storyId) => api.get('/favorites/check/', { params: { story: storyId } })

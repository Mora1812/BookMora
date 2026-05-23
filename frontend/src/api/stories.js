import api from './axios'

export const getStories = (params) => api.get('/stories/', { params })
export const getStory = (id) => api.get(`/stories/${id}/`)
export const createStory = (data) => api.post('/stories/', data)
export const updateStory = (id, data) => api.patch(`/stories/${id}/`, data)
export const deleteStory = (id) => api.delete(`/stories/${id}/`)
export const getMyStories = () => api.get('/stories/my_stories/')
export const getGenres = () => api.get('/stories/genres/')

// Chapters
export const getChapters = (storyId) => api.get(`/stories/${storyId}/chapters/`)
export const getChapter = (storyId, chapterId) => api.get(`/stories/${storyId}/chapters/${chapterId}/`)
export const createChapter = (storyId, data) => api.post(`/stories/${storyId}/chapters/`, data)
export const updateChapter = (storyId, chapterId, data) => api.patch(`/stories/${storyId}/chapters/${chapterId}/`, data)
export const deleteChapter = (storyId, chapterId) => api.delete(`/stories/${storyId}/chapters/${chapterId}/`)

// Admin
export const toggleFeatured = (id) => api.post(`/stories/${id}/toggle_featured/`)
export const changeStoryStatus = (id, status) => api.post(`/stories/${id}/change_status/`, { status })

import api from './axios'

export const getComments = (storyId) => api.get('/comments/', { params: { story: storyId } })
export const createComment = (data) => api.post('/comments/', data)
export const updateComment = (id, data) => api.patch(`/comments/${id}/`, data)
export const deleteComment = (id) => api.delete(`/comments/${id}/`)

import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
}

export const offers = {
  getAll: (params?: { category?: string; status?: string; businessType?: string; date?: string; minPrice?: number; maxPrice?: number; availableOnly?: boolean }) =>
    api.get('/offers', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/offers/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/offers', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/offers/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/offers/${id}`),
}

export const slots = {
  getByOffer: (offerId: string) => api.get(`/slots/offer/${offerId}`).then((r) => r.data),
  getAvailable: (offerId: string) => api.get(`/slots/offer/${offerId}/available`).then((r) => r.data),
  createBulk: (data: any) => api.post('/slots/bulk', data).then((r) => r.data),
  delete: (id: string) => api.delete(`/slots/${id}`),
}

export const bookings = {
  create: (data: any) => api.post('/bookings', data).then((r) => r.data),
  getByReference: (ref: string) => api.get(`/bookings/reference/${ref}`).then((r) => r.data),
  getByOffer: (offerId: string) => api.get(`/bookings/offer/${offerId}`).then((r) => r.data),
  getAll: () => api.get('/bookings').then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, status, { headers: { 'Content-Type': 'application/json' } }).then((r) => r.data),
  getDashboard: () => api.get('/bookings/dashboard').then((r) => r.data),
}

export const businesses = {
  getAll: () => api.get('/businesses').then((r) => r.data),
  getById: (id: string) => api.get(`/businesses/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/businesses', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/businesses/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/businesses/${id}`),
}

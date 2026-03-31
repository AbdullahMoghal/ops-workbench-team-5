import client from './axiosClient'

export const ticketsApi = {
  list: (params = {}) =>
    client.get('/api/tickets', { params }).then(r => r.data.data),

  getById: (id) =>
    client.get(`/api/tickets/${id}`).then(r => r.data.data),

  create: (body) =>
    client.post('/api/tickets', body).then(r => r.data.data),

  update: (id, body) =>
    client.put(`/api/tickets/${id}`, body).then(r => r.data.data),

  changeStatus: (id, status, reason) =>
    client.patch(`/api/tickets/${id}/status`, { status, reason }).then(r => r.data.data),

  assign: (id, userId) =>
    client.patch(`/api/tickets/${id}/assign`, { userId }).then(r => r.data.data),

  escalate: (id, reason) =>
    client.patch(`/api/tickets/${id}/escalate`, { reason }).then(r => r.data.data),

  close: (id) =>
    client.patch(`/api/tickets/${id}/close`).then(r => r.data.data),
}

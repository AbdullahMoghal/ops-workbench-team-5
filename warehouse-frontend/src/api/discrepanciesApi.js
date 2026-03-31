import client from './axiosClient'

export const discrepanciesApi = {
  create: (body) =>
    client.post('/api/discrepancies', body).then(r => r.data.data),

  getById: (id) =>
    client.get(`/api/discrepancies/${id}`).then(r => r.data.data),

  approve: (discrepancyId, body) =>
    client.post(`/api/adjustments/${discrepancyId}/approve`, body).then(r => r.data.data),

  reject: (discrepancyId, body) =>
    client.post(`/api/adjustments/${discrepancyId}/reject`, body).then(r => r.data.data),
}

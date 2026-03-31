import client from './axiosClient'

export const auditApi = {
  getGlobal: (page = 0, size = 50) =>
    client.get('/api/audit-logs', { params: { page, size } }).then(r => r.data.data),

  getByTicket: (ticketId) =>
    client.get(`/api/tickets/${ticketId}/audit-logs`).then(r => r.data.data),
}

import client from './axiosClient'

export const reportsApi = {
  history: (params = {}) =>
    client.get('/api/reports/history', { params }).then(r => r.data.data),
}

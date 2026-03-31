import client from './axiosClient'

export const dashboardApi = {
  getSummary: () =>
    client.get('/api/dashboard/summary').then(r => r.data.data),

  getQueueStats: () =>
    client.get('/api/dashboard/queue-stats').then(r => r.data.data),
}

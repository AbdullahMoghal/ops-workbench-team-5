import client from './axiosClient'

export const notesApi = {
  list: (ticketId) =>
    client.get(`/api/tickets/${ticketId}/notes`).then(r => r.data.data),

  create: (ticketId, noteText) =>
    client.post(`/api/tickets/${ticketId}/notes`, { noteText }).then(r => r.data.data),
}

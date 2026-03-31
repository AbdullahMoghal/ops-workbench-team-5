import client from './axiosClient'

export const adminApi = {
  // Users
  listUsers: () => client.get('/api/users').then(r => r.data.data),
  createUser: (body) => client.post('/api/users', body).then(r => r.data.data),
  updateUser: (id, body) => client.put(`/api/users/${id}`, body).then(r => r.data.data),

  // Roles
  listRoles: () => client.get('/api/roles').then(r => r.data.data),

  // Locations
  listLocations: () => client.get('/api/locations').then(r => r.data.data),
  createLocation: (body) => client.post('/api/locations', body).then(r => r.data.data),
  updateLocation: (id, body) => client.put(`/api/locations/${id}`, body).then(r => r.data.data),

  // Categories
  listCategories: () => client.get('/api/categories').then(r => r.data.data),
  createCategory: (body) => client.post('/api/categories', body).then(r => r.data.data),
  updateCategory: (id, body) => client.put(`/api/categories/${id}`, body).then(r => r.data.data),

  // Inventory Items
  listInventoryItems: () => client.get('/api/inventory-items').then(r => r.data.data),
}

const categoryRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/category',
    handler: handler.create,
  },
  {
    method: 'GET',
    path: '/api/category',
    handler: handler.findAll,
  },
  {
    method: 'GET',
    path: '/api/category/{id}',
    handler: handler.findById,
  },
  {
    method: 'PUT',
    path: '/api/category/{id}',
    handler: handler.update,
  },
  {
    method: 'DELETE',
    path: '/api/category/{id}',
    handler: handler.delete,
  },
  {
    method: 'GET',
    path: '/api/category/{id}/menu',
    handler: handler.getMenusByCategory,
  },
];

module.exports = categoryRoutes;

const categoryRoutes = (handler) => [
  {
    method: 'POST',
    path: '/category',
    handler: handler.create,
  },
  {
    method: 'GET',
    path: '/category',
    handler: handler.findAll,
  },
  {
    method: 'GET',
    path: '/category/{id}',
    handler: handler.findById,
  },
  {
    method: 'PUT',
    path: '/category/{id}',
    handler: handler.update,
  },
  {
    method: 'DELETE',
    path: '/category/{id}',
    handler: handler.delete,
  },
];

module.exports = categoryRoutes;

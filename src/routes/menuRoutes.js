const menuRoutes = (handler) => [
  {
    method: 'POST',
    path: '/menu',
    handler: handler.create,
  },
  {
    method: 'GET',
    path: '/menu',
    handler: handler.findAll,
  },
  {
    method: 'GET',
    path: '/menu/{id}',
    handler: handler.findById,
  },
  {
    method: 'PUT',
    path: '/menu/{id}',
    handler: handler.update,
  },
  {
    method: 'DELETE',
    path: '/menu/{id}',
    handler: handler.delete,
  },
];

module.exports = menuRoutes;

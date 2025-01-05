const toppingRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/topping',
    handler: handler.create,
  },
  {
    method: 'GET',
    path: '/api/topping',
    handler: handler.findAll,
  },
  {
    method: 'GET',
    path: '/api/topping/{id}',
    handler: handler.findById,
  },
  {
    method: 'PUT',
    path: '/api/topping/{id}',
    handler: handler.update,
  },
  {
    method: 'DELETE',
    path: '/api/topping/{id}',
    handler: handler.delete,
  },
];

module.exports = toppingRoutes;

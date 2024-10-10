const toppingRoutes = (handler) => [
  {
    method: 'POST',
    path: '/topping',
    handler: handler.create,
  },
  {
    method: 'GET',
    path: '/topping',
    handler: handler.findAll,
  },
  {
    method: 'GET',
    path: '/topping/{id}',
    handler: handler.findById,
  },
  {
    method: 'PUT',
    path: '/topping/{id}',
    handler: handler.update,
  },
  {
    method: 'DELETE',
    path: '/topping/{id}',
    handler: handler.delete,
  },
];

module.exports = toppingRoutes;

const menuRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/menu',
    handler: handler.create,
  },
  {
    method: 'GET',
    path: '/api/menu',
    handler: handler.findAll,
  },
  {
    method: 'GET',
    path: '/api/menu/{id}',
    handler: handler.findById,
  },
  {
    method: 'PUT',
    path: '/api/menu/{id}',
    handler: handler.update,
  },
  {
    method: 'DELETE',
    path: '/api/menu/{id}',
    handler: handler.delete,
  },
  {
    method: 'POST',
    path: '/api/menu/{id}/topping',
    handler: handler.addMenuTopping,
  },
  {
    method: 'GET',
    path: '/api/menu/{id}/topping',
    handler: handler.getMenuWithToppings,
  },
];

module.exports = menuRoutes;

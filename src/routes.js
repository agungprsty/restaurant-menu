const container = require('./core/container');

const categoryHandler = container.resolve('categoryHandler');
const menuHandler = container.resolve('menuHandler');
const toppingHandler = container.resolve('toppingHandler');
const categoryRoutes = require('./routes/categoryRoutes');
const menuRoutes = require('./routes/menuRoutes');
const toppingRoutes = require('./routes/toppingRoutes');
const {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNoteByIdHandler,
  deleteNoteByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: () => 'Hello World!',
  },
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,
  },
  {
    method: 'GET',
    path: '/notes',
    handler: getAllNotesHandler,
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: getNoteByIdHandler,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: updateNoteByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteByIdHandler,
  },
  ...categoryRoutes(categoryHandler),
  ...menuRoutes(menuHandler),
  ...toppingRoutes(toppingHandler),
];

module.exports = routes;

const Hapi = require('@hapi/hapi');
const { graphql } = require('graphql');
const fs = require('fs');
const path = require('path');
const schema = require('./graphql/schema');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);
  
  // GraphQL endpoint
  server.route({
    method: 'POST',
    path: '/graphql',
    handler: async (req, h) => {
      const { query, variables } = req.payload;

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
      });

      return h.response(result);
    },
  });

  // Static GraphQL IDE route
  server.route({
    method: 'GET',
    path: '/graphql',
    handler: (req, h) => {
      const graphiqlPage = fs.readFileSync(
        path.join(__dirname, '/graphiql.html'),
        'utf8',
      );
      return h.response(graphiqlPage).type('text/html');
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

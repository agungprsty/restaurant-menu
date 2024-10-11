const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');
const noteQueries = require('./resolvers/noteQueries');
const categoryQueries = require('./resolvers/categoryQueries');
const menuQueries = require('./resolvers/menuQueries');
const toppingQueries = require('./resolvers/toppingQueries');
const noteMutations = require('./resolvers/noteMutations');
const categoryMutations = require('./resolvers/categoryMutations');
const menuMutations = require('./resolvers/menuMutations');
const toppingMutations = require('./resolvers/toppingMutations');

// Define the Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...noteQueries,
    ...categoryQueries,
    ...menuQueries,
    ...toppingQueries,
  },
});

// Define the Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...noteMutations,
    ...categoryMutations,
    ...menuMutations,
    ...toppingMutations,
  },
});

// Export the schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

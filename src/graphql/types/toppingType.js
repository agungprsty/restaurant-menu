const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const ToppingType = new GraphQLObjectType({
  name: 'Topping',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    price: { type: GraphQLInt },
    createdAt: { type: GraphQLFloat },
    updatedAt: { type: GraphQLFloat },
  }),
});

module.exports = ToppingType;

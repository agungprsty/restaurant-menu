const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const MenuType = new GraphQLObjectType({
  name: 'Menu',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    slug: { type: GraphQLString },
    price: { type: GraphQLInt },
    categoryId: { type: GraphQLInt },
    createdAt: { type: GraphQLFloat },
    updatedAt: { type: GraphQLFloat },
  }),
});

module.exports = MenuType;

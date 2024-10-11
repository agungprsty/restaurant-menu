const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    createdAt: { type: GraphQLFloat },
    updatedAt: { type: GraphQLFloat },
  }),
});

module.exports = CategoryType;

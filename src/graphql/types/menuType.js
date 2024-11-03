const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');
const ToppingType = require('./toppingType');

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
    toppings: { type: new GraphQLList(ToppingType) },
  }),
});

module.exports = MenuType;

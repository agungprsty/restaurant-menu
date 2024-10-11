const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const ToppingType = require('../types/toppingType');

const prisma = new PrismaClient();

const toppingQueries = {
  toppings: {
    type: new GraphQLList(ToppingType),
    resolve: async () => prisma.topping.findMany(),
  },
  topping: {
    type: ToppingType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const topping = await prisma.topping.findUnique({
        where: { id: args.id },
      });
      return topping;
    },
  },
};

module.exports = toppingQueries;

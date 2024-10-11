const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const CategoryType = require('../types/categoryType');

const prisma = new PrismaClient();

const categoryQueries = {
  categories: {
    type: new GraphQLList(CategoryType),
    resolve: async () => prisma.category.findMany(),
  },
  category: {
    type: CategoryType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const category = await prisma.category.findUnique({
        where: { id: args.id },
      });
      return category;
    },
  },
};

module.exports = categoryQueries;

const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const MenuType = require('../types/menuType');

const prisma = new PrismaClient();

const menuQueries = {
  menus: {
    type: new GraphQLList(MenuType),
    resolve: async () => prisma.menu.findMany(),
  },
  menu: {
    type: MenuType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const menu = await prisma.menu.findUnique({
        where: { id: args.id },
      });
      return menu;
    },
  },
};

module.exports = menuQueries;

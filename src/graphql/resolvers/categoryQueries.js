const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const CategoryType = require('../types/categoryType');
const { hasField } = require('../../utils');

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
    resolve: async (parent, args, context, info) => {
      const hasMenusField = hasField(info, 'menus');
      const hasToppingsField = hasField(info, 'toppings');
      
      const category = await prisma.category.findUnique({
        where: { id: args.id },
        // Ambil semua menu yang terkait
        include: {
          menus: hasMenusField,
        },
      });

      if (category && category.menus) {
        // Loop melalui setiap menu dan tambahkan topping
        const menusWithToppings = await Promise.all(
          category.menus.map(async (menu) => {
            if (hasToppingsField) {
              // Query menuToppings to get the related toppings
              const menuToppings = await prisma.menuToppings.findMany({
                where: { menuId: menu.id },
                include: { topping: true },
              });
      
              // Map to extract topping details
              menu.toppings = menuToppings.map((item) => item.topping);
            }

            return menu;
          }),
        );

        // Perbarui category.menus dengan data yang memiliki toppings
        category.menus = menusWithToppings;
      }

      return category;
    },
  },
};

module.exports = categoryQueries;

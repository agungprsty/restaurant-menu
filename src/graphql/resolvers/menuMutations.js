const {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const _ = require('lodash');
const { PrismaClient } = require('@prisma/client');
const { now, slugify } = require('../../utils');
const Log = require('../../logger');
const MenuType = require('../types/menuType');
const { menuValidation } = require('../../validations/menuValidation');

const prisma = new PrismaClient();

const menuMutations = {
  addMenu: {
    type: MenuType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      price: { type: new GraphQLNonNull(GraphQLInt) },
      categoryId: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const { error } = menuValidation.validate(args);
      if (error) {
        Log.error(
          { path: '/src/menuMutations.js' },
          `Validation error: ${error.message}`,
        );
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      const {
        name, description, price, categoryId,
      } = args;
      const slug = slugify(name);
      const createdAt = now;
      const updatedAt = createdAt;

      // Validate slug uniqueness
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!existingCategory) {
        Log.error(
          { path: '/src/menuMutations.js' },
          `Category not found: ${categoryId}`,
        );
        throw new Error('Category not found');
      }

      // Validate slug uniqueness
      const existingSlug = await prisma.menu.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        Log.error(
          { path: '/src/menuMutations.js' },
          `Slug already exists: ${slug}`,
        );
        throw new Error(`The slug ${slug} is already in use. Please choose another slug.`);
      }
      
      try {
        const newMenu = await prisma.menu.create({
          data: {
            name,
            description,
            price,
            slug,
            categoryId,
            createdAt,
            updatedAt,
          },
        });

        Log.info(`Menu created: ${newMenu.id}`);
        return newMenu;
      } catch (err) {
        Log.error({ path: '/src/menuMutations.js' }, err.message);
        throw new Error('Menu creation failed');
      }
    },
  },
  updateMenu: {
    type: MenuType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      price: { type: new GraphQLNonNull(GraphQLInt) },
      categoryId: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const payload = _.omit(args, ['id']);
      const { error } = menuValidation.validate(payload);
      if (error) {
        Log.error(
          { path: '/src/menuMutations.js' },
          `Validation error: ${error.message}`,
        );
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      const {
        id, name, description, price, categoryId,
      } = args;
      const slug = slugify(name);
      const updatedAt = now;

      // Validate existing menu
      const existingMenu = await prisma.menu.findUnique({
        where: { id },
      });

      if (!existingMenu) {
        Log.error(
          { path: '/src/menuMutations.js' },
          `Menu not found: ${id}`,
        );
        throw new Error('Menu not found.');
      }

      // Validate slug uniqueness
      const existingSlug = await prisma.menu.findUnique({
        where: { slug },
      });
      if (existingSlug && existingMenu.id !== existingSlug.id) {
        Log.error(
          { path: '/src/menuMutations.js' },
          `Slug already exists: ${slug}`,
        );
        throw new Error(`The slug ${slug} is already in use. Please choose another slug.`);
      }

      try {
        const updatedMenu = await prisma.menu.update({
          where: { id },
          data: {
            name,
            description,
            price,
            slug,
            categoryId,
            updatedAt,
          },
        });

        Log.info(`Menu updated: ${updatedMenu.id}`);
        return updatedMenu;
      } catch (err) {
        Log.error({ path: '/src/menuMutations.js' }, err.message);
        throw new Error('Menu failed to update');
      }
    },
  },
  deleteMenu: {
    type: MenuType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const deletedMenu = await prisma.menu.delete({
        where: { id: args.id },
      });
      return deletedMenu;
    },
  },
};

module.exports = menuMutations;

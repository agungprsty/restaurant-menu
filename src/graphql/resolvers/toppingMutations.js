const {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const _ = require('lodash');
const { PrismaClient } = require('@prisma/client');
const { now, slugify } = require('../../utils');
const Log = require('../../logger');
const ToppingType = require('../types/toppingType');
const { toppingValidation } = require('../../validations/toppingValidation');

const prisma = new PrismaClient();

const toppingMutations = {
  addTopping: {
    type: ToppingType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      price: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const { error } = toppingValidation.validate(args);
      if (error) {
        Log.error(
          { path: '/src/toppingMutations.js' },
          `Validation error: ${error.message}`,
        );
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      const { name, price } = args;
      const slug = slugify(name);
      const createdAt = now;
      const updatedAt = createdAt;

      // Validate slug uniqueness
      const existingSlug = await prisma.topping.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        Log.error(
          { path: '/src/toppingMutations.js' },
          `Slug already exists: ${slug}`,
        );
        throw new Error(`The slug ${slug} is already in use. Please choose another slug.`);
      }
      
      try {
        const newTopping = await prisma.topping.create({
          data: {
            name,
            price,
            slug,
            createdAt,
            updatedAt,
          },
        });

        Log.info(`Topping created: ${newTopping.id}`);
        return newTopping;
      } catch (err) {
        Log.error({ path: '/src/toppingMutations.js' }, err.message);
        throw new Error('Topping creation failed');
      }
    },
  },
  updateTopping: {
    type: ToppingType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      price: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const payload = _.omit(args, ['id']);
      const { error } = toppingValidation.validate(payload);
      if (error) {
        Log.error(
          { path: '/src/toppingMutations.js' },
          `Validation error: ${error.message}`,
        );
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      const { id, name, price } = args;
      const slug = slugify(name);
      const updatedAt = now;

      // Validate existing topping
      const existingTopping = await prisma.topping.findUnique({
        where: { id },
      });

      if (!existingTopping) {
        Log.error(
          { path: '/src/toppingMutations.js' },
          `Topping not found: ${id}`,
        );
        throw new Error('Topping not found.');
      }

      // Validate slug uniqueness
      const existingSlug = await prisma.topping.findUnique({
        where: { slug },
      });
      if (existingSlug && existingTopping.id !== existingSlug.id) {
        Log.error(
          { path: '/src/toppingMutations.js' },
          `Slug already exists: ${slug}`,
        );
        throw new Error(`The slug ${slug} is already in use. Please choose another slug.`);
      }

      try {
        const updatedTopping = await prisma.topping.update({
          where: { id },
          data: {
            name,
            price,
            slug,
            updatedAt,
          },
        });

        Log.info(`Topping updated: ${updatedTopping.id}`);
        return updatedTopping;
      } catch (err) {
        Log.error({ path: '/src/toppingMutations.js' }, err.message);
        throw new Error('Topping failed to update');
      }
    },
  },
  deleteTopping: {
    type: ToppingType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const deletedTopping = await prisma.topping.delete({
        where: { id: args.id },
      });
      return deletedTopping;
    },
  },
};

module.exports = toppingMutations;

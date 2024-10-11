const {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const _ = require('lodash');
const { PrismaClient } = require('@prisma/client');
const { now, slugify } = require('../../utils');
const Log = require('../../logger');
const CategoryType = require('../types/categoryType');
const { categoryValidation } = require('../../validations/categoryValidation');

const prisma = new PrismaClient();

const categoryMutations = {
  addCategory: {
    type: CategoryType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args) => {
      const { error } = categoryValidation.validate(args);
      if (error) {
        Log.error(
          { path: '/src/categoryMutations.js' },
          `Validation error: ${error.message}`,
        );
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      const { name } = args;
      const slug = slugify(name);
      const createdAt = now;
      const updatedAt = createdAt;

      // Validate slug uniqueness
      const existingSlug = await prisma.category.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        Log.error(
          { path: '/src/categoryMutations.js' },
          `Slug already exists: ${slug}`,
        );
        throw new Error(`The slug ${slug} is already in use. Please choose another slug.`);
      }
      
      try {
        const newCategory = await prisma.category.create({
          data: {
            name,
            slug,
            createdAt,
            updatedAt,
          },
        });

        Log.info(`Category created: ${newCategory.id}`);
        return newCategory;
      } catch (err) {
        Log.error({ path: '/src/categoryMutations.js' }, err.message);
        throw new Error('Category creation failed');
      }
    },
  },
  updateCategory: {
    type: CategoryType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const payload = _.omit(args, ['id']);
      const { error } = categoryValidation.validate(payload);
      if (error) {
        Log.error(
          { path: '/src/categoryMutations.js' },
          `Validation error: ${error.message}`,
        );
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      const { id, name } = args;
      const slug = slugify(name);
      const updatedAt = now;

      // Validate existing category
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        Log.error(
          { path: '/src/categoryMutations.js' },
          `Category not found: ${id}`,
        );
        throw new Error('Category not found.');
      }

      // Validate slug uniqueness
      const existingSlug = await prisma.category.findUnique({
        where: { slug },
      });
      if (existingSlug && existingCategory.id !== existingSlug.id) {
        Log.error(
          { path: '/src/categoryMutations.js' },
          `Slug already exists: ${slug}`,
        );
        throw new Error(`The slug ${slug} is already in use. Please choose another slug.`);
      }

      try {
        const updatedCategory = await prisma.category.update({
          where: { id },
          data: {
            name,
            slug,
            updatedAt,
          },
        });

        Log.info(`Category updated: ${updatedCategory.id}`);
        return updatedCategory;
      } catch (err) {
        Log.error({ path: '/src/categoryMutations.js' }, err.message);
        throw new Error('Category failed to update');
      }
    },
  },
  deleteCategory: {
    type: CategoryType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args) => {
      const deletedCategory = await prisma.category.delete({
        where: { id: args.id },
      });
      return deletedCategory;
    },
  },
};

module.exports = categoryMutations;

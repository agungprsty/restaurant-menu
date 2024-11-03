const { now, safeInt, slugify } = require('../utils');
const { categoryValidation } = require('../validations/categoryValidation');
const Log = require('../logger');

class CategoryHandler {
  constructor({ categoryRepository, menuRepository }) {
    this.categoryRepository = categoryRepository;
    this.menuRepository = menuRepository;
  }

  create = async (req, h) => {
    const { error } = categoryValidation.validate(req.payload);
    if (error) {
      Log.error(
        { path: '/src/categoryHandler.js' },
        `Validation error: ${error.message}`,
      );
      const response = h.response({
        status: 'fail',
        message: `Validation failed: ${error.details[0].message}`,
      });
      response.code(400);
      return response;
    }

    const { name } = req.payload;
    const slug = slugify(name);
    const createdAt = now;
    const updatedAt = createdAt;

    // Validasi slug
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    
    if (existingSlug) {
      Log.error(
        { path: '/src/categoryHandler.js' },
        `Slug already exists: ${slug}`,
      );
      const response = h.response({
        status: 'fail',
        message: `The slug ${slug} is already in use. Please choose another slug.`,
      });
      response.code(400);
      return response;
    }

    try {
      const newCategory = await this.categoryRepository.save({
        name,
        slug,
        createdAt,
        updatedAt,
      });

      Log.info(`Category created: ${newCategory.id}`);

      const response = h.response({
        status: 'success',
        message: 'Category successfully added',
        data: {
          category: newCategory,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      Log.error({ path: '/src/categoryHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Category failed added',
      });
      response.code(500);
      return response;
    }
  };

  findById = async (req, h) => {
    const { id } = req.params;
    const category = await this.categoryRepository.findById(safeInt(id));

    if (category) {
      return {
        status: 'success',
        data: {
          category,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Category not found',
    });
    response.code(404);
    return response;
  };

  findAll = async () => {
    const categories = await this.categoryRepository.findAll();

    return {
      status: 'success',
      data: {
        categories,
      },
    };
  };

  update = async (req, h) => {
    const { error } = categoryValidation.validate(req.payload);
    if (error) {
      Log.error(
        { path: '/src/categoryHandler.js' },
        `Validation error: ${error.message}`,
      );
      const response = h.response({
        status: 'fail',
        message: `Validation failed: ${error.details[0].message}`,
      });
      response.code(400);
      return response;
    }

    const { id } = req.params;
    const existingCategory = await this.categoryRepository.findById(
      safeInt(id),
    );

    if (!existingCategory) {
      Log.error(
        { path: '/src/categoryHandler.js' },
        `Category not found: ${id}`,
      );
      const response = h.response({
        status: 'fail',
        message: 'Category not found.',
      });
      response.code(404);
      return response;
    }

    const { name } = req.payload;
    const slug = slugify(name);
    const updatedAt = now;

    // Validasi slug
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    
    if (existingSlug && existingCategory.id !== existingSlug.id) {
      Log.error(
        { path: '/src/categoryHandler.js' },
        `Slug already exists: ${slug}`,
      );
      const response = h.response({
        status: 'fail',
        message: `The slug ${slug} is already in use. Please choose another slug.`,
      });
      response.code(400);
      return response;
    }

    try {
      const updateCategory = await this.categoryRepository.update(
        safeInt(id),
        {
          name,
          slug,
          updatedAt,
        },
      );

      Log.info(`Category updated: ${updateCategory.id}`);

      const response = h.response({
        status: 'success',
        message: 'Category successfully updated',
        data: {
          category: updateCategory,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      Log.error({ path: '/src/categoryHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Category failed to update',
      });
      response.code(500);
      return response;
    }
  };

  delete = async (req, h) => {
    const { id } = req.params;

    try {
      await this.categoryRepository.delete(safeInt(id));

      const response = h.response({
        status: 'success',
        message: 'Category successfully deleted',
      });
      response.code(200);
      return response;
    } catch (err) {
      Log.error({ path: '/src/handler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Category failed to deleted',
      });
      response.code(500);
      return response;
    }
  };

  getMenusByCategory = async (req, h) => {
    const { id } = req.params;
    const category = await this.categoryRepository.findById(safeInt(id));

    if (!category) {
      const response = h.response({
        status: 'fail',
        message: 'Category not found',
      });
      response.code(404);
      return response;
    }

    const menus = await this.menuRepository.findByCategoryId(safeInt(id));
    category.menus = menus;

    return {
      status: 'success',
      data: { category },
    };
  };
}

module.exports = CategoryHandler;

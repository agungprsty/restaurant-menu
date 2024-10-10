const { now, safeInt, slugify } = require('../utils');
const { menuValidation } = require('../validations/menuValidation');
const Log = require('../logger');

class MenuHandler {
  constructor({ menuRepository, categoryRepository }) {
    this.menuRepository = menuRepository;
    this.categoryRepository = categoryRepository;
  }

  create = async (req, h) => {
    const { error } = menuValidation.validate(req.payload);
    if (error) {
      Log.error(
        { path: '/src/menuHandler.js' },
        `Validation error: ${error.message}`,
      );
      const response = h.response({
        status: 'fail',
        message: `Validation failed: ${error.details[0].message}`,
      });
      response.code(400);
      return response;
    }

    const {
      name, description, price, categoryId,
    } = req.payload;

    const slug = slugify(name);
    const createdAt = now;
    const updatedAt = createdAt;

    // Validasi category
    const existingCategory = await this.categoryRepository.findById(
      safeInt(categoryId),
    );

    if (!existingCategory) {
      Log.error(
        { path: '/src/menuHandler.js' },
        `Category not found: ${categoryId}`,
      );
      const response = h.response({
        status: 'fail',
        message: 'Category not found.',
      });
      response.code(404);
      return response;
    }

    // Validasi slug
    const existingSlug = await this.menuRepository.findBySlug(slug);
    
    if (existingSlug) {
      Log.error(
        { path: '/src/menuHandler.js' },
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
      const newMenu = await this.menuRepository.save({
        name,
        description,
        price,
        slug,
        categoryId,
        createdAt,
        updatedAt,
      });

      Log.info(`Menu created: ${newMenu.id}`);

      const response = h.response({
        status: 'success',
        message: 'Menu successfully added',
        data: {
          menu: newMenu,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      Log.error({ path: '/src/menuHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Menu failed added',
      });
      response.code(500);
      return response;
    }
  };

  findById = async (req, h) => {
    const { id } = req.params;
    const menu = await this.menuRepository.findById(safeInt(id));

    if (menu) {
      return {
        status: 'success',
        data: {
          menu,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Menu not found',
    });
    response.code(404);
    return response;
  };

  findAll = async () => {
    const menus = await this.menuRepository.findAll();

    return {
      status: 'success',
      data: {
        menus,
      },
    };
  };

  update = async (req, h) => {
    const { error } = menuValidation.validate(req.payload);
    if (error) {
      Log.error(
        { path: '/src/menuHandler.js' },
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
    const existingMenu = await this.menuRepository.findById(
      safeInt(id),
    );

    if (!existingMenu) {
      Log.error(
        { path: '/src/menuHandler.js' },
        `Menu not found: ${id}`,
      );
      const response = h.response({
        status: 'fail',
        message: 'Menu not found.',
      });
      response.code(404);
      return response;
    }

    const {
      name, description, price, categoryId,
    } = req.payload;

    const slug = slugify(name);
    const updatedAt = now;

    // Validasi category
    const existingCategory = await this.categoryRepository.findById(
      safeInt(categoryId),
    );

    if (!existingCategory) {
      Log.error(
        { path: '/src/menuHandler.js' },
        `Category not found: ${categoryId}`,
      );
      const response = h.response({
        status: 'fail',
        message: 'Category not found.',
      });
      response.code(404);
      return response;
    }

    // Validasi slug
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    
    if (existingSlug && existingMenu.id !== existingSlug.id) {
      Log.error(
        { path: '/src/menuHandler.js' },
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
      const updateMenu = await this.menuRepository.update(
        safeInt(id),
        {
          name,
          description,
          price,
          slug,
          categoryId,
          updatedAt,
        },
      );

      Log.info(`Menu updated: ${updateMenu.id}`);

      const response = h.response({
        status: 'success',
        message: 'Menu successfully updated',
        data: {
          menu: updateMenu,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      Log.error({ path: '/src/menuHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Menu failed to update',
      });
      response.code(500);
      return response;
    }
  };

  delete = async (req, h) => {
    const { id } = req.params;

    try {
      await this.menuRepository.delete(safeInt(id));

      const response = h.response({
        status: 'success',
        message: 'Menu successfully deleted',
      });
      response.code(200);
      return response;
    } catch (err) {
      Log.error({ path: '/src/menuHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Menu failed to deleted',
      });
      response.code(500);
      return response;
    }
  };
}

module.exports = MenuHandler;

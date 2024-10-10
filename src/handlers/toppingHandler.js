const { now, safeInt, slugify } = require('../utils');
const { toppingValidation } = require('../validations/toppingValidation');
const Log = require('../logger');

class ToppingHandler {
  constructor({ toppingRepository }) {
    this.toppingRepository = toppingRepository;
  }

  create = async (req, h) => {
    const { error } = toppingValidation.validate(req.payload);
    if (error) {
      Log.error(
        { path: '/src/toppingHandler.js' },
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

    // Validasi slug
    const existingSlug = await this.toppingRepository.findBySlug(slug);
    
    if (existingSlug) {
      Log.error(
        { path: '/src/toppingHandler.js' },
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
      const newTopping = await this.toppingRepository.save({
        name,
        description,
        price,
        slug,
        categoryId,
        createdAt,
        updatedAt,
      });

      Log.info(`Topping created: ${newTopping.id}`);

      const response = h.response({
        status: 'success',
        message: 'Topping successfully added',
        data: {
          topping: newTopping,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      Log.error({ path: '/src/toppingHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Topping failed added',
      });
      response.code(500);
      return response;
    }
  };

  findById = async (req, h) => {
    const { id } = req.params;
    const topping = await this.toppingRepository.findById(safeInt(id));

    if (topping) {
      return {
        status: 'success',
        data: {
          topping,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Topping not found',
    });
    response.code(404);
    return response;
  };

  findAll = async () => {
    const toppings = await this.toppingRepository.findAll();

    return {
      status: 'success',
      data: {
        toppings,
      },
    };
  };

  update = async (req, h) => {
    const { error } = toppingValidation.validate(req.payload);
    if (error) {
      Log.error(
        { path: '/src/toppingHandler.js' },
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
    const existingTopping = await this.toppingRepository.findById(
      safeInt(id),
    );

    if (!existingTopping) {
      Log.error(
        { path: '/src/toppingHandler.js' },
        `Topping not found: ${id}`,
      );
      const response = h.response({
        status: 'fail',
        message: 'Topping not found.',
      });
      response.code(404);
      return response;
    }

    const {
      name, description, price, categoryId,
    } = req.payload;

    const slug = slugify(name);
    const updatedAt = now;

    // Validasi slug
    const existingSlug = await this.toppingRepository.findBySlug(slug);
    
    if (existingSlug && existingTopping.id !== existingSlug.id) {
      Log.error(
        { path: '/src/toppingHandler.js' },
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
      const updateTopping = await this.toppingRepository.update(
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

      Log.info(`Topping updated: ${updateTopping.id}`);

      const response = h.response({
        status: 'success',
        message: 'Topping successfully updated',
        data: {
          topping: updateTopping,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      Log.error({ path: '/src/toppingHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Topping failed to update',
      });
      response.code(500);
      return response;
    }
  };

  delete = async (req, h) => {
    const { id } = req.params;

    try {
      await this.toppingRepository.delete(safeInt(id));

      const response = h.response({
        status: 'success',
        message: 'Topping successfully deleted',
      });
      response.code(200);
      return response;
    } catch (err) {
      Log.error({ path: '/src/toppingHandler.js' }, err.message);

      const response = h.response({
        status: 'fail',
        message: 'Topping failed to deleted',
      });
      response.code(500);
      return response;
    }
  };
}

module.exports = ToppingHandler;

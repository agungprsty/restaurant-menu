const Joi = require('joi');

const menuValidation = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string(),
  price: Joi.number().required(),
  categoryId: Joi.number().required(),
});

module.exports = { menuValidation };

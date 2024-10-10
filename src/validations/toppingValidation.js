const Joi = require('joi');

const toppingValidation = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  price: Joi.number().required(),
});

module.exports = { toppingValidation };

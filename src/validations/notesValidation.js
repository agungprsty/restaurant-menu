const Joi = require('joi');

const noteValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().min(10).required(),
});

module.exports = { noteValidationSchema };

const Joi = require("joi");

const registrationSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  nationality: Joi.string().required(),
});

const confirmationSchema = Joi.object({
  confirmationCode: Joi.number().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
});

module.exports = { registrationSchema, confirmationSchema, loginSchema };

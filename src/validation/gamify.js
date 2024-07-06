const Joi = require("joi");
const { challengeType } = require("../enums");

const challengeSchema = Joi.object({
  points: Joi.number().integer().required(),
  target: Joi.number().integer().required(),
  description: Joi.string().max(100).required(),
  type: Joi.string().valid(...Object.values(challengeType)).required()
});

const achievementSchema = Joi.object({
    points: Joi.number().integer().required(),
    name: Joi.string().required(),
    description: Joi.string().max(100).required(),
    badge: Joi.string().required()
  });

  const badgetSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().max(100).required(),
    icon: Joi.string().required()
  });

module.exports = { challengeSchema, achievementSchema, badgetSchema };

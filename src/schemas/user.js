import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*\\d)[a-zA-Z0-9!@#$%^&*]{6,30}$")),
  money_balance: Joi.number().required(),
});

export default userSchema;

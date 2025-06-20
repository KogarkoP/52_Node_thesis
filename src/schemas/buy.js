import Joi from "joi";

const buySchema = Joi.object({
  ticketId: Joi.string().required(),
});

export default buySchema;

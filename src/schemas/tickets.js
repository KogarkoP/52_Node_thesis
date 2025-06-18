import Joi from "joi";

const ticketSchema = Joi.object({
  title: Joi.string().required(),
  ticket_price: Joi.number().min(1).required(),
  from_location: Joi.string().required(),
  to_location: Joi.string().required(),
  to_location_photo_url: Joi.string()
    .pattern(new RegExp("^https?://.*\\.(jpg|jpeg|png|gif|webp)$"))
    .required(),
});

export default ticketSchema;

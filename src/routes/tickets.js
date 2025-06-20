import express from "express";
import { INSERT_TICKET, BUY_TICKET } from "../controllers/tickets.js";

import auth from "../middlewares/auth.js";
import validate from "../middlewares/validation.js";
import ticketSchema from "../schemas/tickets.js";
import buySchema from "../schemas/buy.js";

const router = express.Router();

router.post("/", validate(ticketSchema), auth, INSERT_TICKET);
router.post("/buy", validate(buySchema), auth, BUY_TICKET);

export default router;

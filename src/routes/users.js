import express from "express";
import {
  GET_ALL_USERS,
  GET_USER_BY_ID,
  INSERT_USER,
  LOGIN_USER,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controllers/users.js";

import auth from "../middlewares/auth.js";
import validate from "../middlewares/validation.js";
import userSchema from "../schemas/user.js";
import loginSchema from "../schemas/login.js";

const router = express.Router();

router.get("/", auth, GET_ALL_USERS);
router.get("/withTickets", auth, GET_ALL_USERS_WITH_TICKETS);
router.get("/withTickets/:id", auth, GET_USER_BY_ID_WITH_TICKETS);
router.get("/:id", auth, GET_USER_BY_ID);
router.post("/signUp", validate(userSchema), INSERT_USER);
router.post("/login", validate(loginSchema), LOGIN_USER);

export default router;

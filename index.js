import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./src/routes/users.js";
import ticketRouter from "./src/routes/tickets.js";
import "dotenv/config";

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(console.log("Connected to DB!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/users", userRouter);
app.use("/tickets", ticketRouter);

app.use((_req, res) => {
  return res.status(404).json({
    message: "This endpoint does not exist",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});

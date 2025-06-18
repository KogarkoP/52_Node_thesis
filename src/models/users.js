import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    bought_tickets: { type: [], required: true },
    money_balance: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);

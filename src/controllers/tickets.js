import { v4 as uuidv4 } from "uuid";
import ticketModel from "../models/tickets.js";
import userModel from "../models/users.js";

export const INSERT_TICKET = async (req, res) => {
  try {
    const ticket = {
      id: uuidv4(),
      ...req.body,
    };

    const addTicket = new ticketModel(ticket);
    const addedTicket = await addTicket.save();

    return res.status(201).json({
      message: "This ticket was added to archive",
      ticket: addedTicket,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
};

export const BUY_TICKET = async (req, res) => {
  try {
    const userId = req.user.userId;
    const ticketId = req.body.ticketId;

    const user = await userModel.findOne({ id: userId });
    const ticket = await ticketModel.findOne({ id: ticketId });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    } else if (!ticket) {
      return res.status(400).json({
        message: "Ticket not found",
      });
    }

    if (user.money_balance < ticket.ticket_price) {
      return res.status(400).json({
        message: "Insufficient funds",
      });
    }

    const updateUser = await userModel.findOneAndUpdate(
      { id: userId },
      {
        $set: { money_balance: user.money_balance - ticket.ticket_price },
        $push: { bought_tickets: ticketId },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Ticket was purchased successfully",
      user: updateUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
};

import { v4 as uuidv4 } from "uuid";
import userModel from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .sort({ name: "asc" })
      .select("-password -__v -_id");

    return res.status(200).json({
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
};

export const GET_USER_BY_ID = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel
      .findOne({ id: id })
      .select("-password -__v -_id");

    if (!user) {
      return res.status(404).json({
        message: `User with ID: ${id} doesn't exist`,
      });
    }

    return res.status(200).json({
      message: "Here is your requested user",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const usersWithTicket = await userModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "bought_tickets",
        },
      },
      {
        $match: { bought_tickets: { $ne: [] } },
      },
      {
        $project: {
          password: 0,
          _id: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({
      message: "Here are your requested users",
      users: usersWithTicket,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const userId = req.params.id;
    const userWithTicket = await userModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "bought_tickets",
        },
      },
      {
        $match: {
          id: userId,
          bought_tickets: { $ne: [] },
        },
      },
      {
        $project: {
          password: 0,
          _id: 0,
          __v: 0,
        },
      },
    ]);

    if (userWithTicket.length === 0) {
      return res.status(404).json({
        message: "User not found or no tickets bought",
      });
    }

    return res.status(200).json({
      message: "Here is your requested user",
      users: userWithTicket,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const INSERT_USER = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const userName =
      req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

    const user = {
      id: uuidv4(),
      name: userName,
      email: req.body.email,
      password: passwordHash,
      money_balance: req.body.money_balance,
    };

    const addUser = new userModel(user);
    const addedUser = await addUser.save();

    res.status(201).json({
      message: "This user was created",
      user: addedUser,
    });
  } catch (err) {
    console.log(err);
    const DUPLICATE_ERROR_CODE = 11000;
    if (err.code === DUPLICATE_ERROR_CODE) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const LOGIN_USER = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      { userEmail: user.email, userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      {
        userEmail: user.email,
        userId: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      jwt: token,
      refresh: refreshToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const REFRESH_TOKEN = (req, res) => {
  try {
    const token = jwt.sign(
      {
        userEmail: req.user.email,
        userId: req.user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).json({
      message: "Token was updated",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

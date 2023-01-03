import User from "../models/user.js";
import Order from "../models/order.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password must be at least 6 chanracters long",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ error: "Email is taken" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    // signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: {
        name: user.name,
        email: user.email,
        roll: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password must be at least 6 chanracters long",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.json({ error: "Wrong password" });
    }
    // signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: {
        name: user.name,
        email: user.email,
        roll: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, password, address } = req.body;
    const user = await User.findById(req.user._id);
    // pass length
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be min 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updated = await User.findByIdAndUpdate(req.user._id, {
      name: name || user.name,
      password: hashedPassword || user.password,
      address: address || user.address,
    }, {new: true});

    updated.password = undefined;
    res.json(updated)

  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (err) {
    console.log(err);
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (err) {
    console.log(err);
  }
};

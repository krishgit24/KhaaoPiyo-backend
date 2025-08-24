import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sendToken = (res, user) => {
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });
  const user = await User.create({ name, email, password });
  sendToken(res, user);
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  sendToken(res, user);
  res.json({ id: user._id, name: user.name, email: user.email });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

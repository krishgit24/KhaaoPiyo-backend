import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sendToken = (res, user) => {
  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return token; // <-- return token for frontend
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });

  const user = await User.create({ name, email, password });
  const token = sendToken(res, user);

  // Include token in JSON response
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = sendToken(res, user);

  // Include token in JSON response
  res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

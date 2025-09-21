import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Creates a JWT for a given user.
 */
const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Sets the authentication token as a secure, httpOnly cookie on the response.
 */
const sendTokenCookie = (res, user) => {
  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Responds with user data, omitting the password.
 */
const getSanitizedUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  points: user.points,
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email is already in use." });

    const user = await User.create({ name, email, password });
    sendTokenCookie(res, user);

    res.status(201).json({ user: getSanitizedUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    sendTokenCookie(res, user);

    res.status(200).json({ user: getSanitizedUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully." });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  res.status(200).json({ user: getSanitizedUser(user) });
};

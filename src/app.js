import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import foodRoutes from "./routes/food.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json()); // <-- This is required!
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.get("/", (req, res) => res.json({ ok: true, service: "KhaaoPiyo API" }));

app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

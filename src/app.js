import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import foodRoutes from "./routes/food.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"]
  }
});

// Attach io to app for use in routes
app.set("io", io);

const allowedOrigins = [process.env.CLIENT_ORIGIN, 'http://localhost:5173'];

app.use(morgan("dev"));
app.use(express.json()); // <-- This is required!
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE'],
  credentials: true
}));

app.get("/", (req, res) => res.json({ ok: true, service: "KhaaoPiyo API" }));

app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

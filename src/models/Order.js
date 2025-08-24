import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
      quantity: { type: Number, required: true },
    }
  ],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  name: { type: String, required: true },
  paymentMode: { type: String, required: true }, // "COD", "UPI", "Card"
  status: { type: String, default: "Preparing" }, // "Preparing", "Out for delivery", "Delivered"
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);
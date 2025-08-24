import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    desc: { type: String, default: "" },
    category: { type: String, default: "other" }, // burger, pizza, sandwich, pasta, fries, shake, dessert, beverage, sides
    tags: [{ type: String }],
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Food", FoodSchema);

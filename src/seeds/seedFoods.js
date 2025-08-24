import "dotenv/config";
import mongoose from "mongoose";
import Food from "../models/Food.js";

// Keywords for search
const keywords = [
  "burger",
  "pizza",
  "sandwich",
  "fries",
  "bread",
  "pasta",
  "chocolate",
  "shake",
];

const normalize = (meal) => ({
  title: meal.strMeal,
  price: Math.floor(Math.random() * 200) + 100, // random price
  image: meal.strMealThumb,
  desc: meal.strInstructions?.slice(0, 80) + "...",
  category: meal.strCategory || "Fast Food",
  tags: [],
  isAvailable: true,
});

const fetchMeals = async () => {
  const allData = await Promise.all(
    keywords.map(async (kw) => {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${kw}`);
      const data = await res.json();
      return data.meals ? data.meals.map(normalize) : [];
    })
  );
  return allData.flat();
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Food.deleteMany({});
  const foods = await fetchMeals();
  await Food.insertMany(foods);
  console.log(`✅ Seeded ${foods.length} foods from TheMealDB`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });

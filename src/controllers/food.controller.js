import Food from "../models/Food.js";

// GET /api/foods?search=&category=&min=&max=&sort=&page=&limit=
export const getFoods = async (req, res) => {
  const {
    search = "",
    category,
    min,
    max,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 24
  } = req.query;

  const filter = { isAvailable: true };
  if (search) filter.title = { $regex: search, $options: "i" };
  if (category && category !== "all") filter.category = category;
  if (min || max) filter.price = { ...(min && { $gte: Number(min) }), ...(max && { $lte: Number(max) }) };

  const sortObj = { [sort]: order === "asc" ? 1 : -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Food.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Food.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  });
};

export const getFoodById = async (req, res) => {
  const item = await Food.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Food not found" });
  res.json(item);
};

// Admin-ish (optional)
export const createFood = async (req, res) => {
  const item = await Food.create(req.body);
  res.status(201).json(item);
};
export const updateFood = async (req, res) => {
  const item = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: "Food not found" });
  res.json(item);
};
export const deleteFood = async (req, res) => {
  const ok = await Food.findByIdAndDelete(req.params.id);
  if (!ok) return res.status(404).json({ message: "Food not found" });
  res.json({ message: "Deleted" });
};

export const getCategories = async (req, res) => {
  const cats = await Food.distinct("category");
  res.json(cats.sort());
};

import { Router } from "express";
import {
  getFoods, getFoodById, createFood, updateFood, deleteFood, getCategories
} from "../controllers/food.controller.js";
// import { requireAuth } from "../middleware/auth.js"; // for protected mutations if needed

const router = Router();

router.get("/", getFoods);
router.get("/categories", getCategories);
router.get("/:id", getFoodById);

// Optionally protect these with requireAuth (admin)
// router.post("/", requireAuth, createFood);
// router.patch("/:id", requireAuth, updateFood);
// router.delete("/:id", requireAuth, deleteFood);
router.post("/", createFood);
router.patch("/:id", updateFood);
router.delete("/:id", deleteFood);

export default router;

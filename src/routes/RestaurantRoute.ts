import express from "express";
import { param } from "express-validator";
import { searchRestaurants } from "../controllers/RestaurantController";

const router = express.Router();

// api/restaurant/search/london

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string."),
  searchRestaurants
);

export default router;

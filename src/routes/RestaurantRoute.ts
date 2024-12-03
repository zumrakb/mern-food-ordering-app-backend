import express from "express";
import { param } from "express-validator";
import {
  getRestaurant,
  searchRestaurant,
} from "../controllers/RestaurantController";

const router = express.Router();

// api/restaurant/search/london

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string."),
  searchRestaurant
);

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId parameter must be a valid string."),
  getRestaurant
);

export default router;

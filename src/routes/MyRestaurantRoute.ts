import express from "express";
import multer from "multer";
import {
  createMyRestaurant,
  getMyRestaurant,
  getMyRestaurantOrders,
  updateMyRestaurant,
  updateOrderStatus,
} from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, //5 mb
  },
});

router.get("/order", jwtCheck, jwtParse, getMyRestaurantOrders);

router.patch("/order/:orderId/status", jwtCheck, jwtParse, updateOrderStatus);

router.get("/", jwtCheck, jwtParse, getMyRestaurant);

// /api/my/restaurant
router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  createMyRestaurant
);
//upload.single("imageFile") => this middlevare do=> anytime we have post request api my restaurant route, it gonna check req body for a proptery called imageFile

router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateMyRestaurant
);

export default router;

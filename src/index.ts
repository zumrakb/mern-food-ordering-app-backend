import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import { v2 as cloudinary } from "cloudinary";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

/* connecting to database */
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to database! 🎉");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json({ limit: "10mb" })); // Set request body size limit to 10MB
//middleware: automatically convert request body to json.
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

// /api/my/user => whenever user makes a post request to this route, this line will run.
app.use("/api/my/user", myUserRoute); //creating user route api
app.use("/api/my/restaurant", myRestaurantRoute); //creating restaurant route api
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});

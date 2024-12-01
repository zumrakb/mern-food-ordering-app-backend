import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const getMyRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error getting restaurant" });
  }
};
export const createMyRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Check if the restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res.status(409).json({ message: "Restaurant already exists." });
    }

    // Ensure an image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    /* const image = req.file as Express.Multer.File; */

    // Convert file buffer to base64
    /*   const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`; */

    // Upload to Cloudinary using the data URI
    /* const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "restaurants",
    }); */

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    // Create a new restaurant instance
    const restaurant = new Restaurant({
      ...req.body,
      imageUrl: imageUrl,
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    // Save the restaurant to the database
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Error creating restaurant." });
  }
};

export const updateMyRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;

  // Convert file buffer to base64
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  // Upload to Cloudinary using the data URI
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
    folder: "restaurants",
  });
  return uploadResponse.url;
};

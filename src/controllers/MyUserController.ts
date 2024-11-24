import { Request, Response } from "express";
import User from "../models/user";

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error getting user" });
  }
};

export const createCurrentUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateCurrentUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, addressLine1, city, country } = req.body; //these properties will be sent to our frontend form.
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); //if user is not exist.
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save(); //after updating all fields, save it do the DB.

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

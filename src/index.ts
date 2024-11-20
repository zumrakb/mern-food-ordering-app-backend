import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

/* connecting to database */
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to database! 🎉");
});

const app = express();
app.use(express.json()); //middleware: automatically convert request body to json.
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.listen(7000, () => {
  console.log("Server is running on port 3000");
});

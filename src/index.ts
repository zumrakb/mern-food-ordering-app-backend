import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

/* connecting to database */
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to database! 🎉");
});

const app = express();
app.use(express.json()); //middleware: automatically convert request body to json.
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

// /api/my/user => whenever user makes a post request to this route, this line will run.
app.use("/api/my/user", myUserRoute); //creating user route api

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});

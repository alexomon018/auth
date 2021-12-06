import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import desirilazeUser from "./middleware/desirilazeUser.js";
const app = express();
dotenv.config();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(desirilazeUser);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

//routes
app.use("/users", userRoutes);
app.get("/", (req, res) => res.send("Go to /users/login to log in"));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

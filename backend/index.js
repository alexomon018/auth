import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import desirilazeUser from "./middleware/desirilazeUser.js";
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(desirilazeUser);
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

//routes
app.use("/users", userRoutes);
app.use("/movies", moviesRoutes);
app.get("/", (req, res) => res.send("Go to /users/login to log in"));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

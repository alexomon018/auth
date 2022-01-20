import express from "express";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import useragent from "express-useragent";
import { fileURLToPath } from "url";
import connectMongoDB from "./DBs/mongoConnect.js";
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware
app.use(useragent.express());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://3.89.228.148:3000",
      "http://3.89.228.148:3001",
      "http://192.168.0.104:3001",
    ],
  })
);

async function init() {
  //connect to mongoDB
  await connectMongoDB();
  //routes
  app.use("/auth", authRoutes);
  app.use("/movies", moviesRoutes);
  app.get("/", (req, res) => {
    res.send("go to /auth/signup or /auth/login");
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
}

init();

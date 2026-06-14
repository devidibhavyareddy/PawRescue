import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import animalRoutes from "./routes/animalRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import updateRoutes from "./routes/updateRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();
  
app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PawRescue API Running...");
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/animals",
  animalRoutes
);

app.use(
  "/api/adoptions",
  adoptionRoutes
);

app.use(
  "/api/updates",
  updateRoutes
);

app.use(
  "/api/favorites",
  favoriteRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

const PORT =
  process.env.PORT || 5000;

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

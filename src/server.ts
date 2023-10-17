require("dotenv").config({ path: ".env" });
import express, { Express, json } from "express";
import cors from "cors";
import morgan from "morgan";
const app: Express = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(json());
app.use(morgan("dev"));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`Sever is live on: http://localhost:${PORT}/`)
);

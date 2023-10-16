require("dotenv").config({ path: ".env.local" });
import express, { Express, Request, Response, json } from "express";
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

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello!",
  });
});

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));

if (process.env.NODE_ENV === "local") {
  const PORT = 8080;
  app.listen(PORT, () =>
    console.log(`Sever is live on: http://localhost:${PORT}/`)
  );
}

import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//DATABASE
import connectDB from "./db/connect.js";

//routes
import authRouter from "./routes/authRoute.js";
import jobRouter from "./routes/jobRoute.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticatedUser from "./middleware/auth.js";

//extra middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());
//security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//while es6 it's important to have dirname
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./client/build")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticatedUser, jobRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();

import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import Job from "./model/Job.js";
dotenv.config();
import { readFile } from "fs/promises";
import { URL } from "url";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    // await Job.deleteMany();
    const jsonProducts = JSON.parse(
      await readFile(new URL("./mock_data.json", import.meta.url))
    );
    await Job.create(jsonProducts);
    console.log("Success...");
    process.exit(0);
  } catch (error) {
    // console.log(error);
    process.exit(1);
  }
};

start();

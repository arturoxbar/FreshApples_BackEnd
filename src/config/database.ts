import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const url: string = process.env.CONNECTION_STRING;

mongoose.connect(url);

const mongo = mongoose.connection;

export default mongo;

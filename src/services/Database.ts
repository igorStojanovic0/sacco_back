import mongoose from "mongoose";
import { MONGODB_CONNECTION_STRING } from "../config";

export default async () => {
    mongoose
        .connect(MONGODB_CONNECTION_STRING as string)
        .then(() => console.log('Connected to database!'));
}
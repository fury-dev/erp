import mongoose, { Mongoose } from "mongoose";

export const initializeMongo = (uri?: string): Promise<typeof mongoose> => {
  const mongoUri = process.env?.MONGO_URI || uri;
  if (!mongoUri) {
    throw new Error("Mongo uri not defined");
  }
  try {
    const db = mongoose.connect(mongoUri!);
    console.log("DB connected");
    return db;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

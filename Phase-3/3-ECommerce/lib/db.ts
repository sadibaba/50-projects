import mongoose from "mongoose";

interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

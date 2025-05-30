import { Router } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const uri = process.env.VITE_ATLAS_URI;
const client = new MongoClient(uri);
let db;

async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("myAppDB");
      console.log("MongoDB bağlantısı (sections.js) kuruldu");
    } catch (err) {
      console.error("MongoDB bağlantısı başarısız:", err);
      throw err;
    }
  }
  return db;
}

export default sectionRoutes;

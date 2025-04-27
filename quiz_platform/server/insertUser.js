import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" });

const uri = process.env.ATLAS_URI
const client = new MongoClient(uri);

export async function insertNewUser() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("QuizPlatformDB");
    const coll = db.collection("Users");

    // insert code goes here
    const docs = [
      {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
      {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
      {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12}
    ];

    const result = await coll.insertMany(docs);

    // display the results of your operation
    console.log(result.insertedIds);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const router = express.Router();

// MongoDB bağlantısı
const uri = process.env.VITE_ATLAS_URI;
const client = new MongoClient(uri);
let db; 

async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('myAppDB');
      console.log('MongoDB bağlantısı kuruldu');
    } catch (err) {
      console.error('MongoDB bağlantısı başarısız:', err);
      throw err;
    }
  }
  return db;
}

// Kullanıcı ekleme
router.post('/create-user', async (req, res) => {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  const { uid, name, surname, birthdate, email , avatar_url = "/avatars/avatar_" + randomNumber + ".jpg", nickname = ""} = req.body;

  const user = {
    userID: uid,
    name,
    surname,
    birthdate,
    email,
    createdDate: new Date(),
    avatar_url,
    nickname
  };

  try {
    const db = await connectToMongo();
    const users = db.collection('users');

    const result = await users.insertOne(user);
    res.status(200).json({ message: 'Kullanıcı MongoDB\'ye eklendi', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Kullanıcıyı UID ile bulma
router.post('/find-user', async (req, res) => {
  const { uid } = req.body;

  try {
    const db = await connectToMongo();
    const users = db.collection('users');

    const user = await users.findOne({ userID: uid });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

export default router;

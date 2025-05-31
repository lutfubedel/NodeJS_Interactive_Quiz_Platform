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

// Bugunun tarihini "31/05/2025" formatında verir.
function getFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Aylar 0-indexli
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
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


// Soru bankası oluşturma route'u
router.post('/create-questionBank', async (req, res) => {
  const { uid, title, subtitle } = req.body;

  const QBank = {
    userID: uid,
    title,
    subtitle,
    createdDate: getFormattedDate(),
  };

  try {
    const db = await connectToMongo();
    const banks = db.collection('question-bank');

    const result = await banks.insertOne(QBank);
    res.status(200).json({ message: 'Soru bankası MongoDB\'ye eklendi', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});


export default router;

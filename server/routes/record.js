import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import express from 'express';;
import { ObjectId } from 'mongodb';

dotenv.config();
const router = express.Router();

// MongoDB bağlantısı
const uri = process.env.VITE_ATLAS_URI;
const client = new MongoClient(uri);
let db; 

// MondoDB veritabanına bağlan
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
  const { uid, title, subtitle , creator} = req.body;

  const QBank = {
    userID: uid,
    title,
    subtitle,
    createdDate: getFormattedDate(),
    creator,
    questions: []
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

// Soru bankalarını listeleme route'u
router.post('/list-questionBanks', async (req, res) => {
  const { uid } = req.body;

  try {
    const db = await connectToMongo();
    const banks = db.collection('question-bank');

    const result = await banks.find({ userID: uid }).sort({ createdDate: -1 }).toArray();

    res.status(200).json({ questionBanks: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Soru ekleme route'u
router.post('/add-question', async (req, res) => {
  const { bankId, question } = req.body;

  if (!bankId || !question) {
    return res.status(400).json({ message: "Eksik veri gönderildi." });
  }

  try {
    const db = await connectToMongo();
    const banks = db.collection('question-bank');

    const result = await banks.updateOne(
      { _id: new ObjectId(bankId) }, 
      { $push: { questions: question } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Soru başarıyla eklendi." });
    } else {
      res.status(404).json({ message: "Soru bankası bulunamadı." });
    }
  } catch (err) {
    console.error("add-question hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Soru bankasını silme route'u (POST ile)
router.post('/delete-bank', async (req, res) => {
  const { bankId } = req.body;

  if (!bankId) {
    return res.status(400).json({ message: "Eksik bankId verisi." });
  }

  try {
    const db = await connectToMongo();
    const banks = db.collection('question-bank');

    const result = await banks.deleteOne({ _id: new ObjectId(bankId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Soru bankası başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Soru bankası bulunamadı." });
    }
  } catch (err) {
    console.error("delete-bank hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Tüm soruları listler
router.post('/get-questions', async (req, res) => {
  const { bankId } = req.body;

  if (!bankId) {
    return res.status(400).json({ message: "Eksik bankId verisi." });
  }

  try {
    const db = await connectToMongo();
    const banks = db.collection('question-bank');

    const bank = await banks.findOne({ _id: new ObjectId(bankId) });

    if (!bank) {
      return res.status(404).json({ message: "Soru bankası bulunamadı." });
    }

    // Sadece questions dizisini döndür
    res.status(200).json({ questions: bank.questions || [] });
  } catch (err) {
    console.error("get-questions hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Belirtilen metne göre soruyu siler
router.post('/delete-question', async (req, res) => {
  const { bankId, questionText } = req.body;

  if (!bankId || !questionText) {
    return res.status(400).json({ message: "Eksik veri gönderildi (bankId veya questionText)." });
  }

  try {
    const db = await connectToMongo();
    const banks = db.collection('question-bank');

    const result = await banks.updateOne(
      { _id: new ObjectId(bankId) },
      { $pull: { questions: { question: questionText } } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Soru başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Soru veya soru bankası bulunamadı." });
    }
  } catch (err) {
    console.error("delete-question hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});






export default router;

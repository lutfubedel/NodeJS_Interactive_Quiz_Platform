import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

describe('MongoDB bağlantısı', () => {
  it('bağlantı başarılı olmalı', async () => {
    const URI = process.env.ATLAS_URI;
    const client = new MongoClient(URI, {
      serverApi: ServerApiVersion.v1,
    });

    try {
      await client.connect();
      const result = await client.db('admin').command({ ping: 1 });
      expect(result.ok).toBe(1);
    } catch (err) {
      throw new Error("MongoDB bağlantı hatası: " + err.message);
    } finally {
      await client.close();
    }
  });
});

//merhaba
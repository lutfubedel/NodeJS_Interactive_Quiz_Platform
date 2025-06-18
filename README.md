# 🎯 Interactive Quiz Platform

Gerçek zamanlı, çevrimiçi quiz oturumları oluşturabileceğiniz, katılımcıların canlı olarak soruları cevapladığı, öğretmenler ve öğrenciler için geliştirilmiş modern bir quiz platformu.

## 📽️ Demo

👉 [YouTube Tanıtımı](https://youtu.be/OYiS9JH2Bmo?si=lXIV7bDqpjoGXOC4)

## 🚀 Özellikler

- 🔐 Firebase Authentication ile güvenli kullanıcı girişi
- 🧠 Quiz oluşturma ve yönetimi
- 📡 Socket.IO ile gerçek zamanlı quiz oturumları
- 📊 Her sorudan sonra canlı puan durumu (scoreboard)
- 🧾 Quiz geçmişi takibi
- 🗃️ Soru bankası
- 🖼️ Resim ve video destekli soru oluşturma (Cloudinary entegrasyonu)
- 📱 Mobil uyumlu kullanıcı arayüzü (Tailwind CSS ile)
- 🛠️ Admin paneli ile kullanıcı ve quiz istatistikleri

## 🛠️ Kullanılan Teknolojiler

| Alan             | Teknoloji            |
|------------------|----------------------|
| Backend          | Node.js, Express.js  |
| Frontend         | React.js, Tailwind CSS |
| Gerçek Zamanlı   | Socket.IO            |
| Veritabanı       | MongoDB              |
| Medya Depolama   | Cloudinary           |
| Kimlik Doğrulama | Firebase Authentication |
| Versiyon Kontrol | Git & GitHub         |

## 📂 Kurulum

```bash
# Backend klasörüne girin
cd server
npm install
npm run dev

# Frontend klasörüne girin
cd client
npm install
npm start
```

`.env` dosyanıza aşağıdaki gibi değişkenleri tanımlamayı unutmayın:

```env
VITE_ATLAS_URI=your_mongodb_uri
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

## 👨‍💻 Ekip

- **Ahmet Yusuf Birdir** – React.js arayüz geliştirme
- **Lütfü Bedel** – Express.js backend ve API geliştirme
- **Yusuf Balmumcu** – Socket.IO ile canlı quiz entegrasyonu


## 📚 Kaynakça

- [Firebase Authentication](https://firebase.google.com/docs/auth?hl=tr)  
- [Socket.IO](https://socket.io/docs/v4/)  
- [MongoDB](https://www.mongodb.com/docs/languages/javascript/)  
- [Cloudinary](https://cloudinary.com/documentation)  
- [React](https://react.dev/)  
- [Tailwind CSS](https://tailwindcss.com/docs/styling-with-utility-classes)  
- [Tailwind UI Blocks](https://tailwindcss.com/plus/ui-blocks/application-ui/forms/sign-in-forms)  
- [Kahoot!](https://kahoot.com/?lang=tr)

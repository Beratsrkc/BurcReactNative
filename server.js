import express from "express"
import { ENV } from "./config/env.js";
import connectDB from "./config/mongodb.js";
import burcRouter from "./routes/burcRoutes.js";
import { autoFetchAllBurcData } from "./controllers/burcController.js";
import job from './config/cron.js';
const app = express();
const PORT = ENV.PORT || 5001

if (ENV.NODE_ENV==="production") job.start();

app.use(express.json())


// MongoDB'ye bağlan
await connectDB();

// Sunucu başladığında otomatik olarak burç verilerini çek
console.log("Sunucu başlatılıyor, burç verileri otomatik çekilecek...");
await autoFetchAllBurcData();

// Her gün otomatik çekme için zamanlayıcı (opsiyonel)
// Her gün saat 00:01'de otomatik çalıştır
setInterval(async () => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 1) {
    console.log("Günlük otomatik burç verisi çekme zamanı...");
    await autoFetchAllBurcData();
  }
}, 60000); // Her dakika kontrol et

app.use("/api/data", burcRouter);

app.get("/", (req, res) => {
  res.send("Burç API'si başarıyla çalışıyor");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
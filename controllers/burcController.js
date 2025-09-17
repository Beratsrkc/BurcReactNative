import Burc from "../models/burc.js";
import { ENV } from "../config/env.js";
import axios from "axios";

// Tüm burçların listesi
const ALL_BURCLAR = [
  'koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
  'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'
];

// Tek bir burç verisini çekme fonksiyonu
const fetchBurcData = async (burcAdi) => {
  try {
    console.log(`${burcAdi} burcu verisi çekiliyor...`);
    const response = await axios.get(`https://toktasoft.com/api/burclar?api_key=${ENV.api_key}&burc=${burcAdi}`);
    
    // API yanıtını kontrol et
    if (response.data && response.data.result) {
      console.log(`${burcAdi} burcu verisi başarıyla çekildi`);
      return response.data.result;
    } else {
      console.log(`${burcAdi} burcu için veri bulunamadı`);
      return null;
    }
  } catch (error) {
    console.error(`${burcAdi} burcu verisi çekilemedi:`, error.message);
    return null;
  }
};

// Tüm burçları otomatik çekip kaydetme fonksiyonu
export const autoFetchAllBurcData = async () => {
  try {
    console.log("=== BURÇ VERİLERİ OTOMATİK ÇEKİLİYOR ===");
    
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Tüm burçlar için sırayla işlem yap
    for (const burcAdi of ALL_BURCLAR) {
      try {
        // Önce bu burcun bugünkü verisi var mı kontrol et
        const existingRecord = await Burc.findOne({
          burc: burcAdi,
          tarih: today,
          tip: 'gunluk'
        });

        if (existingRecord) {
          console.log(`${burcAdi} burcunun bugünkü verisi zaten mevcut (atlanıyor)`);
          skipCount++;
          continue;
        }

        // Veriyi çek
        const burcData = await fetchBurcData(burcAdi);
        
        if (burcData) {
          // Veritabanına kaydet
          await Burc.create(burcData);
          console.log(`${burcAdi} burcu verisi başarıyla kaydedildi`);
          successCount++;
        } else {
          console.log(`${burcAdi} burcu verisi kaydedilemedi`);
          errorCount++;
        }

        // API'ye aşırı yüklenmemek için kısa bekleme (1 saniye)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`${burcAdi} burcu işlenirken hata:`, error.message);
        errorCount++;
      }
    }

    console.log("=== OTOMATİK ÇEKME İŞLEMİ TAMAMLANDI ===");
    console.log(`Başarılı: ${successCount}, Atlanan: ${skipCount}, Hatalı: ${errorCount}`);

    return {
      success: true,
      message: `Otomatik çekme tamamlandı. Başarılı: ${successCount}, Atlanan: ${skipCount}, Hatalı: ${errorCount}`,
      counts: { success: successCount, skip: skipCount, error: errorCount }
    };

  } catch (error) {
    console.error("Otomatik çekme işlemi sırasında hata:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
};
export const getAllBurcDataForFrontend = async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    // Belirtilen tarihteki tüm burç verilerini getir
    const burcData = await Burc.find({
      tarih: date,
      tip: 'gunluk'
    }).sort({ burc: 1 }); // Burç adına göre sırala

    res.json({
      success: true,
      message: 'Burç verileri başarıyla getirildi',
      data: burcData
    });
  } catch (error) {
    console.error('Frontend veri çekme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Manuel tetikleme için endpoint
export const getAllBurcData = async (req, res) => {
  try {
    const result = await autoFetchAllBurcData();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tek bir burç verisi çekme
export const getBurc = async (req, res) => {
  try {
    const { burc } = req.params;
    const burcAdi = burc || 'oglak';
    
    const response = await axios.get(`https://toktasoft.com/api/burclar?api_key=${ENV.api_key}&burc=${burcAdi}`);
    const apiData = response.data;
    const burcData = apiData.result;

    // Mevcut kaydı kontrol et
    const existingRecord = await Burc.findOne({
      burc: burcData.burc,
      tarih: burcData.tarih,
      tip: burcData.tip
    });

    if (existingRecord) {
      return res.json({ 
        success: true, 
        message: "Bu burç verisi zaten kayıtlı", 
        data: existingRecord 
      });
    }

    // Yeni kayıt oluştur
    const newBurc = await Burc.create(burcData);
    res.json({ 
      success: true, 
      message: "Burç verisi başarıyla eklendi", 
      data: newBurc 
    });
  } catch (error) {
    console.log("Hata Detayı:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB= async ()=>{
    try {
        await mongoose.connect(`${ENV.MONGO_URI}`)
        console.log("MongoDB'ye bağlandı");
    } catch (error) {
        console.log("MongoDB'ye bağlanılamadı!!! ",error);
    }
    
}

/*
"status": 200,
    "monthly_request_count": 2,
    "result": {
        "burc": "oglak",
        "tip": "gunluk",
        "tarih": "2025-09-17",
        "hafta_numarasi": "38",
        "ay_numarasi": "9",
        "yil": "2025",
        "yorum": "Sorumluluklar üstünde durmak, planlarını gözden geçirmek için harika bir fırsat. İçsel motivasyonun yüksek, hedeflerin için atılacak adımlar pek çok açıdan fayda sağlayacak. İletişim kurarken net olmaya özen göster, bu tür durumlar ileride karşına çıkabilecek belirsizlikler için önemli olacak. Çevrendeki insanlarla olan ilişkilerin, işbirliklerinin derinleşeceği bir dönemdesin. Kendine güven, içindeki potansiyeli daha iyi kullanma şansın var. Küçük başarılar, seni daha büyük hedeflerine yaklaştıracak. Duygusal anlamda kendini ifade etme konusunda cesaretli ol, hissettiklerini paylaşmak, ilişkilerini güçlendirebilir. Zamanını iyi yönetmek, önceliklerini belirlemek, yaratıcılığını ön plana çıkaracak.",
        "resim_url": "https://toktasoft.com/api/api-resources/burclar/oglak.png"
    },
    "error": null
     */
export default connectDB;
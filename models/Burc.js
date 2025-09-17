// models/burc.js
import mongoose from "mongoose";

const burcSchema = new mongoose.Schema({
  burc: { type: String, required: true },
  tip: { type: String, required: true },
  tarih: { type: String, required: true },
  hafta_numarasi: { type: String, required: true },
  ay_numarasi: { type: String, required: true },
  yil: { type: String, required: true },
  yorum: { type: String, required: true },
  resim_url: { type: String }
}, {
  timestamps: true
});

// Burada 'burc' kullanın (küçük harfle)
const Burc = mongoose.models.burc || mongoose.model('burc', burcSchema);

export default Burc;
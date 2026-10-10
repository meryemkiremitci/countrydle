<<<<<<< HEAD
# Countrydle 🌍

Ülke temalı Wordle. Gizli ülkeyi 6 denemede bul. Yapay zekâ hakem (Gemini), yanlış yazılan ülkeleri tanıyıp
"Sanırım şunu demek istedin" der ve temadan alakasız kelimeleri hak düşürmeden reddeder. Her tahmin haritada
işaretlenir ve gizli ülkeye olan mesafe, yön ve yakınlık gösterilir.

## Nasıl çalışır?

Bir tahmin şu sırayla kontrol edilir (`src/lib/checkGuess.js`):

1. **Tam eşleşme:** `CHILE` gibi geçerli bir ülkeyse doğrudan kabul edilir.
2. **Alternatif isim:** Türkçe veya resmi isimler (`MISIR` → Egypt, `BURMA` → Myanmar) yerelde tanınır.
3. **Basit yazım hatası:** Tek harf farkı (`JAPAM` → Japan) yerelde düzeltilir.
4. **Gemini:** Yukarıdakiler karar veremezse `/api/check` üzerinden Gemini'ye sorulur. Cevap, gerçek ülke
   isimlerinden oluşan bir listeyle sınırlıdır, yani model ülke uyduramaz.
5. **Gemini'ye ulaşılamazsa** (key yok, kota dolu): oyun daha esnek bir yerel eşleştirmeyle devam eder.

Harf renklendirme ve mesafe hesabı her zaman kodda yapılır, LLM'e bırakılmaz.

## Yerelde çalıştırma

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# .env dosyasına GEMINI_API_KEY'i yaz (https://aistudio.google.com/apikey)
npm run dev
```

Tarayıcıda http://localhost:5173 adresini aç. Key olmadan da oyun çalışır, sadece Gemini kontrolü yerine yerel kontrol kullanılır.

## Yayınlama (Vercel, ücretsiz)

1. Projeyi GitHub'a yükle.
2. [vercel.com](https://vercel.com)'a GitHub hesabınla gir → **Add New → Project** → bu repoyu seç.
   Vite projesi otomatik tanınır, ayar değiştirmene gerek yok.
3. **Environment Variables** kısmına `GEMINI_API_KEY` ekle → **Deploy**.
4. Çıkan `xxx.vercel.app` adresini paylaş. Sonraki her `git push` otomatik olarak yayına girer.

## Proje yapısı

```
api/check.js              Gemini'yi çağıran sunucu fonksiyonu (key burada gizli kalır)
api/_countries.js         Ülke isimleri listesi (otomatik üretilir)
src/data/countries.json   Ülke verisi (otomatik üretilir)
src/lib/checkGuess.js     Tahmin kontrol akışı (yerel → Gemini → yedek)
src/lib/countries.js      Ülke arama, alternatif isimler, yazım hatası eşleştirme
src/lib/game.js           Wordle renklendirme, mesafe/yön/yakınlık
src/components/           Tahta, klavye, harita, bilgi kartı, diyaloglar
scripts/build-countries.mjs  Ülke verisini yeniden üretir: npm run build:countries
```

Veri kaynakları: [mledoze/countries](https://github.com/mledoze/countries) (ODbL), Dünya Bankası (nüfus),
[world-atlas](https://github.com/topojson/world-atlas) / Natural Earth (sınırlar), harita © OpenStreetMap & CARTO.
=======
# countrydle-
Country-themed Wordle with an AI referee: guess a country in 6 tries, get distance, direction and proximity hints, and see each country on a map.
>>>>>>> 139197154e714e36b58659b3e7cfa622c521db0a

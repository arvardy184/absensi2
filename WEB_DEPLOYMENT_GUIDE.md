# 🌐 Panduan Deploy Aplikasi Absensi ke Web

## ✅ Yang Sudah Dikerjakan

### 1. **Setup Web Dependencies**
- ✅ Installed `@expo/webpack-config`, `react-dom@18.2.0`, `react-native-web`
- ✅ Installed `serve` untuk testing local build

### 2. **Konfigurasi Web Lengkap**
- ✅ Updated `app.json` dengan PWA configuration
- ✅ Ditambahkan manifest settings untuk Progressive Web App
- ✅ Konfigurasi theme color, display mode, dan orientasi

### 3. **Webpack Optimization**
- ✅ Created custom `webpack.config.js` untuk optimasi build
- ✅ Bundle splitting untuk vendor dan Supabase packages
- ✅ Source maps untuk production debugging
- ✅ Babel loader configuration

### 4. **Build Scripts**
- ✅ Added web build dan serve commands ke `package.json`:
  - `npm run web` - Development server
  - `npm run web:build` - Production build
  - `npm run web:serve` - Serve production build locally
  - `npm run web:dev` - Development dengan dev client

## 🚀 Cara Menjalankan di Web

### Development Mode
```bash
npm run web
```
Aplikasi akan buka di browser secara otomatis di `http://localhost:19006`

### Production Build
```bash
# Build untuk production
npm run web:build

# Test production build secara local
npm run web:serve
```

## 📱 Fitur Web yang Tersedia

### ✅ **Fully Compatible Features**
- ✅ **Role Selection** - Pilihan masuk sebagai Mahasiswa/Admin
- ✅ **Student Authentication** - Login dan registrasi mahasiswa
- ✅ **Admin Authentication** - Login admin dengan kredensial default
- ✅ **Attendance System** - Absensi harian dengan status dan alasan
- ✅ **History Tracking** - Riwayat absensi mahasiswa
- ✅ **Data Import/Export** - Upload dan download file JSON
- ✅ **Admin Dashboard** - Dashboard admin dengan recap data
- ✅ **Responsive Design** - Otomatis adaptif untuk desktop dan mobile
- ✅ **Supabase Integration** - Database cloud yang web-compatible

### 🎨 **PWA Features**
- ✅ **Installable** - Bisa di-install sebagai app di desktop/mobile
- ✅ **Offline Ready** - Basic caching untuk assets
- ✅ **Responsive** - Responsive design untuk semua screen size
- ✅ **Native Feel** - Look and feel seperti native app

## 🌍 Deployment Options

### 1. **Netlify (Recommended)**
```bash
# Build production
npm run web:build

# Upload folder 'web-build' ke Netlify
# Atau connect dengan Git repository
```

### 2. **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. **GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "expo export --platform web && gh-pages -d web-build"

# Deploy
npm run deploy
```

### 4. **Firebase Hosting**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Init Firebase
firebase init hosting

# Build dan deploy
npm run web:build
firebase deploy
```

## 📋 Checklist Pre-Deployment

- [ ] **Supabase Setup**: Pastikan database Supabase sudah setup (lihat `MIGRATION_SUMMARY.md`)
- [ ] **Environment Variables**: Set API keys untuk production
- [ ] **Domain Configuration**: Update CORS settings di Supabase untuk domain production
- [ ] **PWA Icons**: Pastikan semua icon sizes tersedia di folder `assets/`
- [ ] **Analytics**: Setup Google Analytics atau tracking lainnya (opsional)

## 🔧 Konfigurasi Production

### Environment Variables
Buat file `.env.production` atau set di hosting platform:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase CORS Settings
Di Supabase Dashboard → Settings → API:
- Tambahkan domain production ke allowed origins
- Update RLS policies jika diperlukan

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution**: Clear cache dan rebuild
```bash
expo r -c
npm run web:build
```

### Issue: "Navigation not working"
**Solution**: Pastikan semua screens ter-import dengan benar di `RootNavigator.tsx`

### Issue: "Supabase connection failed"
**Solution**: 
1. Check environment variables
2. Verify CORS settings di Supabase
3. Check network connectivity

### Issue: "PWA tidak bisa di-install"
**Solution**: 
1. Pastikan serve via HTTPS (untuk production)
2. Check manifest.json configuration
3. Verify service worker registration

## 📊 Performance Tips

1. **Image Optimization**: Compress images di folder `assets/`
2. **Bundle Analysis**: Use `expo export --platform web --dev` untuk debugging
3. **Lazy Loading**: Implement lazy loading untuk screens yang jarang dipakai
4. **Caching**: Setup proper caching headers di hosting platform

## 🔐 Security Considerations

1. **API Keys**: Jangan expose private keys di client-side code
2. **HTTPS**: Selalu deploy dengan HTTPS
3. **RLS**: Pastikan Row Level Security aktif di Supabase
4. **Content Security Policy**: Setup CSP headers di hosting platform

---

## 🎉 Aplikasi Siap Deploy!

Aplikasi absensi kamu sekarang udah fully web-compatible dan siap di-deploy ke platform hosting manapun. Semua fitur mobile udah berfungsi sempurna di web browser dengan responsive design yang keren!

**Next Steps:**
1. Pilih platform hosting (Netlify recommended untuk simplicity)
2. Setup environment variables
3. Build dan deploy
4. Test di production environment
5. Share link ke users! 🚀

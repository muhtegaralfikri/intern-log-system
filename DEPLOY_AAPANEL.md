# Panduan Deploy di aaPanel

Panduan lengkap untuk deploy Intern Log System di server dengan aaPanel.

---

## Daftar Isi

1. [Persiapan Server](#1-persiapan-server)
2. [Install Dependencies](#2-install-dependencies)
3. [Setup Database](#3-setup-database)
4. [Clone & Setup Project](#4-clone--setup-project)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Build Project](#6-build-project)
7. [Setup PM2](#7-setup-pm2)
8. [Setup Nginx](#8-setup-nginx)
9. [Setup SSL](#9-setup-ssl)
10. [Verifikasi](#10-verifikasi)
11. [Maintenance](#11-maintenance)

---

## 1. Persiapan Server

### Minimum Requirements
- **OS**: Ubuntu 20.04+ / CentOS 7+
- **RAM**: 2GB (rekomendasi 4GB)
- **Storage**: 20GB
- **aaPanel**: Versi terbaru

### Login ke Server
```bash
ssh root@your-server-ip
```

---

## 2. Install Dependencies

### Via aaPanel Dashboard

1. Buka **aaPanel > App Store**
2. Install:
   - **Nginx** (versi terbaru)
   - **PostgreSQL 15**
   - **PM2 Manager** (jika ada)

### Via Terminal

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node -v  # harus v20.x
npm -v

# Install PM2 global
npm install -g pm2

# Install Git (jika belum ada)
sudo apt-get install -y git
```

---

## 3. Setup Database

### Buat Database PostgreSQL

1. Buka **aaPanel > Database > PostgreSQL**
2. Klik **Add Database**
3. Isi:
   - **Database Name**: `intern_log`
   - **Username**: `intern_user`
   - **Password**: `your_secure_password`
4. Klik **Submit**

### Atau via Terminal

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Buat user dan database
CREATE USER intern_user WITH PASSWORD 'GANTI_PASSWORD_ANDA';
CREATE DATABASE intern_log OWNER intern_user;
GRANT ALL PRIVILEGES ON DATABASE intern_log TO intern_user;
\q
```

### Catat Connection String

```
DATABASE_URL="postgresql://intern_user:GANTI_PASSWORD_ANDA@localhost:5432/intern_log"
```

---

## 4. Clone & Setup Project

### Clone Repository

```bash
# Masuk ke direktori web
cd /www/wwwroot

# Clone project
git clone https://github.com/muhtegaralfikri/intern-log-system.git
cd intern-log-system

# Install dependencies
npm install

# Install dependencies untuk backend & frontend
cd apps/backend && npm install && cd ../..
cd apps/frontend && npm install && cd ../..
```

---

## 5. Konfigurasi Environment

### Backend (.env)

```bash
# Buat file .env untuk backend
nano apps/backend/.env
```

Isi dengan:

```env
# Database
DATABASE_URL="postgresql://intern_user:GANTI_PASSWORD_ANDA@localhost:5432/intern_log"

# JWT - GANTI DENGAN SECRET YANG KUAT!
JWT_SECRET="GANTI_DENGAN_SECRET_MINIMAL_32_KARAKTER"
JWT_EXPIRES_IN="7d"

# AI Provider (pilih salah satu)
AI_PROVIDER="gemini"
GEMINI_API_KEY="GANTI_GEMINI_API_KEY"

# Atau Groq
# AI_PROVIDER="groq"
# GROQ_API_KEY="GANTI_GROQ_API_KEY"

# Cloudinary (untuk upload foto)
CLOUDINARY_CLOUD_NAME="GANTI_CLOUD_NAME"
CLOUDINARY_API_KEY="GANTI_API_KEY"
CLOUDINARY_API_SECRET="GANTI_API_SECRET"

# App
PORT=5001
NODE_ENV=production
```

### Frontend (.env)

```bash
# Buat file .env untuk frontend
nano apps/frontend/.env
```

Isi dengan:

```env
# Sesuaikan dengan domain Anda
# Opsi 1: Satu domain
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Opsi 2: Subdomain terpisah
# NEXT_PUBLIC_API_URL=https://api-intern.yourdomain.com

NEXT_PUBLIC_APP_NAME="Intern Log System"
```

---

## 6. Build Project

### Generate Prisma Client & Migrate

```bash
cd /www/wwwroot/intern-log-system/apps/backend

# Generate Prisma Client
npx prisma generate

# Jalankan migration
npx prisma migrate deploy

# (Opsional) Seed data awal
npx prisma db seed
```

### Build Backend

```bash
cd /www/wwwroot/intern-log-system/apps/backend
npm run build
```

### Build Frontend

```bash
cd /www/wwwroot/intern-log-system/apps/frontend
npm run build
```

### Copy Static Files (untuk standalone)

```bash
# Copy public folder ke standalone
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

---

## 7. Setup PM2

### Jalankan dengan PM2

```bash
cd /www/wwwroot/intern-log-system

# Start semua apps
pm2 start ecosystem.config.js

# Simpan konfigurasi untuk auto-start saat reboot
pm2 save
pm2 startup
```

### Perintah PM2 Berguna

```bash
# Lihat status
pm2 status

# Lihat logs
pm2 logs

# Lihat logs spesifik
pm2 logs intern-api
pm2 logs intern-web

# Restart apps
pm2 restart all
pm2 restart intern-api
pm2 restart intern-web

# Stop apps
pm2 stop all

# Monitor real-time
pm2 monit
```

---

## 8. Setup Nginx

### Opsi 1: Via aaPanel (Rekomendasi)

1. Buka **aaPanel > Website > Add Site**
2. Isi:
   - **Domain**: `yourdomain.com`
   - **PHP Version**: Pure Static (tidak perlu PHP)
3. Klik **Submit**
4. Klik **Settings** pada site yang baru dibuat
5. Pilih **Nginx Config** (atau Config File)
6. Replace dengan konfigurasi dari `nginx.conf.example`
7. Klik **Save**

### Opsi 2: Via Terminal

```bash
# Edit konfigurasi Nginx
nano /www/server/panel/vhost/nginx/yourdomain.com.conf
```

Paste konfigurasi dari `nginx.conf.example`, lalu:

```bash
# Test konfigurasi
nginx -t

# Reload Nginx
nginx -s reload
# atau
systemctl reload nginx
```

---

## 9. Setup SSL

### Via aaPanel (Rekomendasi)

1. Buka **aaPanel > Website**
2. Klik **Settings** pada domain Anda
3. Pilih **SSL**
4. Pilih **Let's Encrypt**
5. Centang domain Anda
6. Klik **Apply**
7. Aktifkan **Force HTTPS**

### Atau Via Certbot

```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Generate SSL
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto renewal
certbot renew --dry-run
```

---

## 10. Verifikasi

### Cek PM2 Status

```bash
pm2 status
```

Output yang diharapkan:
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┤
│ 0  │ intern-api         │ fork     │ 0    │ online    │ 0%       │
│ 1  │ intern-web         │ fork     │ 0    │ online    │ 0%       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┘
```

### Test Endpoints

```bash
# Test backend
curl http://localhost:5001/api/docs

# Test frontend
curl http://localhost:5000

# Test via domain
curl https://yourdomain.com
curl https://yourdomain.com/api/docs
```

### Buka di Browser

- Frontend: `https://yourdomain.com`
- API Docs: `https://yourdomain.com/api/docs`

---

## 11. Maintenance

### Update Aplikasi

```bash
cd /www/wwwroot/intern-log-system

# Pull perubahan terbaru
git pull origin main

# Install dependencies baru
npm install
cd apps/backend && npm install && cd ../..
cd apps/frontend && npm install && cd ../..

# Jalankan migration (jika ada)
cd apps/backend && npx prisma migrate deploy && cd ../..

# Rebuild
cd apps/backend && npm run build && cd ../..
cd apps/frontend && npm run build && cd ../..
cp -r apps/frontend/public apps/frontend/.next/standalone/
cp -r apps/frontend/.next/static apps/frontend/.next/standalone/.next/

# Restart apps
pm2 restart all
```

### Backup Database

```bash
# Backup
pg_dump -U intern_user -h localhost intern_log > backup_$(date +%Y%m%d).sql

# Restore
psql -U intern_user -h localhost intern_log < backup_20240101.sql
```

### Lihat Logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
tail -f /www/wwwlogs/yourdomain.com.log
tail -f /www/wwwlogs/yourdomain.com.error.log
```

### Troubleshooting

**App tidak jalan?**
```bash
pm2 logs intern-api --lines 50
pm2 logs intern-web --lines 50
```

**Database connection error?**
```bash
# Cek PostgreSQL status
systemctl status postgresql

# Test koneksi
psql -U intern_user -h localhost -d intern_log
```

**Nginx error?**
```bash
# Test konfigurasi
nginx -t

# Lihat error log
tail -f /www/wwwlogs/yourdomain.com.error.log
```

**Port sudah digunakan?**
```bash
# Cek port yang digunakan
lsof -i :5000
lsof -i :5001

# Kill proses
kill -9 <PID>
```

---

## Checklist Deploy

- [ ] Server ready dengan aaPanel
- [ ] Node.js 20 terinstall
- [ ] PostgreSQL terinstall & database dibuat
- [ ] Project di-clone
- [ ] File .env backend dikonfigurasi
- [ ] File .env frontend dikonfigurasi
- [ ] Prisma migrate dijalankan
- [ ] Backend & Frontend di-build
- [ ] PM2 menjalankan kedua aplikasi
- [ ] Nginx dikonfigurasi
- [ ] SSL aktif
- [ ] Website bisa diakses

---

## Support

Jika ada masalah, cek:
1. PM2 logs: `pm2 logs`
2. Nginx error log
3. Browser console (F12)

Selamat! Aplikasi Anda sudah live! 🎉

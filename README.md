# Intern Log System

Sistem digital untuk mencatat dan memantau aktivitas intern secara terstruktur dengan fitur AI-powered reporting.

---

## 📋 Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Masalah](#masalah)
- [Solusi](#solusi)
- [Perbandingan dengan Spreadsheet](#perbandingan-dengan-spreadsheet)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)

---

## Latar Belakang

Intern/mahasiswa magang seringkali kesulitan dalam mendokumentasikan aktivitas harian mereka secara konsisten. Hal ini berdampak pada kualitas laporan akhir magang dan evaluasi dari supervisor. Sistem ini hadir untuk menyelesaikan masalah tersebut dengan pendekatan digital dan AI.

---

## Masalah

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Intern kesulitan mencatat aktivitas harian secara konsisten | Laporan akhir magang tidak lengkap |
| 2 | Supervisor sulit memantau progress banyak intern sekaligus | Evaluasi tidak akurat |
| 3 | Pembuatan laporan mingguan/bulanan manual memakan waktu | Produktivitas menurun |
| 4 | Tidak ada rekap data aktivitas yang terstruktur | Sulit mengukur kontribusi intern |
| 5 | Absensi masih manual (TTD/spreadsheet) | Data tidak real-time |

---

## Solusi

**Intern Log System** - Platform digital untuk:

- Mencatat aktivitas harian intern secara terstruktur
- Monitoring real-time oleh supervisor
- **AI auto-generate** laporan mingguan dari log harian
- Dashboard analytics produktivitas
- Absensi digital dengan timestamp
- Gamification untuk meningkatkan engagement

---

## Perbandingan dengan Spreadsheet

| Aspek | Spreadsheet/Excel | Intern Log System |
|-------|-------------------|-------------------|
| **Real-time Collaboration** | Lambat, sering conflict | Real-time, multi-user aman |
| **Mobile Access** | Ribet, UI tidak responsif | Responsive, bisa PWA |
| **Notifikasi** | Tidak ada | Reminder otomatis |
| **AI Summary** | Manual rangkum sendiri | Auto-generate laporan |
| **Role & Permission** | Manual protect sheet | Built-in RBAC |
| **Data Validation** | Bisa dibypass | Strict validation |
| **Reporting** | Manual buat chart | Dashboard otomatis |
| **Attendance** | Manual input jam | 1-click check-in/out |
| **History & Audit** | Sulit tracking | Full audit log |
| **Scalability** | Berat jika data banyak | Handle ribuan data |
| **Search & Filter** | Basic | Advanced filter |
| **Integration** | Terbatas | Slack, Email, Calendar |

### Keunggulan Utama:

1. **AI-Powered**: Auto-generate laporan mingguan dalam 10 detik
2. **User Experience**: Input log dalam 30 detik
3. **Supervisor Dashboard**: 1 dashboard untuk semua intern
4. **Accountability**: Timestamp & audit trail

---

## Fitur

### High Priority (MVP)

#### 1. AI Report Generator
- Auto-generate laporan mingguan/bulanan dari log harian
- Summary aktivitas dengan AI
- Export ke PDF

#### 2. Time Analytics Dashboard
| Metrik | Deskripsi |
|--------|-----------|
| Time per Category | Pie chart (Development, Meeting, Learning) |
| Productivity Trend | Line chart mingguan |
| Peak Hours | Jam paling produktif |
| Comparison | Bandingkan dengan rata-rata intern (anonymous) |

#### 3. Daily Activity Log
- Input aktivitas harian (title, description, duration, category)
- Timestamp otomatis
- Category tagging

#### 4. Attendance System (Camera + GPS + Maps)
- Check-in / Check-out dengan timestamp
- **Selfie Camera** - Wajib foto saat absen (anti-titip absen)
- **GPS Location** - Capture koordinat lokasi otomatis
- **Maps Display** - Tampilkan lokasi di peta (OpenStreetMap/Google Maps)
- **Geofencing** - Validasi apakah dalam radius kantor
- Status: Present, Absent, Late, Leave
- Monthly recap dengan visualisasi lokasi

##### Tech Implementation (GRATIS):
| Fitur | Library | Biaya |
|-------|---------|-------|
| Camera/Selfie | `react-webcam` | Gratis |
| GPS Location | Browser Geolocation API | Gratis |
| Maps Display | `react-leaflet` + OpenStreetMap | Gratis |
| Reverse Geocoding | Nominatim API | Gratis |
| Image Storage | Cloudinary | Gratis (25GB) |

##### Flow Absensi:
```
1. User klik "Check In"
2. Browser minta izin kamera & lokasi
3. User foto selfie
4. System capture: timestamp + GPS koordinat + foto
5. Tampilkan lokasi di maps + preview foto
6. User confirm → Data tersimpan
7. Supervisor bisa lihat foto + lokasi di dashboard
```

#### 5. Role-Based Access Control
| Role | Akses |
|------|-------|
| Intern | Input log, lihat report sendiri |
| Supervisor | Pantau intern, approve report |
| Admin | Manage users, lihat semua data |

### Medium Priority

#### 6. Achievement & Badge System
| Badge | Kondisi |
|-------|---------|
| 🔥 7-Day Streak | Isi log 7 hari berturut-turut |
| ⚡ Early Bird | Check-in sebelum jam 8 |
| 📝 Productive Week | >40 jam kerja dalam seminggu |
| 🎯 Task Master | Selesaikan 50 task |

#### 7. Skill Progress Tracker
- Tag skill di setiap aktivitas (React, NestJS, Communication, dll)
- Visualisasi skill growth dengan radar chart
- Track perkembangan selama magang

#### 8. Mood & Energy Tracker
- Input mood harian (emoji/scale 1-5)
- Analytics wellbeing
- Korelasi mood vs produktivitas

#### 9. Smart Daily Prompt
- AI berikan pertanyaan pemandu
- Contoh: "Hari ini kamu meeting tentang apa?", "Task apa yang diselesaikan?"
- Log lebih terstruktur

#### 10. AI Task Suggestion
- Rekomendasi task berdasarkan skill & history
- Guidance untuk intern berkembang
- Contoh: "Kamu sudah banyak belajar React, coba explore testing dengan Jest"

#### 11. Weekly Reflection AI
- AI generate pertanyaan refleksi mingguan
- "Apa challenge terbesar minggu ini?"
- "Apa yang ingin dipelajari minggu depan?"

#### 12. Mentor Feedback System
- Supervisor beri feedback langsung di aktivitas
- Comment, rating, suggestion
- Notifikasi feedback baru

#### 13. Evidence Attachment
- Upload bukti kerja (screenshot, link, file)
- Dokumentasi portofolio
- Cloud storage (S3/Cloudinary)

#### 14. Smart Report Templates
| Template | Untuk |
|----------|-------|
| Daily Standup | Format standup meeting |
| Weekly Report | Laporan mingguan |
| Monthly Summary | Laporan bulanan |
| Final Internship | Laporan akhir magang |

---

## Tech Stack

### Backend
| Teknologi | Fungsi | Biaya |
|-----------|--------|-------|
| NestJS | REST API framework | Gratis |
| PostgreSQL | Database utama | Gratis |
| Prisma | ORM | Gratis |
| JWT | Authentication | Gratis |
| Swagger | API documentation | Gratis |

### Frontend
| Teknologi | Fungsi | Biaya |
|-----------|--------|-------|
| Next.js 14 | React framework (App Router) | Gratis |
| Tailwind CSS | Styling | Gratis |
| shadcn/ui | UI components | Gratis |
| React Query | Data fetching | Gratis |
| Zustand | State management | Gratis |
| Recharts | Data visualization | Gratis |

### AI (100% GRATIS)
| Teknologi | Fungsi | Free Tier |
|-----------|--------|-----------|
| **Google Gemini API** | Text summarization (Rekomendasi) | 15 req/menit, 1500 req/hari |
| Groq Cloud | LLM API (Llama 3, Mixtral) | 30 req/menit |
| Ollama | Run LLM lokal (offline) | Unlimited (lokal) |
| Hugging Face | Model inference | 30K char/bulan |

#### Perbandingan AI Provider Gratis:

| Provider | Model | Speed | Limit | Rekomendasi |
|----------|-------|-------|-------|-------------|
| **Gemini** | Gemini 1.5 Flash | Cepat | 1500 req/hari | Production |
| **Groq** | Llama 3 70B | Sangat Cepat | 30 req/menit | Development |
| **Ollama** | Llama 3, Mistral | Tergantung PC | Unlimited | Offline/Testing |
| **Hugging Face** | Berbagai model | Sedang | 30K char/bulan | Backup |

#### Setup AI Provider:

**1. Google Gemini (Rekomendasi)**
```bash
# Daftar di https://makersuite.google.com/app/apikey
# Gratis, cukup untuk capstone project
GEMINI_API_KEY="your-gemini-api-key"
```

**2. Groq Cloud**
```bash
# Daftar di https://console.groq.com
# Gratis, sangat cepat
GROQ_API_KEY="your-groq-api-key"
```

**3. Ollama (Lokal/Offline)**
```bash
# Install dari https://ollama.ai
# Jalankan model lokal
ollama pull llama3
ollama run llama3
```

### Database (GRATIS)
| Teknologi | Fungsi | Free Tier |
|-----------|--------|-----------|
| **Neon** | PostgreSQL serverless | 512MB storage |
| **Supabase** | PostgreSQL + Auth | 500MB storage |
| **Railway** | PostgreSQL | $5 credit/bulan |

### Hosting (GRATIS)
| Teknologi | Fungsi | Free Tier |
|-----------|--------|-----------|
| **Vercel** | Frontend hosting | Unlimited untuk hobby |
| **Render** | Backend hosting | 750 jam/bulan |
| **Railway** | Full stack | $5 credit/bulan |

### File Storage (GRATIS)
| Teknologi | Fungsi | Free Tier |
|-----------|--------|-----------|
| **Cloudinary** | Image/file storage | 25GB storage |
| **Uploadthing** | File upload | 2GB storage |

### DevOps & Tools
| Teknologi | Fungsi | Biaya |
|-----------|--------|-------|
| Docker | Containerization | Gratis |
| Git | Version control | Gratis |

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                        (Next.js)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Auth Pages  │  │  Dashboard  │  │    Admin Panel      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│                        (NestJS)                             │
│  ┌─────────┐  ┌────────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Auth   │  │ Activities │  │ Reports  │  │    AI     │  │
│  │ Module  │  │   Module   │  │  Module  │  │  Module   │  │
│  └─────────┘  └────────────┘  └──────────┘  └───────────┘  │
│  ┌─────────┐  ┌────────────┐  ┌──────────┐                 │
│  │  Users  │  │ Attendance │  │  Skills  │                 │
│  │ Module  │  │   Module   │  │  Module  │                 │
│  └─────────┘  └────────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                              │
│                     (PostgreSQL)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES (GRATIS)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Gemini API  │  │ Cloudinary  │  │   Neon PostgreSQL   │  │
│  │   (FREE)    │  │   (FREE)    │  │      (FREE)         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  INTERN
  SUPERVISOR
  ADMIN
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  LEAVE
}

enum MoodLevel {
  VERY_BAD
  BAD
  NEUTRAL
  GOOD
  VERY_GOOD
}

model User {
  id           String       @id @default(uuid())
  email        String       @unique
  password     String
  name         String
  role         Role         @default(INTERN)
  department   String?
  avatarUrl    String?
  supervisorId String?
  supervisor   User?        @relation("SupervisorInterns", fields: [supervisorId], references: [id])
  interns      User[]       @relation("SupervisorInterns")
  activities   Activity[]
  attendances  Attendance[]
  reports      Report[]
  badges       UserBadge[]
  skills       UserSkill[]
  moods        MoodEntry[]
  feedbackGiven    Feedback[] @relation("FeedbackGiver")
  feedbackReceived Feedback[] @relation("FeedbackReceiver")
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Activity {
  id          String     @id @default(uuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  title       String
  description String
  category    String
  duration    Int        // in minutes
  date        DateTime
  skills      ActivitySkill[]
  attachments Attachment[]
  feedback    Feedback[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Attendance {
  id              String           @id @default(uuid())
  userId          String
  user            User             @relation(fields: [userId], references: [id])
  date            DateTime
  checkIn         DateTime?
  checkOut        DateTime?
  checkInPhoto    String?          // URL foto selfie check-in
  checkOutPhoto   String?          // URL foto selfie check-out
  checkInLat      Float?           // Latitude check-in
  checkInLng      Float?           // Longitude check-in
  checkOutLat     Float?           // Latitude check-out
  checkOutLng     Float?           // Longitude check-out
  checkInAddress  String?          // Alamat dari reverse geocoding
  checkOutAddress String?          // Alamat dari reverse geocoding
  isInRadius      Boolean          @default(false) // Dalam radius kantor?
  status          AttendanceStatus @default(PRESENT)
  notes           String?
  createdAt       DateTime         @default(now())
}

model Report {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  content     String   @db.Text
  aiSummary   String?  @db.Text
  periodStart DateTime
  periodEnd   DateTime
  type        String   // daily, weekly, monthly, final
  isApproved  Boolean  @default(false)
  approvedAt  DateTime?
  approvedBy  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Skill {
  id          String          @id @default(uuid())
  name        String          @unique
  category    String
  activities  ActivitySkill[]
  userSkills  UserSkill[]
  createdAt   DateTime        @default(now())
}

model ActivitySkill {
  id         String   @id @default(uuid())
  activityId String
  activity   Activity @relation(fields: [activityId], references: [id])
  skillId    String
  skill      Skill    @relation(fields: [skillId], references: [id])
  createdAt  DateTime @default(now())

  @@unique([activityId, skillId])
}

model UserSkill {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  skillId   String
  skill     Skill    @relation(fields: [skillId], references: [id])
  level     Int      @default(0) // 0-100
  hours     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, skillId])
}

model Badge {
  id          String      @id @default(uuid())
  name        String      @unique
  description String
  icon        String
  condition   String      // JSON condition
  userBadges  UserBadge[]
  createdAt   DateTime    @default(now())
}

model UserBadge {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  badgeId   String
  badge     Badge    @relation(fields: [badgeId], references: [id])
  earnedAt  DateTime @default(now())

  @@unique([userId, badgeId])
}

model MoodEntry {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  date      DateTime
  mood      MoodLevel
  energy    Int       // 1-5
  notes     String?
  createdAt DateTime  @default(now())

  @@unique([userId, date])
}

model Attachment {
  id         String   @id @default(uuid())
  activityId String
  activity   Activity @relation(fields: [activityId], references: [id])
  fileName   String
  fileUrl    String
  fileType   String
  fileSize   Int
  createdAt  DateTime @default(now())
}

model Feedback {
  id         String   @id @default(uuid())
  activityId String
  activity   Activity @relation(fields: [activityId], references: [id])
  giverId    String
  giver      User     @relation("FeedbackGiver", fields: [giverId], references: [id])
  receiverId String
  receiver   User     @relation("FeedbackReceiver", fields: [receiverId], references: [id])
  rating     Int?     // 1-5
  comment    String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model ReportTemplate {
  id        String   @id @default(uuid())
  name      String
  type      String   // daily, weekly, monthly, final
  content   String   @db.Text // Template content
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Register user baru |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/profile` | Get current user profile |
| PATCH | `/auth/profile` | Update profile |

### Activities
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/activities` | List activities (filter: date, category) |
| POST | `/activities` | Create new activity |
| GET | `/activities/:id` | Get activity detail |
| PATCH | `/activities/:id` | Update activity |
| DELETE | `/activities/:id` | Delete activity |
| POST | `/activities/:id/attachments` | Upload attachment |

### Attendance
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/attendance/check-in` | Clock in dengan foto + GPS |
| POST | `/attendance/check-out` | Clock out dengan foto + GPS |
| GET | `/attendance` | List attendance records |
| GET | `/attendance/today` | Get today's attendance |
| GET | `/attendance/summary` | Monthly summary |
| GET | `/attendance/:id/location` | Get lokasi di maps |
| POST | `/attendance/upload-photo` | Upload foto selfie ke Cloudinary |
| GET | `/attendance/office-locations` | List lokasi kantor untuk geofencing |
| POST | `/attendance/validate-location` | Validasi apakah dalam radius kantor |

### Reports
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/reports` | List reports |
| POST | `/reports/generate` | AI generate report |
| GET | `/reports/:id` | Get report detail |
| PATCH | `/reports/:id` | Update report |
| POST | `/reports/:id/approve` | Approve report (supervisor) |
| GET | `/reports/:id/export` | Export to PDF |

### Skills
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/skills` | List all skills |
| GET | `/skills/my-progress` | Get user skill progress |
| GET | `/skills/analytics` | Skill analytics |

### Badges
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/badges` | List all badges |
| GET | `/badges/my-badges` | Get user earned badges |

### Mood
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/mood` | Log mood entry |
| GET | `/mood` | Get mood history |
| GET | `/mood/analytics` | Mood analytics |

### Feedback
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/feedback` | Give feedback |
| GET | `/feedback/received` | Get received feedback |

### AI
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/ai/summarize` | Summarize activities |
| POST | `/ai/suggest-tasks` | Get task suggestions |
| GET | `/ai/daily-prompt` | Get daily prompts |
| POST | `/ai/reflection` | Generate reflection questions |

### Admin
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/admin/users` | List all users |
| GET | `/admin/interns` | List all interns |
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/reports` | All reports overview |

---

## Project Structure

```
intern-log-system/
├── apps/
│   ├── backend/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   │   └── register.dto.ts
│   │   │   │   │   ├── guards/
│   │   │   │   │   │   ├── jwt.guard.ts
│   │   │   │   │   │   └── roles.guard.ts
│   │   │   │   │   └── strategies/
│   │   │   │   │       └── jwt.strategy.ts
│   │   │   │   ├── users/
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.service.ts
│   │   │   │   │   ├── users.module.ts
│   │   │   │   │   └── dto/
│   │   │   │   ├── activities/
│   │   │   │   │   ├── activities.controller.ts
│   │   │   │   │   ├── activities.service.ts
│   │   │   │   │   ├── activities.module.ts
│   │   │   │   │   └── dto/
│   │   │   │   ├── attendance/
│   │   │   │   │   ├── attendance.controller.ts
│   │   │   │   │   ├── attendance.service.ts
│   │   │   │   │   └── attendance.module.ts
│   │   │   │   ├── reports/
│   │   │   │   │   ├── reports.controller.ts
│   │   │   │   │   ├── reports.service.ts
│   │   │   │   │   └── reports.module.ts
│   │   │   │   ├── skills/
│   │   │   │   │   ├── skills.controller.ts
│   │   │   │   │   ├── skills.service.ts
│   │   │   │   │   └── skills.module.ts
│   │   │   │   ├── badges/
│   │   │   │   │   ├── badges.controller.ts
│   │   │   │   │   ├── badges.service.ts
│   │   │   │   │   └── badges.module.ts
│   │   │   │   ├── mood/
│   │   │   │   │   ├── mood.controller.ts
│   │   │   │   │   ├── mood.service.ts
│   │   │   │   │   └── mood.module.ts
│   │   │   │   ├── feedback/
│   │   │   │   │   ├── feedback.controller.ts
│   │   │   │   │   ├── feedback.service.ts
│   │   │   │   │   └── feedback.module.ts
│   │   │   │   ├── ai/
│   │   │   │   │   ├── ai.controller.ts
│   │   │   │   │   ├── ai.service.ts
│   │   │   │   │   └── ai.module.ts
│   │   │   │   └── admin/
│   │   │   │       ├── admin.controller.ts
│   │   │   │       ├── admin.service.ts
│   │   │   │       └── admin.module.ts
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   ├── migrations/
│   │   │   │   └── seed.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── roles.decorator.ts
│   │   │   │   │   └── user.decorator.ts
│   │   │   │   ├── filters/
│   │   │   │   │   └── http-exception.filter.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── transform.interceptor.ts
│   │   │   │   └── pipes/
│   │   │   │       └── validation.pipe.ts
│   │   │   ├── config/
│   │   │   │   └── configuration.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── frontend/                   # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── register/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── layout.tsx
│       │   │   ├── (dashboard)/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── activities/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   ├── new/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── attendance/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── reports/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── skills/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── badges/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── mood/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── settings/
│       │   │   │       └── page.tsx
│       │   │   ├── admin/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── interns/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   └── reports/
│       │   │   │       └── page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── ui/              # shadcn/ui components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   └── ...
│       │   │   ├── forms/
│       │   │   │   ├── ActivityForm.tsx
│       │   │   │   ├── MoodForm.tsx
│       │   │   │   └── LoginForm.tsx
│       │   │   ├── tables/
│       │   │   │   ├── ActivitiesTable.tsx
│       │   │   │   └── AttendanceTable.tsx
│       │   │   ├── charts/
│       │   │   │   ├── TimeChart.tsx
│       │   │   │   ├── SkillRadar.tsx
│       │   │   │   └── MoodTrend.tsx
│       │   │   ├── layout/
│       │   │   │   ├── Sidebar.tsx
│       │   │   │   ├── Header.tsx
│       │   │   │   └── Footer.tsx
│       │   │   └── shared/
│       │   │       ├── Badge.tsx
│       │   │       └── Loading.tsx
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   ├── auth.ts
│       │   │   └── utils.ts
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useActivities.ts
│       │   │   └── useReports.ts
│       │   ├── stores/
│       │   │   ├── authStore.ts
│       │   │   └── uiStore.ts
│       │   └── types/
│       │       ├── index.ts
│       │       ├── user.ts
│       │       ├── activity.ts
│       │       └── report.ts
│       ├── public/
│       │   ├── icons/
│       │   └── images/
│       ├── .env.example
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── docker-compose.yml
├── .gitignore
├── .eslintrc.js
├── README.md
└── package.json
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (atau gunakan Neon/Supabase gratis)
- Docker (optional)
- Google Gemini API Key (GRATIS) atau Groq API Key (GRATIS)

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd intern-log-system

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Edit .env files with your configuration
# Backend .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/intern_log"
# atau gunakan Neon gratis: https://neon.tech
# JWT_SECRET="your-secret-key"
# GEMINI_API_KEY="your-gemini-key" (gratis dari https://makersuite.google.com)

# Frontend .env:
# NEXT_PUBLIC_API_URL="http://localhost:3001"

# 5. Start database with Docker
docker-compose up -d postgres

# 6. Run database migrations
cd apps/backend
npx prisma migrate dev
npx prisma db seed

# 7. Start development servers
# Terminal 1 - Backend (port 3001)
cd apps/backend
npm run start:dev

# Terminal 2 - Frontend (port 3000)
cd apps/frontend
npm run dev
```

### Docker Setup (Alternative)

```bash
# Build and run all services
docker-compose up --build

# Services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
# - PostgreSQL: localhost:5432
```

---

## Environment Variables

### Backend (.env)

```env
# Database (Pilih salah satu - semua GRATIS)
# Lokal:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/intern_log"
# Neon (gratis 512MB):
# DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/intern_log"
# Supabase (gratis 500MB):
# DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# AI Provider (Pilih salah satu - semua GRATIS)
# Google Gemini (Rekomendasi - 1500 req/hari gratis)
AI_PROVIDER="gemini"
GEMINI_API_KEY="your-gemini-api-key"

# Groq (Alternatif - 30 req/menit gratis)
# AI_PROVIDER="groq"
# GROQ_API_KEY="your-groq-api-key"

# Ollama (Lokal - unlimited gratis)
# AI_PROVIDER="ollama"
# OLLAMA_BASE_URL="http://localhost:11434"

# App
PORT=3001
NODE_ENV=development
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="Intern Log System"
```

### Cara Dapatkan API Key (GRATIS):

**1. Google Gemini API:**
- Buka https://makersuite.google.com/app/apikey
- Login dengan akun Google
- Klik "Create API Key"
- Copy key dan paste di `GEMINI_API_KEY`

**2. Groq Cloud:**
- Buka https://console.groq.com
- Sign up gratis
- Buat API Key di dashboard
- Copy key dan paste di `GROQ_API_KEY`

**3. Neon PostgreSQL:**
- Buka https://neon.tech
- Sign up gratis
- Buat project baru
- Copy connection string ke `DATABASE_URL`

---

## Scripts

### Backend

```bash
npm run start:dev    # Development mode
npm run start:prod   # Production mode
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linter
```

### Frontend

```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Author

Capstone Project - 2025

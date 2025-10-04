# DevCase — Users Dashboard

Kullanıcı yönetimi (CRUD + hiyerarşi) için geliştirilmiş full-stack uygulama.  
Frontend **Next.js**, backend ise **Node.js (Express + PostgreSQL)** ile yazılmıştır.

---

## 🚀 Özellikler

- Kullanıcı kayıt / giriş (JWT authentication)
- CRUD işlemleri (admin / user rolleri)
- Parent–child kullanıcı hiyerarşisi
- Sayfalama, sıralama ve arama
- Tailwind + Radix UI ile responsive arayüz

---

## 🛠️ Teknolojiler

**Frontend**
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + Radix UI
- TanStack Table v8

**Backend**
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT + bcrypt
- Zod validation

---

## 📦 Kurulum

### Gereksinimler
- Node.js >= 18
- PostgreSQL >= 14
- npm veya pnpm

### Backend
```bash
cd backend
npm install
cp .env   # .env düzenle
createdb devcase_db    # PostgreSQL veritabanı oluştur
npm run dev            # http://localhost:5001
Frontend
bash
Kodu kopyala
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > .env.local
npm run dev   # http://localhost:3000
🔑 Varsayılan Admin Kullanıcı
Backend çalıştıktan sonra admin oluştur:

bash
Kodu kopyala
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "123456",
    "name": "Admin User",
    "role": "admin"
  }'
Frontend giriş bilgileri:

Email: admin@test.com

Şifre: 123456

📂 Proje Yapısı
rust
Kodu kopyala
backend/   -> Express.js API
src/       -> Next.js frontend
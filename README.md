# 🏦 KodBank – Digital Banking App

A full-stack banking app with JWT authentication, MySQL (Aiven), and a beautiful animated UI.

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `backend/.env` and fill in your Aiven MySQL password:
```
DB_PASSWORD=your_actual_aiven_password_here
JWT_SECRET=your_custom_secret_key
```

### 3. Run the App
```bash
# Development (with auto-restart)
cd backend && npx nodemon server.js

# OR Production
cd backend && node server.js
```

### 4. Open in Browser
```
http://localhost:3000
```

---

## 📁 Project Structure
```
kodbank/
├── backend/
│   ├── routes/
│   │   └── auth.js       # Register, Login, Balance, Logout APIs
│   ├── db.js             # MySQL connection + table creation
│   ├── server.js         # Express server
│   ├── .env              # Environment variables
│   └── package.json
│
└── frontend/
    └── public/
        ├── register.html  # Registration page
        ├── login.html     # Login page
        ├── dashboard.html # User dashboard with balance
        ├── css/
        │   └── style.css  # Full styling
        └── js/
            ├── particles.js  # Floating particles background
            └── confetti.js   # 🎉 Party popper animation
```

---

## 🔗 API Endpoints

| Method | Route               | Description          |
|--------|---------------------|----------------------|
| POST   | /api/auth/register  | Register new user    |
| POST   | /api/auth/login     | Login + get JWT      |
| GET    | /api/auth/balance   | Check balance (JWT)  |
| POST   | /api/auth/logout    | Clear session        |

---

## 🔐 Security Features
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT tokens with expiry (2 hours)
- ✅ Token stored in HttpOnly cookie
- ✅ JWT verified before balance reveal
- ✅ Tokens stored in DB for validation
- ✅ SSL required for DB connection

---

## 🎨 UI Features
- ✅ Animated floating particles (auth pages)
- ✅ Glassmorphism card design
- ✅ 🎉 Confetti animation on balance check
- ✅ Animated gradient blobs (dashboard)
- ✅ Fully responsive design

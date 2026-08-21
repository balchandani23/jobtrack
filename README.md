# 💼 JobTrack Pro — Full-Stack Job Application Tracker

A modern, production-ready SaaS application designed for job seekers to track applications, manage recruitment pipelines across stages, and visualize interview conversion metrics in real time.

---

## 🚀 Live Demo

- **Live Web App:** [View on Vercel](https://jobtrack-bhavya.vercel.app/) *
- **API Server:** [View on Render](https://jobtrack-backend-af0w.onrender.com) *

---

## ✨ Features

- **JWT Authentication:** Secure user signup and sign-in with bcrypt password hashing and token-based route protection.
- **Pipeline Visualizer:** Interactive Kanban board and Grid view modes to track stages (`Applied`, `Screening`, `Interview`, `Offer`, `Rejected`).
- **Conversion Metrics:** Live calculations for total applications, interview conversion rates, and offer rates.
- **Multi-Currency Compensation:** Support for global salary formats including INR (₹), USD ($), EUR (€), GBP (£), CAD (C$), AUD (A$), JPY (¥), and AED.
- **Search & Filters:** Real-time filtering by status and instant text search across position titles and company names.
- **Modern Glassmorphic UI:** Built with custom dark-mode aesthetics, responsive layouts, and micro-interactions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Vanilla CSS with custom design tokens & Glassmorphism
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), Bcrypt.js, CORS
- **Deployment:** Render

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone [https://github.com/balchandani23/jobtrack.git](https://github.com/balchandani23/jobtrack.git)
cd jobtrack

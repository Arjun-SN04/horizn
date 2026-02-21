# 🌍 Horizn

> A full-stack travel listing platform to discover, list, and review unique stays worldwide.

![Node](https://img.shields.io/badge/Node.js-22.x-green) ![React](https://img.shields.io/badge/React-18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Deployed](https://img.shields.io/badge/Deployed-Vercel-black)

---

## 🧭 Overview
Horizn is a MERN stack web app where users can browse, create, and review travel property listings. Features include interactive Mapbox maps, Cloudinary image uploads, and full authentication.

---

## ✨ Features
- 🔐 Secure auth with Passport.js and session persistence
- 🏠 Full CRUD for listings with image uploads
- 🗺️ Mapbox GL JS with live forward geocoding
- ⭐ Reviews & star ratings (owners can't review own listings)
- 👤 Editable user profiles
- 🔒 Owner-only edit/delete guards

---

## 🛠 Tech Stack
| Layer | Technologies |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS, Vite |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | Passport.js, express-session, connect-mongo |
| Storage | Cloudinary, Multer |
| Maps | Mapbox GL JS, Mapbox SDK (geocoding) |

---

## 🚀 Getting Started
```bash
git clone https://github.com/GithubArjun/horizn.git
cd horizn
npm run install-all
npm run dev
```

---

## 🔑 Environment Variables

**`backend/.env`**
```env
MONGODB_ATLAS_URL=
SECRET=
MAP_BOX_TOKEN=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=
```

---

## 📡 API Routes
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/listing` | No |
| POST | `/listing/new` | Yes |
| PUT | `/listing/:id/edit` | Owner |
| DELETE | `/listing/:id` | Owner |
| POST | `/listing/:id/review` | Yes |
| POST | `/user/login` | No |
| GET | `/user/profile` | Yes |

---

## 👨‍💻 Author
**Arjun S Nair** · [GitHub](https://github.com/GithubArjun) · [LinkedIn](https://linkedin.com/in/ArjunSN)

---

Want me to save this to your project now?

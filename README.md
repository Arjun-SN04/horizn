# 🌍 Horizn

> A full-stack travel listing platform to discover, list, and review unique stays worldwide.

![Node](https://img.shields.io/badge/Node.js-22.x-green) ![React](https://img.shields.io/badge/React-18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## 🧭 Overview
Horizn is a MERN stack web app where users can browse, create, and review travel property listings. Features include interactive Leaflet maps, Cloudinary image uploads, and full authentication.

---

## ✨ Features
- 🔐 Secure auth with Passport.js and session persistence
- 🏠 Full CRUD for listings with image uploads
- 🗺️ Leaflet + OpenStreetMap with live forward geocoding (Nominatim)
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
| Maps | Leaflet, OpenStreetMap tiles, Nominatim (geocoding) |

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
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_ATLAS_URL=
SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**`frontend/.env`** (optional — not needed for local dev, Vite proxies `/api` to `localhost:3000`)
```env
VITE_API_URL=
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

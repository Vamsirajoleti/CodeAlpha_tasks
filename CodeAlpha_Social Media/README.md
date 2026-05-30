# V-gram 🔷

A full-stack social media web app — Instagram + LinkedIn + Telegram vibes.

**Stack:** Node.js · Express · MongoDB · Vanilla HTML/CSS/JS · JWT Auth

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

## Setup & Run

### 1. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` if needed (defaults work for local MongoDB):
```
MONGO_URI=mongodb://localhost:27017/vgram
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
CLIENT_ORIGIN=http://127.0.0.1:5500
```

### 2. (Optional) Seed demo data

```bash
npm run seed:clear   # clears DB + seeds fresh demo users & posts
```

Demo accounts seeded:
| Email             | Password    |
|-------------------|-------------|
| alex@vgram.io     | password123 |
| mia@vgram.io      | password123 |
| jordan@vgram.io   | password123 |
| sara@vgram.io     | password123 |
| kai@vgram.io      | password123 |

### 3. Start the backend

```bash
npm run dev    # uses nodemon (auto-restart on changes)
# or
npm start      # plain node
```

Server runs on **http://localhost:5000**

### 4. Serve the frontend

Open a second terminal in the `frontend/` folder and serve it with any static server.

**Option A — VS Code Live Server** (easiest)
- Install the "Live Server" extension
- Right-click `index.html` → **Open with Live Server**
- It runs on `http://127.0.0.1:5500` (matches `CLIENT_ORIGIN`)

**Option B — npx**
```bash
cd frontend
npx serve .
# Visit http://localhost:3000
# Also update CLIENT_ORIGIN in backend/.env to match
```

**Option C — Python**
```bash
cd frontend
python3 -m http.server 5500
# Visit http://localhost:5500
```

---

## Pages

| File             | Route        | Description               |
|------------------|--------------|---------------------------|
| `index.html`     | `/`          | Login                     |
| `register.html`  | `/register`  | Sign up                   |
| `feed.html`      | `/feed`      | Main feed + stories       |
| `search.html`    | `/search`    | Explore grid + people tab |
| `profile.html`   | `/profile`   | User profile + posts grid |

---

## API Endpoints

| Method | Path                      | Auth     | Description       |
|--------|---------------------------|----------|-------------------|
| POST   | /api/auth/register        | No       | Register          |
| POST   | /api/auth/login           | No       | Login             |
| GET    | /api/auth/me              | Yes      | Current user      |
| GET    | /api/posts                | No       | Get all posts     |
| POST   | /api/posts                | Yes      | Create post       |
| PUT    | /api/posts/like/:id       | Yes      | Toggle like       |
| POST   | /api/posts/comment/:id    | Yes      | Add comment       |
| GET    | /api/users/search?q=      | Yes      | Search users      |
| GET    | /api/users/suggestions    | Yes      | Follow suggestions|
| GET    | /api/users/:username      | Yes      | User profile      |

---

## Project Structure

```
vgram/
├── backend/
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Post.js
│   ├── routes/auth.js
│   ├── routes/posts.js
│   ├── routes/users.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html    (login)
    ├── register.html
    ├── feed.html
    ├── search.html
    ├── profile.html
    ├── style.css
    └── script.js
```

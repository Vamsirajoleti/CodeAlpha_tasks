# V-TaskFlow 📋

A beginner-friendly full stack task management web app built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication (Register / Login / Logout)
- 📊 Dashboard with task stats & progress bar
- ✅ Create, Edit, Delete, and Mark tasks as Complete
- 🔍 Search tasks by title; filter by status & priority
- 👤 View and update user profile
- 📱 Mobile responsive with a clean blue and white design

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, React Router v6, Axios, Tailwind CSS |
| Backend  | Node.js, Express.js               |
| Database | MongoDB Atlas + Mongoose          |
| Auth     | JWT (JSON Web Tokens)             |

---

## Project Structure

```
taskflow-lite/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic
│   ├── middleware/       # JWT auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── server.js        # App entry point
│   ├── .env.example     # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, TaskCard, PrivateRoute
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # All page components
│   │   ├── services/    # Axios API calls
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account (free tier is fine)

---

### 1. Clone the project

```bash
git clone https://github.com/yourusername/taskflow-lite.git
cd taskflow-lite
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from the example):

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=pick_any_long_random_string_here
NODE_ENV=development
```

**How to get MONGO_URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<username>` and `<password>`

Start the backend:

```bash
npm run dev
```

The server will run at: `http://localhost:5000`

---

### 3. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at: `http://localhost:3000`

> The Vite dev server is configured to proxy `/api` requests to `localhost:5000` automatically — no extra CORS setup needed.

---

### 4. Open the App

Visit: **http://localhost:3000**

- Register a new account
- Start adding tasks!

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Tasks (requires Authorization header)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Profile (requires Authorization header)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user name |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the backend runs on (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `NODE_ENV` | `development` or `production` |

---

## Built With ❤️

This project was built as a portfolio/internship showcase demonstrating:
- Full stack development fundamentals
- REST API design
- JWT-based authentication
- React component architecture
- MongoDB data modeling
- Responsive UI with Tailwind CSS

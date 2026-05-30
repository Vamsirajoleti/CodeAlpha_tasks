<<<<<<< HEAD
# CodeAlpha Internship - Full Stack Development Tasks

Welcome to my CodeAlpha Internship repository 👋  
This repository contains the projects I built during my Full Stack Development internship.

---

## 📌 About This Repository

This repo includes **3 full-stack web development tasks** that demonstrate my skills in frontend, backend, and basic system design.

Each project is built with a focus on functionality, clean UI, and practical real-world use cases.

---

## 🚀 Projects Included

### 🛒 1. V-Store (E-Commerce Website)
A simple e-commerce web application where users can browse products and experience a basic online shopping system.

**Features:**
- Product listing
- Product details page
- Basic cart functionality
- Responsive UI

---

### 📱 2. V-Gram (Social Media App)
A mini social media platform inspired by Instagram-like features.

**Features:**
- User registration & login
- Create and view posts
- User profiles
- Feed-based UI
- Search functionality

---

### 📊 3. V-TaskFlow (Project Management Tool)
A simple task management system to organize and track daily tasks.

**Features:**
- Add / delete tasks
- Task status tracking
- Clean dashboard UI
- Easy task organization

---

## 🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Tools: Git, GitHub, VS Code

---

## 🎯 Purpose

This repository was created as part of my **CodeAlpha Full Stack Development Internship** to demonstrate my ability to build real-world web applications using modern web technologies.

---

## 👨‍💻 Developer

**Vamsi (Venom)**  
Full Stack Development Intern  

---

## 📌 Note

This project is built for learning and internship evaluation purposes.

---

## ⭐ Thank You

Thank you for reviewing my work!
Feedback and suggestions are always welcome.
=======
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
# V-Store E-Commerce
### CodeAlpha Internship Project  

# V-Store E-Commerce

V-Store is a full-stack e-commerce web application that provides a simple online shopping experience. Users can browse products, view product details, manage a shopping cart, place orders, and track purchases through a clean and responsive interface.

## Features

* User Registration and Login
* Product Catalog
* Product Details Page
* Shopping Cart Management
* Checkout System
* Order Tracking
* Responsive Design
* RESTful API Backend
* MongoDB Database Integration

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Project Structure

V-Store E-commerce

├── frontend
│   ├── assets
│   ├── index.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   └── orders.html
│
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── README.md
└── .gitignore

## Installation

### Backend Setup

1. Navigate to backend folder

cd backend

2. Install dependencies

npm install

3. Create a .env file

MONGO_URI=your_mongodb_connection_string

PORT=5000

JWT_SECRET=your_secret_key

4. Start the server

npm start

### Frontend Setup

Open index.html directly in a browser or use VS Code Live Server.

## Future Improvements

* Online Payment Gateway
* Product Reviews and Ratings
* Wishlist Feature
* Admin Dashboard
* Inventory Management
* Product Categories and Filters
* Email Notifications

## Author

Vamsi Raju

This project was developed as a portfolio and learning project to strengthen full-stack web development skills.
=======
# CodeAlpha_tasks
>>>>>>> abd82611057fc0ebae4f519bc91785066b7d6d2b
>>>>>>> 7966ff9c5592d76079aa9e0cfb7284768b875688
>>>>>>> d14f9e7e6abffb00ec5fb0ee41d8eceb35beffe8

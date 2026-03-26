# Notes MERN App

A full-stack notes application built with the **MERN** stack (MongoDB, Express, React, Node.js). Users can register, log in, and manage personal notes with rich text editing, color coding, pinning, and real-time search.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

---

## Features

- **Authentication** — Register & login with JWT-based auth and rate limiting
- **CRUD Notes** — Create, read, update and delete personal notes
- **Rich Text Editor** — Format notes with bold, italic, lists and links (Quill)
- **Color Coding** — Assign colors to notes for visual organization
- **Pin Notes** — Pin important notes to keep them at the top
- **Search** — Instant client-side search across titles and content
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **Security** — Helmet, HPP, CORS whitelist, NoSQL injection sanitization, bcrypt password hashing

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |
| Vite 8 | Build tool & dev server |
| Axios | HTTP client |
| React Quill | Rich text editor |
| React Hot Toast | Notification toasts |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet & HPP | Security middleware |
| express-validator | Input validation |
| express-rate-limit | Brute-force protection |

---

## Project Structure

```
s4.2_Notes Mern/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ColorPicker     # Note color selector
│   │   │   ├── ConfirmDialog   # Delete confirmation modal
│   │   │   ├── Navbar          # Top navigation bar
│   │   │   ├── NoteCard        # Single note card
│   │   │   ├── NoteList        # Notes grid layout
│   │   │   ├── NoteModal       # Create/edit note modal
│   │   │   ├── ProtectedRoute  # Auth guard wrapper
│   │   │   ├── SearchBar       # Search input
│   │   │   └── Spinner         # Loading indicator
│   │   ├── context/            # React Context (AuthContext)
│   │   └── pages/              # Route pages
│   │       ├── HomePage        # Main notes dashboard
│   │       ├── LoginPage       # Sign in form
│   │       └── RegisterPage    # Sign up form
│   ├── index.html
│   ├── vite.config.js
│   └── netlify.toml            # Netlify SPA config
│
├── server/                     # Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/              # Auth middleware (JWT verify)
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── validators/             # Input validation rules
│   └── server.js               # App entry point
│
├── render.yaml                 # Render deployment config
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/notes-mern.git
cd notes-mern
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Fill in the environment variables:

```env
MONGO_URI=mongodb://localhost:27017/notes-mern
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login & get token | No |

**Register Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Login Request Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Auth Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### Notes Routes (Requires Bearer Token)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes` | Get all notes for the user |
| GET | `/notes/:id` | Get a single note |
| POST | `/notes` | Create a new note |
| PUT | `/notes/:id` | Update a note |
| PATCH | `/notes/:id/pin` | Toggle pin status |
| DELETE | `/notes/:id` | Delete a note |

**Create/Update Note Body:**

```json
{
  "title": "My Note",
  "content": "<p>Note content with <strong>HTML</strong></p>",
  "color": "blue"
}
```

Available colors: `yellow`, `green`, `blue`, `purple`, `pink`, `red`, `orange`

---

## Deployment

### Frontend — Netlify

1. Connect your GitHub repo to [Netlify](https://www.netlify.com/)
2. Set **Build command**: `npm run build`
3. Set **Publish directory**: `dist`
4. Set **Base directory**: `client`
5. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`

> A `netlify.toml` is already included for SPA redirect configuration.

### Backend — Render

1. Connect your GitHub repo to [Render](https://render.com/)
2. A `render.yaml` is included — Render will auto-detect the config
3. Set the following environment variables in the Render dashboard:
   - `MONGO_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A strong random secret
   - `CLIENT_URL` — Your Netlify frontend URL

---

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

Created by [Serkanby](https://serkanbayraktar.com/) | [GitHub](https://github.com/Serkanbyx)

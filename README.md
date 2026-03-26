# Notes MERN App

A full-stack notes application built with the **MERN** stack. Users can register, log in, and manage personal notes with a rich text editor, color coding, pinning, and instant search — all wrapped in a clean, minimal UI.

<p align="center">
  <a href="https://notes-mernn.netlify.app/" target="_blank"><strong>Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Express-5-000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47a248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Auth-d63aff?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Netlify-Deployed-00c7b7?logo=netlify&logoColor=white" alt="Netlify" />
  <img src="https://img.shields.io/badge/Render-API-46e3b7?logo=render&logoColor=white" alt="Render" />
</p>

---

## Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure register & login with hashed passwords (bcrypt 12 rounds) and 7-day token expiry |
| **CRUD Notes** | Create, read, update, and delete personal notes with ownership validation |
| **Rich Text Editor** | Format content with bold, italic, underline, lists, and links via React Quill |
| **Color Coding** | Choose from 6 preset colors to visually organize notes |
| **Pin Notes** | Pin important notes so they always stay at the top |
| **Instant Search** | Client-side real-time filtering across titles and content (HTML-stripped) |
| **Responsive Grid** | Adaptive 1–4 column masonry-style layout for mobile, tablet, and desktop |
| **Delete Confirmation** | Custom modal dialog prevents accidental deletions |
| **Toast Notifications** | Real-time feedback for every action (create, update, delete, errors) |
| **Security Hardened** | Helmet, HPP, CORS whitelist, rate limiting, NoSQL injection sanitizer |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | Component-based UI library |
| [React Router](https://reactrouter.com/) | 7 | Declarative client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first CSS framework |
| [Vite](https://vite.dev/) | 8 | Next-gen build tool & dev server |
| [Axios](https://axios-http.com/) | 1.x | Promise-based HTTP client with interceptors |
| [React Quill](https://github.com/VaguelySerious/react-quill-new) | 3.x | Rich text editor (React 19 compatible fork) |
| [React Hot Toast](https://react-hot-toast.com/) | 2.x | Lightweight notification toasts |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | JavaScript runtime |
| [Express](https://expressjs.com/) | 5 | Minimal web framework |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | 9 | NoSQL database & ODM |
| [JWT](https://jwt.io/) | — | Stateless authentication tokens |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3.x | Password hashing (12 salt rounds) |
| [Helmet](https://helmetjs.github.io/) | 8 | Security HTTP headers |
| [HPP](https://github.com/analog-nico/hpp) | — | HTTP parameter pollution protection |
| [express-validator](https://express-validator.github.io/) | 7 | Request body & param validation |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | 8 | Brute-force & DDoS protection |

---

## Project Structure

```
notes-mern/
├── client/                          # React SPA (Vite)
│   ├── public/                      # Static assets (favicon, icons)
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js     # Axios config, token & 401 interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state, login/register/logout
│   │   ├── components/
│   │   │   ├── ColorPicker.jsx      # 6-color circle selector with check icon
│   │   │   ├── ConfirmDialog.jsx    # Reusable delete confirmation modal
│   │   │   ├── Navbar.jsx           # Sticky nav with user name & logout
│   │   │   ├── NoteCard.jsx         # Color-coded card with pin/edit/delete
│   │   │   ├── NoteList.jsx         # Responsive grid + empty states
│   │   │   ├── NoteModal.jsx        # Create/edit modal with Quill editor
│   │   │   ├── ProtectedRoute.jsx   # Auth guard (redirects to /login)
│   │   │   ├── SearchBar.jsx        # Search input with clear button
│   │   │   └── Spinner.jsx          # Loading indicator (sm/md/lg)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Notes dashboard (fetch, filter, CRUD)
│   │   │   ├── LoginPage.jsx        # Sign-in form with validation
│   │   │   └── RegisterPage.jsx     # Sign-up form with validation
│   │   ├── App.jsx                  # Route definitions + Toaster + Navbar
│   │   ├── main.jsx                 # Entry: BrowserRouter + AuthProvider
│   │   └── index.css                # Tailwind import + Quill overrides
│   ├── netlify.toml                 # SPA redirect config
│   ├── vite.config.js               # React + Tailwind v4 plugins
│   └── package.json
│
├── server/                          # Express REST API
│   ├── config/
│   │   └── db.js                    # Mongoose connection with timeout
│   ├── controllers/
│   │   ├── authController.js        # register & login handlers
│   │   └── noteController.js        # CRUD + togglePin handlers
│   ├── middleware/
│   │   └── verifyToken.js           # JWT Bearer token verification
│   ├── models/
│   │   ├── User.js                  # name, email (unique), password (hidden)
│   │   └── Note.js                  # title, content, color (enum), isPinned
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth — rate limited
│   │   └── noteRoutes.js            # /api/notes — token protected
│   ├── validators/
│   │   └── authValidator.js         # express-validator rules
│   ├── server.js                    # App entry: middleware, routes, error handler
│   └── package.json
│
├── render.yaml                      # Render deployment blueprint
├── .gitignore
├── ADIMLAR.md                       # Step-by-step development guide (TR)
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/Serkanbyx/notes-mern.git
cd notes-mern
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/notes-mern
JWT_SECRET=your_strong_random_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Documentation

**Base URL:** `https://your-api-url.onrender.com/api`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Create a new account | No |
| `POST` | `/auth/login` | Sign in & receive JWT | No |

<details>
<summary><strong>Register — Request & Response</strong></summary>

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response** `201`:

```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "664f...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

</details>

<details>
<summary><strong>Login — Request & Response</strong></summary>

**Request:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response** `200`:

```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "664f...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

</details>

### Notes (Bearer Token Required)

All requests must include: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notes` | Get all notes (sorted: pinned first, then by date) |
| `GET` | `/notes/:id` | Get a single note |
| `POST` | `/notes` | Create a new note |
| `PUT` | `/notes/:id` | Update a note |
| `PATCH` | `/notes/:id/pin` | Toggle pin/unpin |
| `DELETE` | `/notes/:id` | Delete a note |

<details>
<summary><strong>Create / Update Note — Request & Response</strong></summary>

**Request:**

```json
{
  "title": "Meeting Notes",
  "content": "<p>Discuss <strong>Q4 roadmap</strong> with the team</p>",
  "color": "blue"
}
```

**Available colors:** `yellow` `green` `blue` `purple` `pink` `orange`

**Response** `201`:

```json
{
  "success": true,
  "note": {
    "_id": "664f...",
    "title": "Meeting Notes",
    "content": "<p>Discuss <strong>Q4 roadmap</strong> with the team</p>",
    "color": "blue",
    "isPinned": false,
    "userId": "664f...",
    "createdAt": "2026-03-26T...",
    "updatedAt": "2026-03-26T..."
  }
}
```

</details>

### Error Responses

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Not authorized (accessing another user's note) |
| `404` | Note not found |
| `409` | Email already in use |
| `429` | Too many requests (rate limited) |

---

## Security

| Layer | Implementation |
|---|---|
| **Password Hashing** | bcryptjs with 12 salt rounds |
| **Authentication** | JWT with 7-day expiry, Bearer scheme |
| **HTTP Headers** | Helmet (CSP, HSTS, X-Frame-Options, etc.) |
| **Parameter Pollution** | HPP middleware |
| **NoSQL Injection** | Custom inline sanitizer (`$` and `.` key removal) |
| **CORS** | Origin whitelist (only frontend URL allowed) |
| **Rate Limiting** | 10 requests per 15 minutes on auth routes |
| **Body Size** | 10KB limit on JSON and URL-encoded payloads |
| **Ownership Check** | Every note operation verifies `userId` match |

---

## Deployment

### Frontend — [Netlify](https://www.netlify.com/)

| Setting | Value |
|---|---|
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_API_URL=https://your-api.onrender.com/api` |

> SPA routing is handled by the included `netlify.toml`.

### Backend — [Render](https://render.com/)

A `render.yaml` blueprint is included for automatic setup. Set these env vars in the Render dashboard:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret key |
| `CLIENT_URL` | Netlify frontend URL |
| `NODE_ENV` | `production` |

---

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

<p align="center">
  Created by <a href="https://serkanbayraktar.com/">Serkanby</a> &middot; <a href="https://github.com/Serkanbyx">GitHub</a>
</p>

# FindIt — Lost & Found Web Application

A full-stack web application to report, search, and recover lost & found items.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcrypt
- **File Upload**: Multer

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on port `27017`

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## Features

- Register / Login with JWT authentication
- Report a **Lost** or **Found** item with photo upload
- Browse all items with filters (type, category, keyword search)
- View item details and contact the reporter via email/phone
- Possible match suggestions on item detail page
- Dashboard to manage your own reports (edit, delete, mark resolved)
- Profile page to update name, phone, password

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items (with filters) |
| GET | `/api/items/my` | Get my items (auth) |
| GET | `/api/items/:id` | Get single item |
| GET | `/api/items/:id/suggestions` | Get match suggestions (auth) |
| POST | `/api/items` | Create item report (auth) |
| PUT | `/api/items/:id` | Update item (auth, owner) |
| DELETE | `/api/items/:id` | Delete item (auth, owner) |

---

## Project Structure

```
FindIt/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── uploads/
│   └── .env
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

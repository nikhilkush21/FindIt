# 🔍 FindIt — AI-Powered Lost & Found Platform

> **College Project** | React + Node.js + MongoDB + Python AI Service  
> Ek aisa platform jo AI ki madad se lost aur found items ko automatically match karta hai.

---

## 📋 Table of Contents

1. [Project Kya Hai?](#1-project-kya-hai)
2. [Problem aur Solution](#2-problem-aur-solution)
3. [Features ki Complete List](#3-features-ki-complete-list)
4. [Technology Stack](#4-technology-stack)
5. [Project ka Poora Structure](#5-project-ka-poora-structure)
6. [System Architecture — Sab kuch kaise juda hai](#6-system-architecture--sab-kuch-kaise-juda-hai)
7. [Database Schema — Har Model ki Poori Detail](#7-database-schema--har-model-ki-poori-detail)
8. [Backend — Har File ka Code aur Matlab](#8-backend--har-file-ka-code-aur-matlab)
9. [Frontend — Har File ka Code aur Matlab](#9-frontend--har-file-ka-code-aur-matlab)
10. [AI Service — Har Function Explain Kiya](#10-ai-service--har-function-explain-kiya)
11. [AI Matching Kaise Kaam Karta Hai](#11-ai-matching-kaise-kaam-karta-hai)
12. [Authentication aur Security](#12-authentication-aur-security)
13. [Poori API Reference](#13-poori-api-reference)
14. [Installation aur Setup](#14-installation-aur-setup)
15. [Environment Variables](#15-environment-variables)
16. [Project Kaise Chalayein](#16-project-kaise-chalayein)
17. [Tests Kaise Chalayein](#17-tests-kaise-chalayein)
18. [Live Demo Karne ka Script](#18-live-demo-karne-ka-script)
19. [Deployment Guide](#19-deployment-guide)
20. [Known Limitations](#20-known-limitations)
21. [Viva Questions aur Answers](#21-viva-questions-aur-answers)

---

## 1. Project Kya Hai?

**FindIt** ek web-based platform hai jahan log apni khoyi hui cheezein report kar sakte hain, aur jo log koi cheez milti hain woh bhi report kar sakte hain. Platform ka AI engine automatically dono taraf ke reports ko compare karta hai aur **similarity score** deta hai — taaki user easily pata kar sake ki kaun sa found item unka ho sakta hai.

### Ek Example se Samjho:

```
User A apna kala wallet library mein bhool gaya.
User B ko ek kala wallet library ke paas mila.

FindIt ka AI:
  - "kala wallet" vs "kala wallet" → text similarity: 85%
  - "library" vs "library ke paas" → location similarity: 60%
  - Dates 2 din apart → date score: 93%
  - Overall Score: 78%

Result: User A ko notification milti hai:
"Potential match found! A found item 'Black wallet' may match
your lost item (78% similarity)"

User A claim submit karta hai → User B review karta hai → Approved!
```

**Important:** Similarity score ownership prove nahi karta. Woh sirf ek ranking tool hai.

---

## 2. Problem aur Solution

### Problem

Traditional lost & found systems mein:
- ❌ Koi search/filter nahi hota
- ❌ Manually har post dekhni padti hai
- ❌ Phone numbers publicly expose ho jaate hain
- ❌ Koi verification process nahi hota
- ❌ Koi history ya accountability nahi hoti

### Solution (FindIt)

- ✅ AI automatically similar items match karta hai
- ✅ Contact info sirf logged-in users ko dikhti hai
- ✅ Private verification process se ownership check hoti hai
- ✅ Admin moderation se fake/spam content remove hota hai
- ✅ Puri history track hoti hai (claims, matches, notifications)

---

## 3. Features ki Complete List

| # | Feature | Kya karta hai |
|---|---------|--------------|
| 1 | User Registration | Naam, email, phone se account banao |
| 2 | User Login | JWT token milta hai, 7 din valid |
| 3 | Forgot Password | Token generate hota hai (dev mode mein response mein dikhta hai) |
| 4 | Reset Password | Token verify hota hai, 1 ghante mein expire |
| 5 | Change Password | Purana password verify karke naya set karo |
| 6 | Lost Item Report | Title, description, category, location, date, 4 photos tak |
| 7 | Found Item Report | Same form, sirf type alag |
| 8 | Auto-Category Detection | "phone" type karo → "Electronics" auto-select ho jaata hai |
| 9 | Browse & Filter | Type, category, status se filter; text search |
| 10 | Pagination | 12 items per page |
| 11 | Item Detail Page | Photos, description, contact info (auth se gate), AI matches |
| 12 | Image Lightbox | Photo click karo zoom ke liye |
| 13 | AI Text Matching | Sentence Transformers se semantic similarity |
| 14 | Keyword Fallback | AI offline ho toh Jaccard similarity |
| 15 | Match Dismiss | Irrelevant matches hide karo |
| 16 | Submit Claim | Message + private verification answers |
| 17 | Claim Review | Item reporter approve/reject karta hai |
| 18 | Claim Withdrawal | Pending claim wapas le sakte ho |
| 19 | In-App Notifications | Har 30 second mein poll hota hai, unread badge |
| 20 | User Dashboard | Stats + item list + quick actions |
| 21 | My Claims Page | Apne saare claims track karo |
| 22 | Profile Settings | Naam, phone, bio edit; password change |
| 23 | Admin Dashboard | Real DB stats: users, items, claims |
| 24 | Admin Item Moderation | Items approve/reject karo |
| 25 | Admin User Management | Users suspend/restore, admin promote |
| 26 | Admin Abuse Reports | Flagged content review karo |
| 27 | Abuse Reporting | Koi bhi listing flag kar sakta hai (24h rate limit) |
| 28 | Role-Based Auth | user vs admin — server-side enforce hota hai |
| 29 | Private Contact Info | Email/phone sirf login users ko dikhti hai |
| 30 | Rate Limiting | Auth: 20 req/15min; Global: 100 req/15min |
| 31 | Security Headers | Helmet.js (XSS, Clickjacking protection) |
| 32 | CORS | Sirf allowed origins se request |
| 33 | Zod Validation | Frontend form + backend middleware dono mein |
| 34 | Soft Delete | Items delete hone par isDeleted=true hota hai |
| 35 | Cloudinary | Cloud image storage (local fallback available) |
| 36 | How It Works Page | Step-by-step guide |
| 37 | Privacy Policy | Data handling documentation |
| 38 | Custom 404 Page | Friendly error page |
| 39 | Responsive Design | Mobile, tablet, desktop sab pe kaam karta hai |
| 40 | Loading Skeletons | Data load hone tak placeholder dikhta hai |

---

## 4. Technology Stack

### Frontend (Browser mein chalta hai)

| Package | Kya karta hai |
|---------|--------------|
| **React 18** | UI components banata hai, state manage karta hai |
| **Vite** | Development server + production build tool |
| **Tailwind CSS** | Utility classes se styling (btn-primary, input, card, etc.) |
| **React Router v6** | Browser mein page navigation bina page reload ke |
| **Axios** | Backend API ko HTTP requests bhejta hai |
| **React Hook Form** | Form state manage karta hai efficiently |
| **Zod** | Form validation schema define karta hai |
| **@hookform/resolvers** | React Hook Form ko Zod se connect karta hai |
| **Lucide React** | SVG icon library |
| **React Hot Toast** | Top-right corner mein success/error messages |

### Backend (Server pe chalta hai)

| Package | Kya karta hai |
|---------|--------------|
| **Node.js + Express** | HTTP server, API routes handle karta hai |
| **Mongoose** | MongoDB ke saath ODM (schema, validation, queries) |
| **bcryptjs** | Password ko hash karta hai (12 rounds) |
| **jsonwebtoken** | JWT token banata aur verify karta hai |
| **Zod** | Request body validation |
| **Helmet** | Security HTTP headers set karta hai |
| **express-rate-limit** | IP per request limit lagata hai |
| **cors** | Cross-origin requests control karta hai |
| **multer** | File upload middleware |
| **cloudinary + multer-storage-cloudinary** | Images Cloudinary pe upload karta hai |
| **axios** | AI service ko call karta hai |
| **dotenv** | .env file se environment variables load karta hai |
| **nodemon** | Development mein auto-restart |

### AI Service (Python mein chalta hai)

| Package | Kya karta hai |
|---------|--------------|
| **FastAPI** | Python ka fast web framework, automatic API docs |
| **uvicorn** | ASGI server jo FastAPI chalata hai |
| **sentence-transformers** | Text ko 384-dim vector mein convert karta hai |
| **numpy** | Vector math (cosine similarity) |
| **httpx** | Async HTTP client (images fetch karne ke liye CLIP mein) |
| **Pillow** | Image loading aur processing |
| **pydantic** | Request/response data validation |

---

## 5. Project ka Poora Structure

```
FindIt/
│
├── .env.example              ← Saare environment variables ka template
├── .gitignore                ← Kya git mein nahi jaana chahiye
├── README.md                 ← Yeh file
├── package.json              ← Root-level scripts (npm run backend/frontend)
│
├── backend/                  ← Node.js + Express REST API
│   ├── .env                  ← Actual secrets (git mein nahi jaata)
│   ├── package.json          ← Backend dependencies
│   ├── uploads/              ← Local image storage (Cloudinary nahi ho toh)
│   └── src/
│       ├── server.js         ← Entry point: app setup + DB connection
│       │
│       ├── controllers/      ← Business logic (request ko process karna)
│       │   ├── authController.js       ← Login, register, password reset
│       │   ├── itemController.js       ← Items CRUD + matching trigger
│       │   ├── claimController.js      ← Claims workflow
│       │   ├── notificationController.js ← Notifications read/unread
│       │   ├── adminController.js      ← Admin stats + moderation
│       │   └── abuseController.js      ← Abuse report submit
│       │
│       ├── middleware/        ← Reusable Express middleware
│       │   ├── auth.js        ← JWT verify, admin check
│       │   ├── validate.js    ← Zod schema validation wrapper
│       │   ├── upload.js      ← Legacy multer (cloudinary.js use karo)
│       │   └── errorHandler.js ← Central error response
│       │
│       ├── models/            ← MongoDB schema definitions
│       │   ├── User.js
│       │   ├── Item.js
│       │   ├── ClaimRequest.js
│       │   ├── Match.js
│       │   ├── Notification.js
│       │   └── AbuseReport.js
│       │
│       ├── routes/            ← URL to controller mapping
│       │   ├── auth.js
│       │   ├── items.js
│       │   ├── claims.js
│       │   ├── notifications.js
│       │   ├── admin.js
│       │   └── abuse.js
│       │
│       ├── utils/             ← Helper modules
│       │   ├── cloudinary.js     ← Image upload setup
│       │   ├── aiClient.js       ← AI service call + fallback
│       │   ├── matchingService.js ← Match compute + save
│       │   └── notifications.js  ← Notification create helper
│       │
│       └── validators/        ← Zod schemas
│           ├── authValidators.js
│           └── itemValidators.js
│
├── frontend/                  ← React + Vite application
│   ├── index.html             ← HTML entry point (root div)
│   ├── vite.config.js         ← Vite setup + dev proxy /api → :5000
│   ├── tailwind.config.js     ← Tailwind CSS configuration
│   ├── postcss.config.js      ← PostCSS (Tailwind ke liye)
│   ├── package.json
│   └── src/
│       ├── main.jsx           ← React app start karta hai
│       ├── App.jsx            ← Saare routes define hain yahan
│       ├── index.css          ← Global styles + design tokens
│       │
│       ├── api/
│       │   └── axios.js       ← Pre-configured Axios (auto JWT header)
│       │
│       ├── context/
│       │   ├── AuthContext.jsx         ← User state globally
│       │   └── NotificationContext.jsx ← Unread count polling
│       │
│       ├── components/        ← Reusable UI pieces
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ItemCard.jsx
│       │   ├── ItemForm.jsx
│       │   ├── MatchScoreCard.jsx
│       │   ├── ConfirmDialog.jsx
│       │   └── Skeleton.jsx
│       │
│       └── pages/             ← Ek file = ek route/page
│           ├── Home.jsx               → /
│           ├── Login.jsx              → /login
│           ├── Register.jsx           → /register
│           ├── ForgotPassword.jsx     → /forgot-password
│           ├── ResetPassword.jsx      → /reset-password
│           ├── Browse.jsx             → /browse
│           ├── ItemDetail.jsx         → /items/:id
│           ├── ReportItem.jsx         → /report
│           ├── EditItem.jsx           → /items/:id/edit
│           ├── Dashboard.jsx          → /dashboard
│           ├── MyClaims.jsx           → /my-claims
│           ├── Profile.jsx            → /profile
│           ├── Notifications.jsx      → /notifications
│           ├── HowItWorks.jsx         → /how-it-works
│           ├── Privacy.jsx            → /privacy
│           ├── NotFound.jsx           → /* (404)
│           └── admin/
│               ├── AdminDashboard.jsx → /admin
│               ├── AdminItems.jsx     → /admin/items
│               ├── AdminUsers.jsx     → /admin/users
│               └── AdminAbuse.jsx     → /admin/abuse
│
├── ai-service/                ← Python FastAPI AI matching
│   ├── main.py                ← Poora AI service ek file mein
│   ├── test_matching.py       ← Unit tests (server nahi chahiye)
│   ├── requirements.txt       ← Python dependencies
│   └── .env.example
│
└── docs/
    ├── architecture.md        ← System diagrams
    └── viva-questions.md      ← Q&A for presentation
```

---

## 6. System Architecture — Sab kuch kaise juda hai

```
╔══════════════════════════════════════════════════════════════╗
║              USER KA BROWSER                                  ║
║         React + Vite + Tailwind CSS                          ║
║         http://localhost:5173                                 ║
╚══════════════════════╦═══════════════════════════════════════╝
                       ║ HTTPS  /api/v1/*
                       ║ Authorization: Bearer <JWT>
                       ▼
╔══════════════════════════════════════════════════════════════╗
║              EXPRESS BACKEND (Node.js)                        ║
║              http://localhost:5000                            ║
║                                                               ║
║  Request aata hai → Middleware chain → Controller → Response  ║
║                                                               ║
║  Middleware order:                                            ║
║  1. Helmet (security headers)                                 ║
║  2. CORS check                                                ║
║  3. Rate Limiter                                              ║
║  4. Body Parser (JSON)                                        ║
║  5. Route Match                                               ║
║  6. protect/adminOnly (JWT check)                             ║
║  7. validate (Zod)                                            ║
║  8. Controller (actual logic)                                 ║
║  9. errorHandler (agar koi error aya)                         ║
╚══════╦═════════════════════════════════╦═════════════════════╝
       ║ Mongoose                        ║ axios.post('/match')
       ▼                                 ▼
╔══════════════╗              ╔════════════════════════╗
║   MONGODB    ║              ║   AI SERVICE (Python)  ║
║ localhost    ║              ║   localhost:8000       ║
║   :27017     ║              ║                        ║
║              ║              ║  GET  /health          ║
║ Collections: ║              ║  POST /match           ║
║ • users      ║              ║                        ║
║ • items      ║              ║  Text: Sentence        ║
║ • claims     ║              ║  Transformers          ║
║ • matches    ║              ║  Image: CLIP (opt)     ║
║ • notifs     ║              ║  Location: Jaccard     ║
║ • abuserepo  ║              ║  Date: e^(-days/30)    ║
╚══════════════╝              ╚════════════════════════╝
```

### Item Create hone ke baad kya hota hai (Data Flow)

```
User POST /api/v1/items karta hai (form data + images)
         │
         ▼
Multer middleware → image Cloudinary pe upload hoti hai
         │         (ya local disk pe agar Cloudinary set nahi)
         ▼
Zod validate → saare fields check
         │
         ▼
itemController.createItem() → MongoDB mein Item save hota hai
         │
         ▼
Express 201 response → browser ko item ka data milta hai
         │
         │ (async — user wait nahi karta)
         ▼
setImmediate(() => findMatchesForItem(item))
         │
         ▼
50 opposite-type items same category ke fetch
         │
         ▼
Har candidate ke liye:
  aiClient.computeMatch() → POST :8000/match
         │
         ├── AI responds → scores save, aiStatus='completed'
         │
         └── AI offline → fallbackMatch() → save, aiStatus='fallback'
                │
                └── score >= 0.5 → createNotification() reporter ko
```

---

## 7. Database Schema — Har Model ki Poori Detail

### 7.1 User (`backend/src/models/User.js`)

Yeh file define karti hai ki MongoDB mein users ka data kaise store hoga.

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  // trim: spaces hatata hai automatically
  
  email: {
    type: String,
    required: true,
    unique: true,        // duplicate email nahi ho sakti
    lowercase: true,     // "User@Email.com" → "user@email.com"
    match: [/regex/, 'Invalid email'],  // format validate karta hai
  },
  
  password: { type: String, required: true },
  // Actual password stored nahi hota — sirf bcrypt hash
  
  phone: { type: String, default: '' },
  // optional, default empty string
  
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Admin banana ho toh MongoDB se manually set karo
  
  isActive: { type: Boolean, default: true },
  // false = account suspended by admin
  
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // Forgot password ke liye token store hota hai (SHA-256 hash)
  
}, { timestamps: true });
// timestamps: true → MongoDB automatically createdAt aur updatedAt add karta hai
```

**Important Functions:**

```javascript
// Pre-save hook: jab bhi password change ho, automatically hash karo
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // agar password nahi badla toh skip
  this.password = await bcrypt.hash(this.password, 12); // 12 = salt rounds
  next();
});

// Instance method: login ke time password check karne ke liye
userSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
  // true ya false return karta hai
};

// toJSON transform: jab bhi user object JSON bane, password remove kar do
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;           // password kabhi response mein nahi jayega
    delete ret.resetPasswordToken; // reset token bhi nahi
    return ret;
  }
});
```

---

### 7.2 Item (`backend/src/models/Item.js`)

Platform ka core model — har lost/found report yahan store hoti hai.

```javascript
const CATEGORIES = [
  'Electronics', 'Wallet/Purse', 'ID/Cards', 'Keys',
  'Bag', 'Clothing', 'Jewelry', 'Books/Documents', 'Accessories', 'Other'
];

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  // 'lost' = kisi ne khoyi hui cheez report ki
  // 'found' = kisi ko koi cheez mili aur report ki
  
  title: { type: String, required: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: String, enum: CATEGORIES, default: 'Other' },
  
  images: [{ type: String }],
  // Array of strings — Cloudinary URLs ya /uploads/filename.jpg
  
  location: { type: String, required: true, maxlength: 200 },
  // Free text: "Library Block A, 2nd Floor"
  
  date: { type: Date, required: true },
  // Kab khoyi/mili
  
  status: {
    type: String,
    enum: ['open', 'claimed', 'resolved', 'expired'],
    default: 'open'
  },
  // open → jab koi claim karta hai → claimed
  // claimed approve hone par → resolved
  
  identifyingFeatures: { type: String, default: '', maxlength: 500 },
  // Extra details: "serial number starts with DNPXW, blue case"
  // AI matching mein use hota hai
  
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Reference to User model
  
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // by default approve, admin reject kar sakta hai
  },
  
  isDeleted: { type: Boolean, default: false },
  // Soft delete — delete karne par true hota hai, DB se hata nahi
  
  textEmbedding: { type: String, default: '' },
  imageEmbedding: { type: String, default: '' },
  // Future caching ke liye AI embeddings
});

// Indexes — queries fast banate hain
itemSchema.index({ type: 1, status: 1, category: 1 }); // browse filters ke liye
itemSchema.index({ title: 'text', description: 'text', location: 'text' }); // text search
itemSchema.index({ reportedBy: 1 }); // "my items" ke liye
itemSchema.index({ date: -1 }); // date sort ke liye
```

---

### 7.3 ClaimRequest (`backend/src/models/ClaimRequest.js`)

Jab koi user bolte hain "yeh item mera hai" — woh claim yahan store hoti hai.

```javascript
const claimSchema = new mongoose.Schema({
  item: { type: ObjectId, ref: 'Item', required: true },
  claimant: { type: ObjectId, ref: 'User', required: true },
  
  message: { type: String, required: true, maxlength: 1000 },
  // Claimant explain karta hai kyun yeh item unka hai
  
  verificationAnswers: [{
    question: String,
    answer: String
  }],
  // PRIVATE — sirf item owner aur admin dekh sakte hain
  // Example: { question: "Serial number?", answer: "DNPXW1234" }
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  reviewedBy: { type: ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  reviewNote: { type: String, default: '' },
  // Reviewer ka note: "Approved — verified via serial number"
  
  contactShared: { type: Boolean, default: false },
  // Approve hone ke baad true — contact info unlock hoti hai
});

// UNIQUE INDEX: ek user ek item pe sirf ek baar claim kar sakta hai
claimSchema.index({ item: 1, claimant: 1 }, { unique: true });
```

---

### 7.4 Match (`backend/src/models/Match.js`)

AI ke computed similarity scores yahan store hote hain.

```javascript
const matchSchema = new mongoose.Schema({
  lostItem: { type: ObjectId, ref: 'Item', required: true },
  foundItem: { type: ObjectId, ref: 'Item', required: true },
  
  overallScore: { type: Number, default: 0, min: 0, max: 1 },
  // 0.78 = 78% similar
  
  componentScores: {
    text: Number,     // Sentence Transformer similarity
    image: Number,    // CLIP image similarity (0 if disabled)
    location: Number, // Location token overlap
    date: Number      // Date proximity score
  },
  
  aiStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'fallback'],
    default: 'pending'
  },
  // 'fallback' = AI offline tha, keyword matching use hua
  
  dismissedBy: [{ type: ObjectId, ref: 'User' }],
  // Agar user ne match dismiss kiya, unka ID yahan add hota hai
});

// Unique: ek lost+found pair ke liye sirf ek match document
matchSchema.index({ lostItem: 1, foundItem: 1 }, { unique: true });
// Score se sort karne ke liye
matchSchema.index({ lostItem: 1, overallScore: -1 });
```

---

### 7.5 Notification (`backend/src/models/Notification.js`)

In-app notifications — bell icon ke messages.

```javascript
const notificationSchema = new mongoose.Schema({
  recipient: { type: ObjectId, ref: 'User', required: true },
  
  type: {
    type: String,
    enum: [
      'claim_received',  // Kisi ne aapke item pe claim kiya
      'claim_approved',  // Aapki claim approve hui
      'claim_rejected',  // Aapki claim reject hui
      'match_found',     // AI ne potential match dhundha
      'item_moderated',  // Admin ne aapka item reject kiya
      'item_resolved',   // Item resolved mark hua
      'system'           // Generic
    ]
  },
  
  title: String,   // Short: "Your claim was approved!"
  message: String, // Long: "Your claim for 'Black iPhone' has been approved..."
  
  relatedItem: { type: ObjectId, ref: 'Item' },  // Link to item
  relatedClaim: { type: ObjectId, ref: 'ClaimRequest' },
  
  isRead: { type: Boolean, default: false },
  // User ne notification dekha → true
});

// Fast unread count query ke liye (har 30 second poll hota hai)
notificationSchema.index({ recipient: 1, isRead: 1 });
```

---

### 7.6 AbuseReport (`backend/src/models/AbuseReport.js`)

Jab koi user kisi listing ya user ko report karta hai.

```javascript
const abuseReportSchema = new mongoose.Schema({
  reporter: { type: ObjectId, ref: 'User', required: true },
  reportedItem: { type: ObjectId, ref: 'Item' },   // Ya item
  reportedUser: { type: ObjectId, ref: 'User' },   // Ya user report karo
  
  reason: {
    type: String,
    enum: ['spam', 'fake', 'inappropriate', 'harassment', 'duplicate', 'other']
  },
  
  details: { type: String, maxlength: 1000 },
  
  status: {
    type: String,
    enum: ['open', 'reviewed', 'resolved', 'dismissed'],
    default: 'open'
  },
  
  reviewedBy: { type: ObjectId, ref: 'User' }, // Kon se admin ne review kiya
  adminAction: { type: String, default: '' },  // Kya action liya
});
```

---

## 8. Backend — Har File ka Code aur Matlab

### 8.1 `backend/src/server.js` — Application Entry Point

Yeh poora application ka starting point hai. Isko samjho:

```javascript
require('dotenv').config();
// .env file se variables load karta hai
// Jaise: process.env.MONGO_URI = "mongodb://localhost..."

// STEP 1: Check karo koi zaruri variable missing toh nahi
const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`Missing: ${missing.join(', ')}`);
  process.exit(1); // Server start hi nahi hoga
}

// STEP 2: Helmet — Security headers lagata hai
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
  // Yeh isliye ki Cloudinary images load ho sakein browser mein
}));

// STEP 3: CORS — Sirf allowed origins se requests
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS: not allowed'));
    // Agar koi aur origin se request aaye toh block
  }
}));

// STEP 4: Global Rate Limiter — DDoS/spam se bachata hai
app.use(rateLimit({
  windowMs: 900000,  // 15 minutes
  max: 100           // 100 requests per IP per 15 min
}));

// STEP 5: Body parsers
app.use(express.json({ limit: '10mb' }));
// JSON body parse karta hai, 10MB se bada reject

// STEP 6: Static files — local images serve karne ke liye
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// STEP 7: Health check — deployment verification ke liye
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    // 1 = connected, 0 = disconnected, 2 = connecting
  });
});

// STEP 8: Routes mount karna
app.use('/api/v1/auth', authRoutes);       // Login, register
app.use('/api/v1/items', itemRoutes);      // Items CRUD
app.use('/api/v1/claims', claimRoutes);    // Claims
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);     // Admin endpoints
app.use('/api/v1/abuse-reports', abuseRoutes);

// STEP 9: 404 handler — agar koi unknown API route
app.use('/api', (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// STEP 10: Error handler — LAST middleware, errors yahan aate hain
app.use(errorHandler);

// STEP 11: MongoDB connect karo, phir server start karo
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB failed:', err.message);
    process.exit(1); // DB connect nahi hua toh server start nahi hoga
  });
```

---

### 8.2 `backend/src/middleware/auth.js` — Authentication Middleware

Teen functions export karta hai:

```javascript
// FUNCTION 1: protect
// Protected routes ke liye — bina login ke access nahi
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Browser bhejta hai: "Authorization: Bearer eyJhbGci..."
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
    // ?. = optional chaining, agar header null ho toh crash nahi
  }
  
  const token = authHeader.split(' ')[1];
  // "Bearer TOKEN" → TOKEN
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Agar token tamper hua hai ya expire hua toh exception throw hoga
  // decoded = { id: "user_mongo_id", iat: ..., exp: ... }
  
  const user = await User.findById(decoded.id).select('-password');
  // DB se user fetch, password field exclude (.select('-password'))
  
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Account suspended' });
  }
  
  req.user = user; // User object ko request mein daal do
  next();           // Agle middleware/controller pe jao
};

// FUNCTION 2: adminOnly
// Sirf admin role ke liye — protect ke BAAD use karo
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
    // 403 = Forbidden (login ho but permission nahi)
  }
  next();
};

// FUNCTION 3: optionalAuth
// Public routes ke liye — agar login hai toh user attach karo, nahi toh proceed karo
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user?.isActive) req.user = user;
      // User set karo, but error pe bhi proceed karo
    } catch (_) {
      // Invalid token? Ignore karo silently
    }
  }
  next(); // ALWAYS next() call karo — kabhi block mat karo
};
```

**Kahan use hota hai:**
- `protect` → `/items` POST/PUT/DELETE, `/claims`, `/notifications`, etc.
- `adminOnly` → sabhi `/admin/*` routes (protect ke saath)
- `optionalAuth` → `GET /items`, `GET /items/:id` (contact info auth se dikhti hai)

---

### 8.3 `backend/src/middleware/validate.js` — Zod Validation Middleware

```javascript
const validate = (schema) => (req, res, next) => {
  // Factory function: schema leti hai, middleware return karti hai
  
  const result = schema.safeParse(req.body);
  // safeParse = throw nahi karta, result object return karta hai
  // result.success = true/false
  // result.data = parsed data (with defaults applied)
  // result.error = validation errors
  
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'), // "verificationAnswers.0.answer"
      message: e.message       // "Required", "Too long", etc.
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  req.body = result.data;
  // Coerced data use karo — Zod ne defaults apply kiye, types correct kiye
  
  next();
};
```

**Usage route mein:**
```javascript
router.post('/register',
  authLimiter,           // Rate limit
  validate(registerSchema), // Zod validate
  register               // Controller
);
```

---

### 8.4 `backend/src/middleware/errorHandler.js` — Central Error Handler

Saari errors yahan aati hain — controllers mein `next(err)` call hota hai.

```javascript
const errorHandler = (err, req, res, next) => {
  // 4 parameters → Express isko error handler samajhta hai
  
  console.error('[ErrorHandler]', err);
  
  // Case 1: MongoDB duplicate key (unique field repeat hua)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]; // "email"
    return res.status(400).json({ message: `${field} is already in use` });
  }
  
  // Case 2: Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  // Case 3: File too large (Multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum 5MB.' });
  }
  
  // Default: status code or 500
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    // Stack trace sirf development mein
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

### 8.5 `backend/src/utils/cloudinary.js` — Image Upload Setup

```javascript
// Check: Kya Cloudinary credentials set hain?
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({ ... }); // credentials set karo
}

// OPTION A: Cloudinary storage
const cloudinaryStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'findit-items',          // Cloudinary mein folder naam
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{
          width: 1200, height: 1200,
          crop: 'limit',                  // 1200x1200 se bada resize
          quality: 'auto'                 // Auto quality optimization
        }]
      }
    })
  : null;

// OPTION B: Local disk storage (fallback)
const localStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString().slice(2)}`;
    cb(null, unique + path.extname(file.originalname));
    // Example: "1699876543210-4829302.jpg"
  }
});

// File type validation — MIME type + extension dono check
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true); // Accept
  else cb(new Error('Only images allowed'), false); // Reject
};

// Final multer instance
const upload = multer({
  storage: cloudinaryStorage || localStorage, // Cloudinary prefer, fallback local
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 } // 5MB per file, max 4 files
});
```

---

### 8.6 `backend/src/utils/aiClient.js` — AI Service Communication

```javascript
async function computeMatch(lostItem, foundItem) {
  // AI service ko data bhejo
  const payload = {
    lost: {
      title: lostItem.title,
      description: lostItem.description,
      category: lostItem.category,
      identifying_features: lostItem.identifyingFeatures || '',
      image_url: lostItem.images?.[0] || '',  // Pehli image URL
      location: lostItem.location,
      date: lostItem.date,
    },
    found: { /* same fields */ }
  };
  
  try {
    const { data } = await axios.post(`${AI_URL}/match`, payload, {
      timeout: TIMEOUT  // 10 seconds mein nahi aaya toh timeout
    });
    return { success: true, data };
    // data = { overall_score: 0.78, component_scores: {...}, method: "sentence_transformer" }
    
  } catch (err) {
    console.warn('[AI Client]', err.message);
    return { success: false, error: err.message };
    // Kabhi throw nahi karta — graceful failure
  }
}

function fallbackMatch(lostItem, foundItem) {
  // Pure JS keyword matching — AI nahi chahiye

  function tokenize(str) {
    return (str || '').toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')  // Punctuation remove
      .split(/\s+/)                   // Words mein split
      .filter(Boolean);               // Empty strings remove
  }
  
  // Lost item ke saare words ek Set mein
  const lostTokens = new Set([
    ...tokenize(lostItem.title),
    ...tokenize(lostItem.description),
    ...tokenize(lostItem.identifyingFeatures)
  ]);
  
  // Found item ke words
  const foundTokens = new Set([...]);
  
  // Jaccard Similarity = intersection / union
  const intersection = [...lostTokens].filter(t => foundTokens.has(t)).length;
  const union = new Set([...lostTokens, ...foundTokens]).size;
  const textScore = union > 0 ? intersection / union : 0;
  
  // Location aur date bhi same tarah
  
  // Same category? 15% bonus
  const overall = Math.min(1, baseScore * (1 + categoryMatch * 0.15));
  
  return {
    overall_score: overall,
    component_scores: { text, image: 0, location, date },
    method: 'keyword_fallback'  // UI mein warning dikhaega
  };
}
```

---

### 8.7 `backend/src/utils/matchingService.js` — Match Orchestration

```javascript
const MATCH_THRESHOLD = 0.25; // 25% se kam score → save mat karo

async function findMatchesForItem(item) {
  // Item agar 'lost' hai toh 'found' items search karo, aur vice versa
  const oppositeType = item.type === 'lost' ? 'found' : 'lost';
  
  // Candidates: same category, open, approved, not deleted, not same item
  const candidates = await Item.find({
    type: oppositeType,
    category: item.category,    // Sirf same category match karo
    status: 'open',
    moderationStatus: 'approved',
    isDeleted: false,
    _id: { $ne: item._id }      // Khud se match mat karo
  }).limit(50).lean();           // Max 50 candidates
  
  for (const candidate of candidates) {
    const lostItem = item.type === 'lost' ? item : candidate;
    const foundItem = item.type === 'found' ? item : candidate;
    
    // Already compute hua hai? Skip
    const existing = await Match.findOne({ lostItem: lostItem._id, foundItem: foundItem._id });
    if (existing) continue;
    
    await computeAndSaveMatch(lostItem, foundItem);
  }
}

async function computeAndSaveMatch(lostItem, foundItem) {
  // Atomic upsert: agar document nahi hai toh create, hai toh update
  const matchDoc = await Match.findOneAndUpdate(
    { lostItem: lostItem._id, foundItem: foundItem._id },
    { aiStatus: 'processing' },  // Status mark karo
    { upsert: true, new: true }  // Create if not exists, return new doc
  );
  // Yeh prevent karta hai duplicate processing agar 2 requests same time pe aayein
  
  try {
    const aiResult = await computeMatch(lostItem, foundItem);
    
    let scores, method;
    if (aiResult.success) {
      scores = aiResult.data;   // AI ka result
      method = 'ai';
    } else {
      scores = fallbackMatch(lostItem, foundItem);  // Fallback
      method = 'fallback';
    }
    
    const overall = scores.overall_score || 0;
    
    // 25% se kam? Delete karo, useless match
    if (overall < MATCH_THRESHOLD) {
      await matchDoc.deleteOne();
      return null;
    }
    
    // Save scores
    matchDoc.overallScore = overall;
    matchDoc.componentScores = { text, image, location, date };
    matchDoc.aiStatus = method === 'ai' ? 'completed' : 'fallback';
    await matchDoc.save();
    
    // 50%+ score? Notification bhejo
    if (overall >= 0.5) {
      await createNotification({
        recipient: lostFull.reportedBy,
        type: 'match_found',
        title: 'Potential match found!',
        message: `A found item "${foundFull.title}" may match... (${Math.round(overall*100)}% similarity)`
      });
    }
    
  } catch (err) {
    matchDoc.aiStatus = 'failed';
    matchDoc.aiError = err.message;
    await matchDoc.save();
  }
}
```

---

### 8.8 `backend/src/controllers/authController.js` — Auth Logic

```javascript
// Register: Naya account banao
const register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  // req.body Zod ne already validate kar diya hai
  
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  
  const user = await User.create({ name, email, password, phone });
  // pre-save hook → password automatically hash ho jayega
  
  res.status(201).json({
    user: safeUser(user),  // Password remove karke
    token: generateToken(user._id)  // JWT token
  });
};

// generateToken function:
const generateToken = (id) => jwt.sign(
  { id },                    // Payload: sirf user ID
  process.env.JWT_SECRET,    // Secret key
  { expiresIn: '7d' }        // 7 din baad expire
);

// safeUser: Sirf safe fields return karo
const safeUser = (user) => ({
  _id: user._id, name: user.name,
  email: user.email, phone: user.phone,
  role: user.role, bio: user.bio
  // Password, reset tokens yahan nahi hain
});

// Forgot Password:
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  // IMPORTANT: User mile ya na mile, same response do
  // Warna attacker email enumerate kar sakta hai
  if (!user) {
    return res.json({ message: 'If that email is registered, a reset link was sent.' });
  }
  
  // Cryptographically secure random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // DB mein SHA-256 hash store karo (raw token nahi)
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 ghanta
  await user.save();
  
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  if (process.env.NODE_ENV === 'development') {
    // Development mein token directly return karo (email service nahi chahiye)
    return res.json({ message: 'Reset link generated', devToken: token, resetUrl });
  }
  // Production mein: email bhejo (SendGrid/Nodemailer)
};
```

---

### 8.9 `backend/src/controllers/itemController.js` — Items CRUD

```javascript
// GET /items — Browse with filters + pagination
const getItems = async (req, res, next) => {
  const { type, category, search, status = 'open', page = 1, limit = 12, sort = 'newest' } = req.query;
  
  const filter = { isDeleted: false, moderationStatus: 'approved' };
  // Deleted aur unapproved items publicly nahi dikhte
  
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };
  // $text MongoDB ka full-text search index use karta hai
  
  const populateFields = req.user ? 'name email phone' : 'name';
  // Logged-in? Contact info dikhao. Guest? Sirf naam.
  
  const [items, total] = await Promise.all([
    Item.find(filter).populate('reportedBy', populateFields).sort(...).skip(...).limit(...),
    Item.countDocuments(filter)
  ]);
  // Promise.all = dono queries parallel chalti hain (faster)
};

// POST /items — Naya item create karo
const createItem = async (req, res, next) => {
  const images = (req.files || []).map(f => f.path || `/uploads/${f.filename}`);
  // f.path = Cloudinary URL (agar Cloudinary configured hai)
  // f.filename = local filename (agar nahi)
  
  const item = await Item.create({ ...req.body, images, reportedBy: req.user._id });
  
  await item.populate('reportedBy', 'name email phone');
  res.status(201).json(item);
  
  // ASYNC matching — response already bhej diya, ab background mein karo
  setImmediate(() => findMatchesForItem(item.toObject()));
  // setImmediate = current event loop tick complete hone ke baad chalega
};

// DELETE /items/:id — Soft delete
const deleteItem = async (req, res, next) => {
  const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
  
  // Ownership check
  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });
  // String comparison: MongoDB ObjectId direct compare nahi hota, .toString() chahiye
  
  item.isDeleted = true; // Soft delete — DB se remove nahi
  await item.save();
  
  // Cloudinary se images delete karo
  for (const url of item.images) {
    if (url.startsWith('http')) await deleteImage(url);
  }
  
  // Related matches delete karo
  await Match.deleteMany({ $or: [{ lostItem: item._id }, { foundItem: item._id }] });
};
```

---

### 8.10 `backend/src/controllers/claimController.js` — Claims Workflow

```javascript
// POST /items/:id/claims
const createClaim = async (req, res, next) => {
  const item = await Item.findOne({ _id: req.params.id, isDeleted: false });
  
  if (item.status !== 'open') {
    return res.status(400).json({ message: 'Not accepting claims' });
  }
  
  // Self-claim prevent
  if (item.reportedBy._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot claim your own report' });
  }
  
  // Duplicate claim check
  const existing = await ClaimRequest.findOne({ item: item._id, claimant: req.user._id });
  if (existing) return res.status(400).json({ message: 'Already claimed' });
  
  const claim = await ClaimRequest.create({
    item: item._id,
    claimant: req.user._id,
    message: req.body.message,
    verificationAnswers: req.body.verificationAnswers || []
  });
  
  // Reporter ko notification
  await createNotification({ recipient: item.reportedBy._id, type: 'claim_received', ... });
  
  // Item status update
  item.status = 'claimed';
  await item.save();
  
  res.status(201).json(claim);
};

// PUT /claims/:id/review — Approve ya reject
const reviewClaim = async (req, res, next) => {
  const { status, reviewNote } = req.body;
  
  if (status === 'approved') {
    // Item resolved mark karo
    await Item.findByIdAndUpdate(item._id, { status: 'resolved' });
    
    // Baaki saare pending claims reject karo (ek hi approve ho sakta hai)
    await ClaimRequest.updateMany(
      { item: item._id, _id: { $ne: claim._id }, status: 'pending' },
      { status: 'rejected', reviewNote: 'Another claim was approved.' }
    );
  } else if (status === 'rejected') {
    // Agar aur pending claims nahi hain toh item dobara 'open' karo
    const otherPending = await ClaimRequest.countDocuments({
      item: item._id, _id: { $ne: claim._id }, status: 'pending'
    });
    if (otherPending === 0) await Item.findByIdAndUpdate(item._id, { status: 'open' });
  }
  
  // Claimant ko notification
  await createNotification({
    recipient: claim.claimant,
    type: status === 'approved' ? 'claim_approved' : 'claim_rejected',
    ...
  });
};
```

---

### 8.11 `backend/src/controllers/adminController.js` — Admin Operations

```javascript
// GET /admin/stats — Real database se numbers
const getStats = async (req, res, next) => {
  // 12 queries ek saath chalao (parallel = fast)
  const [totalUsers, activeUsers, totalItems, lostItems, ...] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Item.countDocuments({ isDeleted: false }),
    Item.countDocuments({ type: 'lost', isDeleted: false }),
    // ... etc
  ]);
  
  res.json({
    users: { total: totalUsers, active: activeUsers },
    items: { total: totalItems, lost: lostItems, found: foundItems, ... },
    claims: { total: totalClaims, pending: pendingClaims, approved: approvedClaims },
    abuse: { open: openAbuse }
  });
};

// PUT /admin/items/:id/moderate
const moderateItem = async (req, res, next) => {
  const { moderationStatus, moderationNote } = req.body;
  
  item.moderationStatus = moderationStatus;  // 'approved', 'rejected', 'pending'
  item.moderationNote = moderationNote;
  item.moderatedBy = req.user._id;  // Audit trail
  item.moderatedAt = new Date();
  await item.save();
  
  if (moderationStatus === 'rejected') {
    // Reporter ko notify karo
    await createNotification({ recipient: item.reportedBy, type: 'item_moderated', ... });
  }
};

// PUT /admin/users/:id
const updateUser = async (req, res, next) => {
  // Admin apna khud ka account nahi badal sakta yahan se
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot modify your own account here' });
  }
  
  if (isActive !== undefined) user.isActive = isActive;  // Suspend/restore
  if (role) user.role = role;  // Promote/demote
  await user.save();
};
```

---

### 8.12 Routes Files — URL to Controller Mapping

**`routes/items.js`** — Route ordering bahut important hai:

```javascript
router.get('/', optionalAuth, getItems);     // GET /items
router.get('/my', protect, getMyItems);      // GET /items/my ← /my pehle define karo
router.get('/:id', optionalAuth, getItem);   // GET /items/:id ← warna "my" ko ID samjhega
// Agar /:id pehle hota, toh /my pe jaane par "my" ko _id samajh leta aur error aata
```

**`routes/admin.js`** — Har route pe double protection:

```javascript
router.use(protect, adminOnly);
// Yeh ek baar lagaya, ab saare neeche wale routes automatically protected hain

router.get('/stats', getStats);
router.put('/items/:id/moderate', moderateItem);
router.get('/users', getUsers);
```

---

### 8.13 Validators — Zod Schemas

**`validators/authValidators.js`:**

```javascript
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Min 6 characters').max(128),
  phone: z.string().max(20).optional().default(''),
  // optional() = field required nahi
  // default('') = agar nahi diya toh '' use karo
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6, 'Min 6 characters'),
});
// Dono fields required hain
```

**`validators/itemValidators.js`:**

```javascript
const createItemSchema = z.object({
  type: z.enum(['lost', 'found']),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  category: z.enum(CATEGORIES).default('Other'),
  location: z.string().min(2).max(200),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  // refine = custom validation function
  identifyingFeatures: z.string().max(500).optional().default(''),
});

const updateItemSchema = createItemSchema.partial();
// .partial() = saare fields optional kar deta hai (partial update ke liye)

const reviewClaimSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  // Sirf yeh 2 values allowed, kuch aur diya toh 400 error
  reviewNote: z.string().max(500).optional().default(''),
});
```

---

## 9. Frontend — Har File ka Code aur Matlab

### 9.1 `frontend/src/main.jsx` — React Bootstrap

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Global styles + Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* StrictMode: development mein double-render karta hai bugs dhundhne ke liye */}
    <BrowserRouter>
      {/* BrowserRouter: URL changes ko handle karta hai bina page reload ke */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

Yeh file `index.html` ke `<div id="root">` mein React inject karti hai.

---

### 9.2 `frontend/src/App.jsx` — Routes aur Context Providers

```jsx
// Route Guards
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user
    ? children                        // Logged in → page dikhao
    : <Navigate to="/login" replace />; // Nahi toh login pe bhejo
  // replace = history mein add nahi hota, Back button kaam karta hai
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>          {/* User state globally available */}
      <NotificationProvider> {/* Unread count globally */}
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
}
```

**Sabhi Routes:**

| Route | Component | Guard |
|-------|-----------|-------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | ForgotPassword | Public |
| `/reset-password` | ResetPassword | Public |
| `/browse` | Browse | Public |
| `/items/:id` | ItemDetail | Public |
| `/how-it-works` | HowItWorks | Public |
| `/privacy` | Privacy | Public |
| `/report` | ReportItem | **PrivateRoute** |
| `/items/:id/edit` | EditItem | **PrivateRoute** |
| `/dashboard` | Dashboard | **PrivateRoute** |
| `/my-claims` | MyClaims | **PrivateRoute** |
| `/profile` | Profile | **PrivateRoute** |
| `/notifications` | Notifications | **PrivateRoute** |
| `/admin` | AdminDashboard | **AdminRoute** |
| `/admin/items` | AdminItems | **AdminRoute** |
| `/admin/users` | AdminUsers | **AdminRoute** |
| `/admin/abuse` | AdminAbuse | **AdminRoute** |
| `*` | NotFound | Public |

---

### 9.3 `frontend/src/api/axios.js` — HTTP Client

```javascript
const api = axios.create({ baseURL: '/api/v1' });
// baseURL = '/api/v1' → yeh Vite proxy se backend :5000 pe forward hota hai
// vite.config.js mein: proxy: { '/api': 'http://localhost:5000' }

// Request interceptor: har request mein JWT add karo
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('findit_user');
  // localStorage mein save hai: { token, _id, name, email, role, ... }
  
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Har request automatically authenticated ho jaati hai
  }
  return config;
});

// Response interceptor: 401 pe auto-logout
api.interceptors.response.use(
  (res) => res, // Success: as is return karo
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        localStorage.removeItem('findit_user'); // Token clear
        window.location.href = '/login';        // Redirect
      }
    }
    return Promise.reject(err); // Error propagate karo
  }
);
```

---

### 9.4 `frontend/src/context/AuthContext.jsx` — Global Auth State

```jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initial state: localStorage se load (page refresh par bhi login rehta hai)
    try {
      return JSON.parse(localStorage.getItem('findit_user') || 'null');
    } catch { return null; }
  });
  
  const persist = (data) => {
    localStorage.setItem('findit_user', JSON.stringify(data));
    setUser(data); // React state aur localStorage dono sync
  };
  
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist({ ...data.user, token: data.token });
    // User object mein token bhi rakh lo (axios interceptor use karega)
    return data;
  };
  
  const logout = useCallback(() => {
    localStorage.removeItem('findit_user');
    setUser(null);
  }, []);
  // useCallback = function dobara create nahi hoga har render pe
  
  const updateUser = useCallback((updated) => {
    setUser(prev => {
      const merged = { ...prev, ...updated }; // Partial update
      localStorage.setItem('findit_user', JSON.stringify(merged));
      return merged;
    });
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

### 9.5 `frontend/src/context/NotificationContext.jsx` — Notifications Polling

```jsx
export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const fetchUnread = useCallback(async () => {
    if (!user) { setUnreadCount(0); return; }
    // Logged out? Count reset
    
    const { data } = await api.get('/notifications/unread-count');
    setUnreadCount(data.count);
  }, [user]);
  
  useEffect(() => {
    fetchUnread(); // Immediately check
    const interval = setInterval(fetchUnread, 30000); // Har 30 second
    return () => clearInterval(interval); // Cleanup: memory leak prevent
  }, [fetchUnread]);
  
  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, fetchUnread, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
```

`unreadCount` Navbar ke bell icon pe red badge mein dikhta hai.

---

### 9.6 `frontend/src/index.css` — Design System

Tailwind ke `@layer components` mein custom classes define ki hain:

```css
@layer components {
  /* Buttons */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-1.5
           bg-gray-900 text-white px-4 py-2 rounded-lg
           hover:bg-gray-800 active:scale-[0.98] transition-all
           font-medium text-sm disabled:opacity-40;
  }
  /* disabled:opacity-40 → disabled state automatically handle */
  
  .btn-danger {
    @apply inline-flex items-center justify-center gap-1.5
           bg-white text-red-600 border border-red-200
           hover:bg-red-50 rounded-lg ...;
  }
  
  /* Form inputs */
  .input {
    @apply w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-gray-900
           focus:border-transparent bg-white transition-all;
    /* focus:ring-2 = blue outline hata ke gray ring lagata hai */
  }
  
  .input-error { @apply border-red-400 focus:ring-red-400; }
  /* Validation error pe red border */
  
  /* Status badges */
  .badge-lost    { @apply bg-red-50 text-red-600 text-[11px] font-semibold ... rounded-full; }
  .badge-found   { @apply bg-emerald-50 text-emerald-700 ... rounded-full; }
  .badge-resolved { @apply bg-blue-50 text-blue-700 ... rounded-full; }
  .badge-claimed  { @apply bg-amber-50 text-amber-700 ... rounded-full; }
  
  /* Skeleton loading */
  .skeleton { @apply bg-gray-200 rounded-lg animate-pulse; }
  /* animate-pulse = gray box fade in/out karta rehta hai */
  
  /* Layout containers */
  .page-container    { @apply max-w-6xl mx-auto px-4 py-8; }
  .page-container-sm { @apply max-w-2xl mx-auto px-4 py-8; }
}
```

---

### 9.7 `frontend/src/components/ItemForm.jsx` — Smart Item Form

```jsx
// Auto-category detection
const CATEGORY_KEYWORDS = {
  Electronics: ['phone', 'mobile', 'iphone', 'laptop', 'charger', 'airpod', ...],
  'Wallet/Purse': ['wallet', 'purse', 'money', 'cash', ...],
  Keys: ['key', 'keys', 'keychain', ...],
};

function detectCategory(title) {
  const lower = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return null;
}

// useEffect: title change hone par category auto-detect karo
useEffect(() => {
  if (!titleValue) return;
  const detected = detectCategory(titleValue);
  if (detected) {
    setValue('category', detected);  // Form field update
    setAutoCategory(true);            // ⚡ indicator dikhao
  } else {
    setAutoCategory(false);
  }
}, [titleValue, setValue]);

// Multi-image handling
const handleImages = (e) => {
  const files = Array.from(e.target.files || []);
  setImages(prev => [...prev, ...files].slice(0, 4)); // Max 4
  const urls = files.map(f => URL.createObjectURL(f)); // Preview URLs
  setPreviews(prev => [...prev, ...urls].slice(0, 4));
};

// Form submit → FormData banao (file upload ke liye)
const onFormSubmit = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  images.forEach(img => fd.append('images', img)); // Files add karo
  onSubmit(fd); // Parent component ko do
};
```

**React Hook Form + Zod:**
```jsx
const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { type: 'lost', category: 'Other', ... }
});

// register('title') → input ko form se connect karta hai
// handleSubmit → validate karta hai, phir onFormSubmit call karta hai
// watch('title') → titleValue real-time update hota hai
// setValue('category', 'Electronics') → programmatically field set karo
// errors.title?.message → validation error message
```

---

### 9.8 `frontend/src/components/MatchScoreCard.jsx` — AI Match Display

```jsx
export default function MatchScoreCard({ match, currentItemType, onDismiss }) {
  // currentItemType = 'lost' ya 'found' (current item ka type)
  // Agar lost item dekh rahe ho → found item ki details dikhao
  const otherItem = currentItemType === 'lost' ? match.foundItem : match.lostItem;
  
  const score = match.overallScore;
  const pct = Math.round(score * 100); // 0.78 → 78
  
  // Color coding based on score
  const scoreColor =
    pct >= 70 ? 'text-green-600 bg-green-50' :   // High confidence
    pct >= 40 ? 'text-amber-600 bg-amber-50' :   // Medium
    'text-gray-600 bg-gray-50';                    // Low
  
  return (
    <div>
      {/* Score badge */}
      <div className={scoreColor}><Zap /> {pct}%</div>
      
      {/* Component score bars */}
      <ScoreBar label="Text similarity" value={match.componentScores?.text || 0} />
      <ScoreBar label="Location" value={match.componentScores?.location || 0} />
      <ScoreBar label="Date proximity" value={match.componentScores?.date || 0} />
      
      {/* Method indicator */}
      <p>
        {match.aiStatus === 'fallback'
          ? '⚠ Keyword-based match (AI unavailable)'
          : '✓ AI semantic match'}
      </p>
      <p>Similarity score does not prove ownership.</p>
    </div>
  );
}
```

---

### 9.9 Baaki Important Pages

**`pages/ItemDetail.jsx`** — Sabse complex page:
```jsx
useEffect(() => {
  api.get(`/items/${id}`)
    .then(({ data }) => {
      setItem(data);
      // Sirf logged-in users ke liye matches fetch karo
      if (user) api.get(`/items/${id}/matches`).then(({ data: m }) => setMatches(m));
    })
    .catch(() => navigate('/browse', { replace: true }));
    // Item nahi mila? Browse pe bhejo
}, [id, user, navigate]);
// navigate dependency mein hai → ESLint warning nahi aayega
```

**`pages/Dashboard.jsx`** — Tab filtering:
```jsx
const filtered = { all: items, open, lost, found, resolved }[tab] ?? items;
// Object as lookup table — if/else nahi chahiye
// tab = 'open' → open array use karo
// ?? (nullish coalescing) = tab ka value undefined hai toh items use karo
```

**`pages/Browse.jsx`** — URL-based state:
```jsx
const [searchParams, setSearchParams] = useSearchParams();
// ?type=lost&category=Electronics&page=2 → filters URL mein store

const setParam = (key, value) => {
  const p = new URLSearchParams(searchParams);
  if (value) p.set(key, value);
  else p.delete(key); // Empty value = filter remove
  p.delete('page');   // Filter change hone par page 1 pe reset
  setSearchParams(p);
};
// Fayda: URL share kar sako, back button kaam kare, refresh karo toh filters rahe
```

---

## 10. AI Service — Har Function Explain Kiya

### 10.1 `ai-service/main.py` — Complete AI Service

```python
# Startup mein models load karo (ek baar)
@asynccontextmanager
async def lifespan(app):
    load_text_model()   # all-MiniLM-L6-v2 download + load (~90MB)
    load_clip_model()   # CLIP load (sirf ENABLE_CLIP=1 pe)
    yield               # App yahan chalta hai
    # shutdown ke baad cleanup ho sakta hai

# Text model load karna
def load_text_model():
    global text_model
    try:
        from sentence_transformers import SentenceTransformer
        text_model = SentenceTransformer("all-MiniLM-L6-v2")
        # Model pehli baar download hoga (~90MB), cache mein save hoga
    except Exception as e:
        text_model = None  # Model nahi load hua → keyword fallback use hoga
        # Service crash nahi karti — graceful degradation
```

**Text Similarity:**
```python
def semantic_text_score(text_a, text_b):
    if text_model is None:
        return keyword_text_score(text_a, text_b), "keyword_fallback"
    
    # Sentence Transformer: text → 384-dimensional vector
    emb_a = text_model.encode(text_a, normalize_embeddings=True)
    emb_b = text_model.encode(text_b, normalize_embeddings=True)
    
    # Cosine similarity: dono vectors ke beech ka angle
    # 1.0 = same direction (identical meaning)
    # 0.0 = perpendicular (no relation)
    # -1.0 = opposite direction (opposite meaning)
    score = cosine_similarity(np.array(emb_a), np.array(emb_b))
    
    # [-1, 1] → [0, 1] normalize
    score = (score + 1) / 2
    
    return float(score), "sentence_transformer"

def cosine_similarity(a, b):
    norm_a = np.linalg.norm(a)  # Vector ka magnitude
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0  # Zero vector se compare nahi kar sakte
    return float(np.dot(a, b) / (norm_a * norm_b))
    # dot product = a1*b1 + a2*b2 + ... + a384*b384
```

**Date Score:**
```python
def date_score(date_a, date_b, max_days=30.0):
    # Exponential decay formula:
    # score = e^(-days_apart / max_days)
    
    # 0 days apart  → e^0 = 1.0 (perfect)
    # 7 days apart  → e^(-7/30) ≈ 0.79
    # 30 days apart → e^(-1) ≈ 0.37
    # 60 days apart → e^(-2) ≈ 0.14
    
    diff_days = abs((dt_a - dt_b).days)
    return float(math.exp(-diff_days / max_days))
```

**Weight Redistribution:**
```python
weights = {"text": 0.40, "image": 0.30, "location": 0.20, "date": 0.10}

if i_score == 0.0:
    # Image nahi hai → weight redistribute karo
    weights["text"] += weights["image"] * 0.6      # 0.40 + 0.18 = 0.58
    weights["location"] += weights["image"] * 0.4   # 0.20 + 0.12 = 0.32
    weights["image"] = 0.0                           # 0.30 → 0.0
# Total weights = 0.58 + 0.32 + 0.10 = 1.0 ✓

overall = (
    weights["text"] * t_score +
    weights["image"] * i_score +  # 0 (redistributed)
    weights["location"] * l_score +
    weights["date"] * d_score
)

# Category bonus: same category? 15% boost
if category_match:
    overall = min(1.0, overall * 1.15)
```

---

## 11. AI Matching Kaise Kaam Karta Hai

### Poora Flow

```
1. User A reports: "Lost Black iPhone 14, Electronics, Library"
2. User B reports: "Found iPhone with blue case, Electronics, near Library"
3. matchingService.findMatchesForItem() chalti hai (background mein)
4. aiClient.computeMatch() → POST http://localhost:8000/match

AI Service receives:
{
  "lost": {
    "title": "Black iPhone 14",
    "description": "Lost my phone...",
    "category": "Electronics",
    "location": "Library",
    "date": "2024-10-15"
  },
  "found": {
    "title": "iPhone with blue case",
    "description": "Found an iPhone near library...",
    "category": "Electronics",
    "location": "near Library",
    "date": "2024-10-15"
  }
}

AI computes:
- Text: "Black iPhone 14 Electronics..." vs "iPhone blue case Electronics..." → 0.82
- Image: CLIP disabled → 0.00
- Location: "library" vs "near library" → 0.50 (token overlap)
- Date: same day → 1.00

Weight redistribution (no image):
- text: 0.40 + 0.18 = 0.58
- location: 0.20 + 0.12 = 0.32
- date: 0.10

Overall = 0.58*0.82 + 0.32*0.50 + 0.10*1.00
        = 0.476 + 0.160 + 0.100
        = 0.736

Category match (Electronics = Electronics) → 0.736 * 1.15 = 0.847

Response:
{
  "overall_score": 0.847,
  "component_scores": { "text": 0.82, "image": 0.0, "location": 0.5, "date": 1.0 },
  "method": "sentence_transformer"
}

5. 0.847 > 0.50 → Notification bhejo User A ko
6. User A dashboard pe ⚡ 85% dikhta hai
7. User A claim karta hai → User B approve karta hai
```

---

## 12. Authentication aur Security

### Password Storage

```
User registers: password = "mypassword123"
bcrypt.hash("mypassword123", 12) = "$2b$12$..." (60 char hash)
MongoDB mein: "$2b$12$..."  ← plain text nahi

Login: bcrypt.compare("mypassword123", "$2b$12$...") = true/false
```

12 salt rounds = ~300ms per hash. Brute force practically impossible.

### JWT Token

```
Header: { "alg": "HS256" }
Payload: { "id": "65f2abc...", "iat": 1234567890, "exp": 1235432490 }
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), JWT_SECRET)

Token: eyJhbGci....eyJpZCI6....HMAC_SIGNATURE
       ^Header    ^Payload    ^Signature
```

Token tamper kiya? Signature mismatch → 401 error.

### Request Security Chain

```
Request aata hai
    ↓
Helmet → X-Frame-Options, Content-Security-Policy, etc.
    ↓
CORS → Allowed origin check
    ↓
Rate Limiter → IP per request count
    ↓
Body Parser → JSON parse
    ↓
Route → protect middleware → JWT verify → user attach
    ↓
Validate → Zod schema check
    ↓
Controller → Business logic
    ↓
Response
```

### Authorization Checks

```javascript
// Koi bhi item edit ya delete karne ki koshish:
const isOwner = item.reportedBy.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

// String comparison ZARURI hai:
// item.reportedBy = ObjectId("65f2abc...")
// req.user._id = ObjectId("65f2abc...")
// ObjectId === ObjectId = FALSE (reference compare)
// "65f2abc..." === "65f2abc..." = TRUE (value compare)
```

---

## 13. Poori API Reference

### Base URL: `http://localhost:5000/api/v1`

### Auth Endpoints

```
POST /auth/register
  Body: { name, email, password, phone? }
  Response: { user: {...}, token: "eyJ..." }
  Rate limit: 20/15min

POST /auth/login
  Body: { email, password }
  Response: { user: {...}, token: "eyJ..." }
  Rate limit: 20/15min

GET /auth/me
  Headers: Authorization: Bearer <token>
  Response: { user: {...} }

PUT /auth/me
  Body: { name?, phone?, bio? }
  Response: { user: {...} }

PUT /auth/change-password
  Body: { currentPassword, newPassword }
  Response: { message: "Password updated" }

POST /auth/forgot-password
  Body: { email }
  Response: { message: "...", devToken: "..." (dev only) }

POST /auth/reset-password
  Body: { token, password }
  Response: { message: "Password reset" }
```

### Items Endpoints

```
GET /items?type=lost&category=Electronics&search=iphone&status=open&sort=newest&page=1&limit=12
  Response: { items: [...], total: 45, page: 1, pages: 4 }

GET /items/my
  Headers: Bearer token required
  Response: [item1, item2, ...]

GET /items/:id
  Response: item object
  (contact info shown only if authenticated)

POST /items
  Headers: Bearer token
  Body: FormData (type, title, description, category, location, date, images[])
  Response: item object

PUT /items/:id
  Headers: Bearer token (owner or admin)
  Body: FormData (any fields)
  Response: updated item

DELETE /items/:id
  Headers: Bearer token (owner or admin)
  Response: { message: "Item deleted" }

GET /items/:id/matches
  Headers: Bearer token (owner only)
  Response: [match1, match2, ...]

POST /items/:id/matches/:matchId/dismiss
  Headers: Bearer token
  Response: { message: "Match dismissed" }

POST /items/:id/claims
  Headers: Bearer token
  Body: { message, verificationAnswers?: [{question, answer}] }
  Response: claim object

GET /items/:id/claims
  Headers: Bearer token (owner or admin)
  Response: [claim1, claim2, ...]
```

### Claims Endpoints

```
GET /claims/my
  Response: [{...claim, item: {title, type, images, ...}}]

PUT /claims/:id/review
  Body: { status: "approved"/"rejected", reviewNote?: "..." }
  Response: updated claim

DELETE /claims/:id (withdraw)
  Response: { message: "Claim withdrawn" }
```

### Notifications

```
GET /notifications?page=1&limit=20
  Response: { notifications: [...], total: 10, unreadCount: 3 }

GET /notifications/unread-count
  Response: { count: 3 }

PUT /notifications/read-all
  Response: { message: "All read" }

PUT /notifications/:id/read
  Response: { message: "Marked as read" }
```

### Admin (admin role required)

```
GET /admin/stats
  Response: { users: {...}, items: {...}, claims: {...}, abuse: {...} }

GET /admin/items?moderation=pending&page=1
  Response: { items: [...], total, pages }

PUT /admin/items/:id/moderate
  Body: { moderationStatus: "approved"/"rejected", moderationNote?: "..." }

GET /admin/users?search=john&page=1
  Response: { users: [...], total, pages }

PUT /admin/users/:id
  Body: { isActive?: boolean, role?: "user"/"admin" }

GET /admin/abuse-reports?status=open
  Response: { reports: [...] }

PUT /admin/abuse-reports/:id
  Body: { status: "resolved"/"dismissed", adminAction?: "..." }
```

### Health Check

```
GET /api/v1/health
  Response: {
    status: "ok",
    timestamp: "2024-10-15T...",
    environment: "development",
    db: "connected"
  }
```

---

## 14. Installation aur Setup

### Zaruri Tools Install Karo

```bash
# Node.js check
node --version  # v18+ chahiye

# Python check
python --version  # 3.10+ chahiye

# MongoDB (local)
# Download: https://www.mongodb.com/try/download/community
# Ya MongoDB Atlas (free cloud): https://mongodb.com/atlas
```

### Step 1: Backend Setup

```bash
# Project folder mein jao
cd FindIt/backend

# .env file banao
# Windows:
copy ..\\.env.example .env
# Mac/Linux:
cp ../.env.example .env

# .env file kholo aur minimum yeh set karo:
# MONGO_URI=mongodb://localhost:27017/findit
# JWT_SECRET=koi_bhi_lamba_random_string_yahan_likho

# Dependencies install karo
npm install

# Development server start karo
npm run dev
# Output dekhoge:
# [DB] MongoDB connected
# [Server] Running on port 5000 (development)
```

### Step 2: Frontend Setup

```bash
cd FindIt/frontend

npm install

npm run dev
# Output:
# VITE v5.x.x ready
# Local: http://localhost:5173

# Browser mein kholo: http://localhost:5173
```

### Step 3: AI Service Setup (Optional)

```bash
cd FindIt/ai-service

# Virtual environment banao (recommended)
python -m venv venv

# Activate karo:
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

# Dependencies install karo
# NOTE: Pehli baar ~90MB model download hoga
pip install -r requirements.txt

# Server start karo
uvicorn main:app --reload --port 8000
# Output:
# INFO: Loading text model: all-MiniLM-L6-v2
# INFO: Text model loaded
# INFO: Uvicorn running on http://127.0.0.1:8000
```

**AI service nahi chala?** Koi baat nahi — FindIt automatically keyword fallback use karega.

### Step 4: Admin Account Banao

```bash
# 1. http://localhost:5173/register pe normal account banao

# 2. MongoDB Compass ya shell se role update karo:
use findit
db.users.updateOne(
  { email: "aapka@email.com" },
  { $set: { role: "admin" } }
)

# 3. Log out karke dobara login karo
# 4. Navbar mein "Admin" link dikhega
```

---

## 15. Environment Variables

### `backend/.env` — Poori Reference

```bash
# ── Server ────────────────────────────────────────────────────
PORT=5000
# Koi bhi port, default 5000

NODE_ENV=development
# 'production' mein stack traces hide hoti hain

# ── Database (REQUIRED) ───────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/findit
# Local: mongodb://localhost:27017/findit
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/findit

# ── JWT (REQUIRED) ────────────────────────────────────────────
JWT_SECRET=yahan_koi_bhi_lamba_random_string_likhein_jaise_abc123xyz456
# Production mein: openssl rand -hex 64 se generate karo
# Minimum 32 characters hona chahiye

JWT_EXPIRES_IN=7d
# Token kitne din mein expire ho: 7d, 24h, 1h, etc.

# ── CORS ──────────────────────────────────────────────────────
CLIENT_URL=http://localhost:5173
# Frontend ka URL (CORS allow list mein jaata hai)
# Production mein: https://your-app.vercel.app

# ── Cloudinary (OPTIONAL) ─────────────────────────────────────
# Khaali chhodo → local uploads/ folder mein save hoga
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# Sign up free: https://cloudinary.com

# ── AI Service ────────────────────────────────────────────────
AI_SERVICE_URL=http://localhost:8000
# AI service ka URL
AI_SERVICE_TIMEOUT_MS=10000
# 10 second mein AI respond nahi kiya → fallback use karo

# ── Rate Limiting ─────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes (ms mein)
RATE_LIMIT_MAX=100            # 100 requests per window per IP
AUTH_RATE_LIMIT_MAX=20        # Auth endpoints ke liye stricter: 20/15min
```

---

## 16. Project Kaise Chalayein

### 3 Terminals Open Karo

**Terminal 1 — Backend:**
```bash
cd FindIt/backend
npm run dev
# http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd FindIt/frontend
npm run dev
# http://localhost:5173
```

**Terminal 3 — AI Service (optional):**
```bash
cd FindIt/ai-service
venv\Scripts\activate
uvicorn main:app --reload --port 8000
# http://localhost:8000
```

### Verify Everything Works

```bash
# Backend health
curl http://localhost:5000/api/v1/health
# Response: {"status":"ok","db":"connected",...}

# AI service health
curl http://localhost:8000/health
# Response: {"status":"ok","text_model":"all-MiniLM-L6-v2",...}
```

---

## 17. Tests Kaise Chalayein

### AI Service Unit Tests

```bash
cd ai-service
python test_matching.py
```

Expected output:
```
Running AI service unit tests...
✓ cosine_similarity tests passed
✓ keyword_text_score tests passed
✓ location_score tests passed
✓ date_score tests passed
✓ build_text_input tests passed

✓ All tests passed
```

### Backend Module Load Test

```bash
cd backend
node -e "
process.env.MONGO_URI='mongodb://localhost/test';
process.env.JWT_SECRET='test';
require('./src/server.js')
"
# Agar koi syntax error nahi → "All modules OK" dikhega
```

### Frontend Build Test

```bash
cd frontend
npm run build
# ✓ built in ~10s, 0 errors
```

---

## 18. Live Demo Karne ka Script

Exact steps jo demo mein follow karo:

```
STEP 1: Browse page dikhao
  → http://localhost:5173/browse
  → Filters dikhao: type, category, search
  → Explain: "Publicly accessible, no login needed"

STEP 2: Register karo (User A - the loser)
  → /register
  → Name: "Rahul Kumar", Email, Password
  → Auto-redirect to /dashboard

STEP 3: Lost item report karo
  → /report
  → Select "Lost Item" (red button)
  → Title: "Black iPhone 14" (category auto-detect watch karo!)
  → Category: Electronics (auto-set hoga)
  → Location: "Library Block A, 2nd Floor"
  → Date: aaj ki date
  → Description: "Black iPhone with cracked screen, blue case"
  → Identifying features: "Sticker on back, serial starts DNPXW"
  → Submit → Item page pe redirect

STEP 4: Log out. Register User B (the finder)
  → Name: "Priya Singh"
  
STEP 5: Found item report karo
  → /report → "Found Item"
  → Title: "iPhone found near library"
  → Category: Electronics
  → Location: "Library Block A"
  → Description: "Found iPhone with blue protective case"
  → Submit

STEP 6: Wait karo (ya same time pe match trigger hoga)
  → User A dashboard pe jao
  → Lost item ke saath ⚡ icon dikhega
  → Click karo → AI Match Score dikhao (e.g. 72%)
  → Component scores explain karo

STEP 7: Claim submit karo (as User A)
  → Found item page pe jao
  → "Submit a Claim" button
  → Message: "This is my iPhone, I recognize the sticker"
  → Verification: "Serial number starts with DNPXW"
  → Submit

STEP 8: Log in as User B
  → Dashboard → Item → View claims
  → User A ki claim dikho (verification answers private)
  → "Approve" button click karo

STEP 9: User A ke notifications check karo
  → Bell icon → "Your claim was approved!"
  → Contact info ab visible hai

STEP 10: Admin demo
  → MongoDB se: db.users.updateOne({email:"..."}, {$set:{role:"admin"}})
  → Logout + login
  → /admin → Real stats dikhao
  → Item moderation dikhao
```

---

## 19. Deployment Guide

### Backend → Render.com (Free Tier)

```
1. GitHub pe push karo
2. render.com → New Web Service
3. GitHub repo connect karo
4. Settings:
   - Build: npm install
   - Start: node src/server.js
5. Environment Variables:
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...  ← Atlas connection string
   JWT_SECRET=64_char_random_string
   CLIENT_URL=https://your-app.vercel.app
   CLOUDINARY_CLOUD_NAME=...  (if using)
   AI_SERVICE_URL=https://your-ai-service.render.com
```

### Frontend → Vercel (Free)

```
1. vercel.com → Import Project
2. GitHub repo connect karo
3. Settings:
   - Framework: Vite
   - Build: npm run build
   - Output: dist
4. Deploy karo
5. Environment Variables:
   VITE_API_BASE_URL=https://your-backend.onrender.com
```

**Note:** `vite.config.js` mein production ke liye update karo:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': process.env.VITE_API_BASE_URL || 'http://localhost:5000'
  }
}
```

### MongoDB Atlas Setup

```
1. mongodb.com/atlas → Free cluster banao
2. Database User banao (username + password)
3. Network Access: 0.0.0.0/0 add karo (ya server ka IP)
4. Connection String copy karo:
   mongodb+srv://username:password@cluster.mongodb.net/findit
5. Backend .env mein MONGO_URI set karo
```

### AI Service → Render.com

```
Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
Environment: PORT (Render automatically set karta hai)
Note: Free tier 15 min baad sleep karta hai → AI_SERVICE_TIMEOUT_MS=20000
      Timeout badha do, keyword fallback handle kar lega
```

---

## 20. Known Limitations

| Limitation | Detail | Fix |
|-----------|--------|-----|
| Password Reset Email | Dev mode mein token response mein dikhta hai. Production mein email send nahi hoti. | SendGrid ya Nodemailer + SMTP integrate karo |
| CLIP Image Matching | `ENABLE_CLIP=0` by default. Image score = 0 hamesha. | `torch` install karo + `ENABLE_CLIP=1` set karo (4GB+ RAM chahiye) |
| 30-second Notification Delay | Polling hai, WebSocket nahi | Socket.io ya Server-Sent Events lagao |
| Text-Only Location | "Library" aur "Lib." match nahi karte | GPS coordinates + geospatial queries add karo |
| AI Embeddings Not Cached | Har match request pe recompute | `item.textEmbedding` field mein cache karo |
| No Email Verification | Koi bhi email se register kar sakta hai | Email confirmation step add karo |

---

## 21. Viva Questions aur Answers

**Q1: FindIt mein AI kya karta hai exactly?**

AI service 4 similarity scores compute karta hai:
1. **Text** — Sentence Transformer model text ko 384-dimensional vector mein convert karta hai. Dono items ke vectors ke beech cosine similarity nikalta hai. "lost black wallet" aur "black wallet found" → high similarity.
2. **Image** — CLIP model images ke visual features extract karta hai aur compare karta hai (optional, disabled by default).
3. **Location** — Location strings ke common words count karta hai (Jaccard similarity).
4. **Date** — `e^(-days/30)` formula se date proximity score.

Weighted combination → Overall score 0–1.

**Q2: Agar AI service down ho jaaye toh kya hoga?**

`aiClient.computeMatch()` function `try-catch` mein wrapped hai. ECONNREFUSED ya timeout pe `{ success: false }` return hota hai — kabhi throw nahi karta. Backend then `fallbackMatch()` call karta hai jo pure JavaScript mein Jaccard similarity compute karta hai. Match `aiStatus: 'fallback'` ke saath save hota hai. UI mein warning dikhti hai: "Keyword-based match (AI unavailable)". Full platform continue karta hai.

**Q3: Verification answers publicly visible kyun nahi hain?**

`claimController.js` mein `getClaimsForItem()` function hai. Yeh check karta hai:
```javascript
if (!isAdmin && !isOwner) obj.verificationAnswers = [];
```
Agar requester naa owner hai naa admin, toh answers empty array return hota hai. Server-side enforce hota hai — frontend hide karna security nahi, sirf UX hai.

**Q4: JWT token kahan store hota hai aur safe kyun hai?**

`localStorage` mein store hota hai. Axios interceptor automatically `Authorization: Bearer <token>` header add karta hai. Token tamper proof hai kyunki signature JWT_SECRET se verify hoti hai. Expiry 7 din hai. 401 response pe auto-logout hota hai. LocalStorage XSS attacks ke vulnerable hai — production mein HttpOnly cookie better option hai, but college project ke liye acceptable hai.

**Q5: Admin authorization sirf frontend hide karna enough hai kyun nahi?**

Nahi. Frontend mein sirf UI hide hoti hai. Koi bhi browser devtools se ya Postman se seedha `POST /api/v1/admin/items/:id/moderate` call kar sakta hai. Isliye `routes/admin.js` mein:
```javascript
router.use(protect, adminOnly);
```
Har request pe server-side role check hota hai. Bina valid admin token ke 403 milega.

**Q6: Soft delete kya hai aur kyun?**

Hard delete mein MongoDB se document permanently hata dete. Soft delete mein `isDeleted: true` set karte hain. Fayda:
- Audit trail: pata rehta hai ki item kabhi thi
- Recovery possible hai
- Related matches aur claims orphan nahi hote
- Browse mein `{ isDeleted: false }` filter lagata hai toh users ko nahi dikhtei

**Q7: Database indexes kyon lagate hain?**

Bina index ke MongoDB har query mein saari documents scan karta hai (Collection Scan = slow). Index ek sorted data structure hai jisse specific fields pe fast lookup hota hai. Example:
- `{ type: 1, status: 1, category: 1 }` → Browse page filter fast
- `$text` index → text search fast
- `{ recipient: 1, isRead: 1 }` → Unread count query fast (30 second poll ke liye important)

**Q8: Rate limiting kaise kaam karta hai?**

`express-rate-limit` package IP address track karta hai. Global limiter: 100 req/15min per IP. Auth limiter: 20 req/15min. Agar limit exceed ho → `429 Too Many Requests`. Yeh brute force attacks (password guessing) aur spam se bachata hai. Real production mein Redis store use karo multiple servers ke liye.

**Q9: Cloudinary kyon use kiya?**

1. Free tier 10GB storage deta hai
2. Images CDN se globally fast serve hoti hain
3. `transformation` se auto-resize/optimize hota hai (bandwidth save)
4. URLs permanent hain — server restart pe nahi jaate

Local disk pe store karna: server restart pe files gone (Render, Railway jaise platforms ephemeral storage use karte hain).

**Q10: bcrypt ke 12 rounds kyon?**

Har round mein computation double hoti hai. 12 rounds = ~250ms per hash. Yeh intentionally slow hai:
- User ko register/login mein: imperceptible (ek baar)
- Attacker ko 1 billion passwords crack karne mein: impractical (decades)
- 10 rounds = 64ms (thoda fast, less secure)
- 14 rounds = 1 second (too slow for UX)
- 12 = sweet spot for 2024 hardware

---

*Made with ❤️ as a college project.*  
*AI similarity scores are a ranking tool only and do not prove ownership of any item.*

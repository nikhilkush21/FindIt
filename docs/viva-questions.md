# FindIt — Viva Questions & Answers

## 1. What problem does FindIt solve?
Traditional lost-and-found systems (notice boards, WhatsApp groups) are unstructured, slow, and miss matches across silos. FindIt provides a structured platform with AI-powered matching to help people recover lost items faster.

## 2. How does the AI matching work?
The AI service computes four scores: text similarity (Sentence Transformer cosine similarity on concatenated title, description, and identifying features), image similarity (CLIP embeddings, optional), location (token overlap), and date proximity (exponential decay). These are weighted 40/30/20/10 and combined. A category bonus of 15% is applied when categories match.

## 3. Why is the AI score not proof of ownership?
Because semantic similarity only measures how alike two descriptions are — a found black wallet and a lost black wallet will score high even if they are different wallets. Ownership is determined by the private verification process, not the score.

## 4. How is user authentication implemented?
Registration stores a bcrypt-hashed password (12 rounds). On login, the server compares the hash and issues a signed JWT (7-day expiry). The frontend stores the token in localStorage and sends it as a Bearer token. The backend `protect` middleware verifies the JWT on every protected route.

## 5. How does the claims workflow prevent fraud?
- Users cannot claim their own listings.
- Only one claim per user per item.
- Verification answers are private (not shown publicly).
- The reporter (or admin) reviews the claim manually.
- AI scores are shown but explicitly labeled as non-proof.
- Rate limits prevent spam claims.

## 6. What happens if the AI service is offline?
The `findMatchesForItem` function calls `computeMatch()` which returns `{ success: false }` on any network error (including `ECONNREFUSED`). The code then calls `fallbackMatch()` which computes keyword-based Jaccard similarity. The match is saved with `aiStatus: 'fallback'`. The UI shows "Keyword-based match (AI service unavailable)" on that card.

## 7. How are admin routes protected?
All `/api/v1/admin/*` routes use `router.use(protect, adminOnly)`. The `protect` middleware validates the JWT and loads the user. The `adminOnly` middleware checks `req.user.role === 'admin'`. This check is done on the server — the frontend only hides the UI for non-admins but the API itself is always enforced.

## 8. How is Cloudinary used?
The `multer-storage-cloudinary` package replaces Multer's disk storage. Uploaded files go directly to Cloudinary. The returned `file.path` is the Cloudinary URL, which is saved in `item.images`. If Cloudinary credentials are not set, the code falls back to `multer.diskStorage` and saves files to `backend/uploads/`.

## 9. What Mongoose indexes are used and why?
- `items`: `{ type, status, category }` for browse filters; `$text` for full-text search; `{ reportedBy }` for dashboard queries.
- `matches`: `{ lostItem, foundItem }` unique index to prevent duplicates; `{ lostItem, overallScore: -1 }` for ranked results.
- `notifications`: `{ recipient, isRead }` for unread count queries.

## 10. How is the password reset implemented?
The user requests a reset with their email. The server generates a 32-byte random token, stores its SHA-256 hash in the database with a 1-hour expiry, and (in dev mode) returns the token in the response. In production, the token would be emailed. The user submits the token; the server finds the matching hash, verifies it hasn't expired, and updates the password.

## 11. What is Zod used for?
Zod is used for runtime schema validation on both the frontend (React Hook Form + Zod resolver) and backend (custom `validate` middleware). It ensures data is correctly typed and within bounds before any business logic runs, preventing invalid data from reaching the database.

## 12. What are the main limitations?
- No email sending in the current build (password reset token shown in dev mode).
- CLIP image matching is optional and disabled by default due to resource requirements.
- No real-time notifications (polling every 30s).
- Location matching is text-based (no GPS / geolocation).
- AI embeddings are not cached per-item.

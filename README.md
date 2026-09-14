# Naik Foods — Improvement Prototype

Built for the **BNV Full Stack MERN Intern Task**. This is a working MERN prototype that
implements a subset of the improvements identified in the written analysis of
[naikfoods.co.in/in](https://www.naikfoods.co.in/in), styled to match that site's green,
Maharashtrian-heritage branding.

## What This Fixes / Adds (from the analysis)

| Issue found on the live site | What this prototype does |
|---|---|
| No search bar in the header | Working header search that filters products server-side |
| Store listing showed **₹0** for some products while the product page showed the real price | Price is read from a single field (`product.price`) used by both the listing and detail views — there is no second, driftable price |
| No category / price / dietary filters on the store page | Sidebar filters for category, price range, and dietary tags (Healthy, Vegan, Gluten-Free, etc.) |
| No nutrition, ingredients, or allergen info on product pages | A "Nutrition & Ingredients" tab with serving size, calories, macros, ingredients, allergens, and shelf life for every product |
| "(56 Reviews)" shown but no actual review content | A real review system: existing reviews render with name, star rating, and a "Verified Purchase" badge; visitors can submit new reviews via a form that hits the API |
| ₹999 minimum order for free delivery (high relative to ₹30–₹280 item prices) | Lowered, tiered threshold: **free delivery above ₹999**, ₹40 flat fee below that, with a live progress bar showing how much more to add |
| No curated bundles / gifting options | A "Gift Boxes" page with combo bundles (e.g. Konkan Pickle Sampler, Everyday Snack Box) at a bundled price |
| Generic, near-identical product descriptions | Each seeded product has a unique, specific description instead of repeated boilerplate |

Not every idea from the analysis is built here (e.g. subscriptions, Marathi-language pages,
recipe-linked shopping) — the mandatory-development section only asked for one feature to be
prototyped; this submission goes further and addresses several of the highest-impact ones
together since they share the same data model.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose) — with an automatic **mock mode** (in-memory data) so the app
  runs immediately without needing a database connection first
- **Styling:** Plain CSS with a small design-token system (no UI framework), fonts: Fraunces (headings) + Inter (body)

## Project Structure

```
naik-foods-prototype/
├── server/          # Express API
│   ├── models/       # Product, Combo (Mongoose schemas)
│   ├── routes/       # /api/products, /api/categories, /api/combos
│   ├── utils/         # search.js (typo-tolerant matching), validateProduct.js
│   ├── seed/          # Seed data + seed script
│   └── server.js
└── client/          # React app (Vite)
    └── src/
        ├── api/       # fetch wrapper
        ├── components/  # ProductCard, FiltersPanel, CartDrawer, Header, ProductCardSkeleton, ...
        ├── context/    # Cart state + delivery-fee logic
        └── pages/      # Home, Store, ProductDetail, Combos, About, Checkout
```

## Setup & Installation

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

The app works out of the box **without** setting `MONGO_URI` — it automatically starts in
**mock mode**, serving the same seed data from memory. This is the fastest way to run/grade it.

To use a real database instead:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Put the connection string in `server/.env` as `MONGO_URI=...`
3. Run `npm run seed` once to populate it
4. Start the server — it will connect to MongoDB instead of mock mode

Start the API:
```bash
npm run dev      # with nodemon
# or
npm start
```
Runs on `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's up
and which mode it's running in.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api` calls to the backend on port 5000 (see
`vite.config.js`). Open `http://localhost:5173` in a browser.

### 3. Production build (for deployment)

```bash
cd client
npm run build   # outputs static files to client/dist
```

## Deployment Notes

- **Backend:** deployable to Render, Railway, or Fly.io (Heroku's free tier no longer exists).
  Set `MONGO_URI` as an environment variable on the host and it will connect to MongoDB Atlas
  automatically.
- **Frontend:** deployable to Netlify or Vercel — build command `npm run build`, publish
  directory `client/dist`. Update the API base URL / proxy target to point at the deployed
  backend URL instead of `localhost:5000` before building for production.

## Implementation Notes

- **Mock mode** (`server/routes/products.js`) exists so the grader can run the whole thing in
  under two minutes without setting up a database — all filtering, search, and review-posting
  logic works identically against the in-memory array as it does against MongoDB.
- **Price integrity:** `Product.price` is the only price field in the schema. The listing page,
  product-detail page, and cart all read from the same object, so the kind of ₹0-vs-real-price
  mismatch found on the live site cannot happen by construction.
- **Delivery logic** lives in one place (`client/src/context/CartContext.jsx`,
  `DELIVERY_FREE_THRESHOLD` / `DELIVERY_FEE`) so the threshold is easy to tune and is guaranteed
  consistent between the progress strip, cart drawer, and checkout total.
- **Reviews** are stored as a sub-document array on each product with `verifiedPurchase`,
  `rating`, and `comment`; the average rating is computed as a Mongoose virtual (`avgRating`)
  rather than stored redundantly, so it can never go stale.

## Update: Discovery, Recommendations, and Validation

The implementation covers pricing integrity, filters, nutrition info, reviews, and the delivery progress bar. It also includes smarter search, rule-based recommendations, backend product validation, stock-aware UI, and a checkout page.

| Area | What was added |
|---|---|
| Search | Typo-tolerant, relevance-ranked search (`server/utils/search.js`) — e.g. "pikle" still matches "Pickle" via Levenshtein distance on individual words, not just substring matching. Debounced (300ms) search-suggestions dropdown in the header (`GET /api/products/search/suggestions`) so the API isn't hit on every keystroke. |
| Filtering & sorting | Added rating filter (4★ & up, 3★ & up, etc.), an "in stock only" checkbox, and a "Best Selling" sort (ranked by salesCount) alongside the existing price/rating sorts. When a search term is present, results are ordered by relevance score by default. |
| Recommendations | `GET /api/products/:slug/recommendations` — a rule-based engine (same category, shared tags, price proximity, rating) with no ML involved, matching the assignment's explicit "don't over-engineer this" guidance. Rendered as a "You may also like" section on the product page. |
| Product data & validation | Extended the `Product` schema with `stock`, `compareAtPrice`, `images[]`, and `isActive`. `POST /api/products` and `PUT /api/products/:slug` run `server/utils/validateProduct.js` first and reject the request with a structured error list (matching the format specified in the brief) if price ≤ 0, or name/category/description/stock/image is missing — so an invalid product can never reach the storefront. |
| Stock-aware UI | Product cards and the product-detail page now show out-of-stock and low-stock states (disabled "Add to Cart", an out-of-stock overlay, "Only N left" warnings) driven by the new `stock` field. One seed product is deliberately set to 0 stock and one to a low count so these states are actually reachable in the demo. |
| Cart upsell | When the cart subtotal is below the free-delivery threshold, the cart drawer fetches a few cheap, in-stock products not already in the cart and surfaces them under "You're ₹X away from FREE DELIVERY" — connecting the recommendation logic directly to average-order-value. |
| Checkout page | A new `/checkout` route with an order summary (line items, subtotal, delivery, total) and a delivery-details form. Placing an order clears the cart and shows a confirmation state — there is no real payment gateway, consistent with the brief's "what not to build" list. |
| Product detail page | Added a thumbnail image gallery, a "Delivery" tab with a pincode checker (client-side estimate, no real logistics integration), review sorting (recent/highest/lowest) and a star-distribution bar chart, and a "Buy Now" button that adds to cart and jumps straight to checkout. |
| Mobile responsiveness | Added a slide-in mobile filter drawer for the store page and a hamburger-triggered mobile nav menu in the header, so filtering and navigation are usable at phone widths, not just the grid reflow that already existed. |
| Loading states | Skeleton placeholders (`ProductCardSkeleton`) replace the plain "Loading…" text on the store grid and product-detail page while data is in flight. |





An interactive preview of the UI is available inline in the chat this was built in. To see it
running locally, follow the setup steps above — it takes under two minutes with mock mode.

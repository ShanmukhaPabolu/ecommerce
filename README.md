# Naik Foods — E-commerce Experience Improvement Prototype

This project was developed as part of a Full Stack MERN Intern assignment. I first analyzed the existing Naik Foods e-commerce experience from user and developer perspectives, then implemented a working prototype addressing selected high-impact opportunities.

## 1. Project Overview

The original website studied for this assignment was [naikfoods.co.in/in](https://www.naikfoods.co.in/in). 

The purpose of this project is to present an e-commerce improvement prototype based on an audit of the existing Naik Foods shopping experience. Rather than attempting to reproduce every existing page, the goal was to prioritize and build functional prototypes of high-impact improvements.

This project focuses heavily on practical improvements in:
- Product discovery
- Conversion optimization
- Cart experience
- Product information
- Recommendation systems
- Inventory awareness
- Personalization
- Content-commerce integration
- Checkout experience
- Backend data integrity

## 2. Problem Analysis

| Observed Opportunity | Impact | Implemented Improvement |
|---|---|---|
| Product Discovery | Search is available within the Store experience; this prototype improves discoverability by introducing global header search, suggestions and typo-tolerant matching. | Global search with 300ms debounced suggestions and Levenshtein distance typo tolerance. |
| Product Information | Essential dietary and nutritional information helps build trust and aids purchasing decisions. | Added structured product information including nutrition, ingredients, allergens, shelf life, dietary type, and spice level. |
| Pricing Consistency | Having separate price fields for listings and product details can lead to drift or ₹0 display errors. | The backend uses a single `product.price` source of truth to ensure absolute consistency. |
| Stock Visibility | Customers need to know if an item is available before reaching checkout. | Implemented stock visibility, low-stock messaging, out-of-stock states, and prevented cart quantity from exceeding available stock. |
| Cart Conversion | The existing ₹999 free-delivery threshold was static text, limiting its potential to drive Average Order Value (AOV). | Made the existing ₹999 free-delivery threshold actionable through live progress tracking, below-threshold delivery pricing, and contextual recommendations. |
| Recommendations | Product discovery can be improved by suggesting relevant items during the shopping journey. | Implemented an explainable, rule-based recommendation engine based on category, tags, spice level, dietary type, price, and popularity. |
| Content-to-Commerce | Content marketing (recipes) often lives separate from the shopping experience. | Introduced a Recipe-to-Cart feature allowing users to add all required Naik Foods ingredients for a recipe directly to their cart. |
| Customer Trust | Reviews build confidence, especially for food products. | Added a review system with ratings, comments, and a "Verified Purchase" indicator. |

## 3. Key Improvements Implemented

### 1. Smart Product Discovery
Improved product discovery by adding global header search, debounced search suggestions, and typo-tolerant matching to complement the existing Store search experience. Users can also utilize filters, sorting, and relevance ranking to find exactly what they need.

### 2. Data-Driven Best Sellers
Products have a `salesCount` field. The "Best Sellers" sorting option ranks products using actual sales data rather than simply relying on review count, providing a more accurate reflection of product popularity.

### 3. Product Information
Product detail pages now feature structured product information to help users make informed decisions. This includes nutrition facts, ingredients, allergens, shelf life, storage information, dietary type, spice level, weight, and stock status.

### 4. Stock-Aware Shopping
The UI is fully stock-aware. It features stock visibility, low-stock messaging, and disabled "Add to Cart" buttons for out-of-stock items. The cart also prevents users from increasing quantity beyond available stock.

### 5. Smart Cart
Made the existing ₹999 free-delivery threshold actionable through live progress tracking and contextual recommendations. It clearly displays the ₹40 delivery fee when below the threshold and highlights savings. The cart drawer surfaces contextual product recommendations that can help increase cart value and reach the free delivery threshold.

### 6. Explainable Recommendations
The prototype uses an explainable rule-based recommendation approach rather than introducing ML unnecessarily. It scores products based on signals such as category, shared tags, spice level, dietary type, price proximity, sales/popularity, and rating.

### 7. Frequently Bought Together
Product pages feature a "Frequently Bought Together" section showcasing related products and bundled selections. This encourages cross-selling and convenience, potentially increasing basket size.

### 8. Wishlist
Users can save products for later using the Wishlist feature. It supports adding/removing products, displays a wishlist count, provides a dedicated wishlist page, and persists data across sessions using `localStorage`.

### 9. Recently Viewed
The platform tracks recently viewed products, helping users continue product discovery and easily navigate back to items they were considering.

### 10. Reviews
A functional review system is implemented, featuring user ratings, review comments, a verified purchase indicator, rating distribution visualization, sorting (recent/highest/lowest), and a form for review submission.

### 11. Gift Boxes / Curated Combos
Introduced a "Gift Boxes" section offering curated combos. This addresses the gifting use case, introduces new purchase occasions, and provides an easier product selection process for customers.

### 12. Build Your Own Box
A dedicated personalization feature where customers can select products to create a custom assortment. This highly interactive experience supports personalization and has the potential to increase basket size.

### 13. Recipe-to-Cart Commerce
Connects content marketing directly with commerce. Users can browse traditional recipes, discover the Naik Foods products used in them, and use the "Add All Ingredients to Cart" button for frictionless purchasing.

### 14. Shop by Occasion
Provides an intent-based navigation path (e.g., Tea Time, Gifting, Everyday Meals, Build Your Own Box) rather than relying only on standard product categories.

### 15. Checkout / Order Flow
A complete prototype checkout flow is implemented. It captures customer information, address, pincode, and payment method selection. It presents a comprehensive order summary including delivery fee, savings, and total, followed by order creation and confirmation. **This is a prototype checkout flow and does not process real payments.**

## 4. Technical Architecture

```
User
  ↓
React + Vite Frontend (UI, Routing)
  ↓
React Context (Cart, Wishlist, Toast State)
  ↓
REST API (Axios/Fetch)
  ↓
Express + Node.js Backend
  ↓
Validation & Business Logic
  ↓
MongoDB + Mongoose (Primary Database)
  ↓
Mock Data Fallback (In-memory Seed Data)
```

- **React Frontend**: Renders the UI and handles client-side routing.
- **Context Management**: Manages global state for the cart, delivery logic, and wishlist.
- **Express API**: Handles HTTP requests, search logic, and data processing.
- **MongoDB/Mongoose**: Persistent data storage for products, orders, and combos.
- **Validation**: Server-side validation prevents invalid product data from being saved.
- **Mock Mode**: A fallback mechanism that serves in-memory data if MongoDB is unavailable, enabling instant local evaluation.

## 5. Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend tooling/build |
| React Router | Routing |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM (Object Data Modeling) |
| CSS | Styling |
| localStorage | Client-side persistence (Wishlist, Recently Viewed) |

## 6. API Overview

### Products
- `GET /api/products` - Retrieve products with support for search, filtering, and sorting.
- `GET /api/products/:slug` - Retrieve a single product by slug.
- `GET /api/products/search/suggestions` - Fetch lightweight search suggestions based on queries.
- `GET /api/products/:slug/recommendations` - Retrieve rule-based product recommendations.
- `GET /api/categories` - Fetch aggregated product categories.
- `GET /api/combos` - Retrieve curated gift boxes and combos.

### Reviews
- `POST /api/products/:slug/reviews` - Submit a new review for a product.

### Orders
- `POST /api/orders` - Create a new order.

### Health
- `GET /api/health` - Check API status and current operation mode (Mock vs MongoDB).

## 7. Data Models

### Product
- `name`, `slug`, `category`
- `price`, `compareAtPrice`
- `weight`, `image`, `images`
- `stock`, `salesCount`, `isActive`
- `dietaryType`, `tags`, `spiceLevel`
- `description`
- `nutrition` (servingSize, calories, protein, carbs, fat, ingredients, allergens, shelfLife, storageInstructions)
- `frequentlyBoughtWith`, `reviews`
- `linkedRecipeSlug`

### Order
- `orderNumber` (Auto-generated unique ID)
- `customer` (name, mobile, email)
- `address` (line, city, state, pincode)
- `items` (slug, name, price, qty, weight)
- `subtotal`, `deliveryFee`, `total`
- `paymentMethod`, `status`

### Combo
- `title`, `slug`, `image`, `description`
- `price`, `originalPrice`
- `items` (Array of product strings)

## 8. Engineering Decisions

### Explainable Recommendations
Rule-based recommendation scoring was selected because it is transparent, easy to understand, deterministic, and highly appropriate for a short prototype. It perfectly addresses the need for relevant suggestions while avoiding unnecessary ML complexity.

### Mock Mode
The backend is designed to run seamlessly without MongoDB configuration using in-memory mock data. This fallback behavior makes the project incredibly easy to evaluate locally out-of-the-box, ensuring zero-setup friction for reviewers.

### Validation
Strict backend validation exists for product creation and updates. It ensures prices are strictly positive and essential fields (name, category, stock) are present, ensuring data integrity before anything reaches the storefront.

### Sales Count
`salesCount` is utilized for the "Best Sellers" sorting option because it is a more accurate metric of product popularity and business performance than simply relying on the raw number of reviews.

### Local Storage
Client-side state such as the Wishlist and Recently Viewed products use `localStorage`. This provides a persistent experience for unauthenticated users without the overhead of requiring account creation for basic discovery features.

## 9. User Experience Improvements

The updated user journey drastically reduces friction:
**Discover** (Global Search / Browse / Filter) → **Understand Product** (Structured Details, Reviews, Stock Info) → **Add to Cart** → **Smart Cart Suggestions** (Live Free Delivery Progress & Contextual Upsells) → **Checkout** (Clear Order Summary) → **Order Confirmation**

This flow improves discovery by making products easier to find, aids conversion by providing all necessary information upfront, and actively encourages higher order values through smart cart interactions.

## 10. E-commerce / Product Thinking

| Feature | User Benefit | Business Opportunity |
|---|---|---|
| Smart Cart | Understand free-delivery progress | Potential to increase AOV |
| Recommendations | Discover relevant products | Cross-sell opportunities |
| Frequently Bought Together | Faster bundle selection | Potential to increase basket size |
| Gift Boxes | Easier gifting process | Capture new purchase occasions |
| Build Your Own Box | Personalization and control | Drive larger/custom baskets |
| Recipe-to-Cart | Easier cooking purchase journey | Bridge Content → Commerce |
| Wishlist | Save products for later | Improve customer retention |
| Recently Viewed | Continue shopping easily | Reduce rediscovery friction |

## 11. What Is Prototype / Demo Scope

To maintain engineering honesty, please note the following prototype limitations:
- **Payments:** Payment gateway is not integrated; checkout payment selection is a prototype.
- **Logistics:** Pincode serviceability is a UX prototype and does not represent a live logistics API.
- **Recommendations:** The recommendation engine is rule-based and not ML.
- **Database:** Mock mode exists for easy local evaluation when MongoDB is unavailable.
- **Metrics:** No claim should be made that prototype features have generated real business results, as there is no production analytics data.

## 12. Setup & Installation

### Prerequisites
- Node.js (v18+)

### Clone the Repository
```bash
git clone <REPOSITORY_URL>
cd naik-foods-prototype
```

### 1. Backend Setup
```bash
cd server
npm install
```

The application works out of the box **without** setting up MongoDB. It will automatically start in **mock mode** using in-memory seed data.

If you wish to use a real database:
1. Copy the environment file: `cp .env.example .env` (or create a `.env` file).
2. Add your MongoDB connection string to the `.env` file (see Environment Variables section).
3. Run `npm run seed` to populate the database.

Start the backend API:
```bash
npm run dev
```
The server runs on `http://localhost:5000`.

### 2. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`. Open this URL in your browser.

## 13. Environment Variables

The backend accepts the following environment variables (defined in `server/.env`):

- `PORT` - The port the server runs on (Default: 5000).
- `MONGO_URI` - MongoDB connection string. If omitted, the server automatically starts in Mock Mode. Example: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/naikfoods`

No environment variables are required if you are running the project in mock mode.

## 14. Running the Project

- **Start Backend (Dev Mode):** `npm run dev` (from `server/` directory)
- **Start Backend (Standard):** `npm start` (from `server/` directory)
- **Start Frontend:** `npm run dev` (from `client/` directory)
- **Production Build (Frontend):** `npm run build` (outputs static files to `client/dist`)

Expected local URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

## 15. Project Structure

```text
naik-foods-prototype/
├── client/              # React frontend application
│   ├── public/          # Static assets and images
│   └── src/
│       ├── api/         # Axios/Fetch wrappers for backend communication
│       ├── components/  # Reusable UI components (ProductCard, CartDrawer, etc.)
│       ├── context/     # React Context providers (Cart, Wishlist)
│       ├── pages/       # Route-level components (Home, Store, Checkout)
│       └── main.jsx     # Frontend entry point
├── server/              # Express backend application
│   ├── models/          # Mongoose database schemas (Product, Order, Combo)
│   ├── routes/          # API endpoint definitions
│   ├── seed/            # Seed data and database population scripts
│   ├── utils/           # Helper functions (Search logic, Validation)
│   └── server.js        # Backend entry point and configuration
├── .gitignore
└── README.md
```

## 16. Testing / Verification

The following flows have been manually verified:
- Product browsing, filtering, and sorting
- Global search functionality and typo-tolerance
- Product detail pages (stock, nutrition, reviews)
- Add to cart and Smart Cart threshold logic
- Wishlist and Recently Viewed persistence
- Checkout flow and order creation
- Mock backend mode seamless fallback

## 17. Future Production Improvements

### Phase 1 — Production Readiness
- Integration with a real payment gateway (e.g., Razorpay, Stripe)
- Integration with a real logistics/pincode API for accurate delivery estimates
- Production authentication and persistent user accounts
- Server-side pagination for product listings

### Phase 2 — Growth
- Personalized recommendations using real purchase history
- Abandoned cart recovery emails
- Implementation of coupons, referral programs, and loyalty/rewards
- Analytics dashboards for business tracking

### Phase 3 — Scale
- Migration to a dedicated search engine such as Elasticsearch or Algolia
- Advanced caching and CDN/image optimization
- Advanced machine-learning recommendation models

## 18. Screenshots / Demo

Live Demo: [ADD DEPLOYED URL]
GitHub: [ADD REPOSITORY URL]

Add deployment screenshots here.

## 19. Assignment Outcome

This prototype demonstrates an end-to-end approach to improving an existing e-commerce product: identifying user and business opportunities, translating them into practical features, implementing them across the frontend and backend, validating data, and designing the experience around product discovery, conversion and customer convenience.

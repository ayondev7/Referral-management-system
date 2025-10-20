# Referral Management System

A full-stack web application to manage online course purchases with a referral and credit system. Users can refer friends, earn credits, and use them for future course purchases.

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB with Mongoose, JWT authentication, Zod validation.

**Frontend:** Next.js 15 (React 19), TypeScript, TanStack Query, Zustand, Tailwind CSS, Chart.js, React Hook Form.

## Prerequisites

* Node.js v18 or higher
* MongoDB (local or Atlas)
* npm or yarn

## Getting Started

### Backend Setup

cd backend
npm install

Create a `.env` file based on `.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/referral_system
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Start the server:

npm run dev

Backend runs at `http://localhost:5000`.

### Frontend Setup

cd frontend
npm install

Create a `.env` file based on `.env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

Start the server:

npm run dev

Frontend runs at `http://localhost:3000`.

## How it Works

**User Registration & Referrals:**

* Users register with or without a referral code.
* Each user gets a unique referral code.
* Using a valid referral code creates a "pending" referral.

**Credits & Rewards:**

* When a referred user makes their first purchase, referral status becomes "converted."
* Referrer earns 10% of the purchase amount as credits.
* Credits can be used for future purchases.

**Purchase Flow:**

1. User initiates purchase.
2. System checks credits.
3. Purchase created as "pending."
4. Payment submitted.
5. Status updates to "paid."
6. Referrer earns credits if applicable.

**Analytics & Dashboard:**

* Track daily, monthly, yearly referral performance.
* Dashboard shows total credits, referrals, purchases, available credits.
* Charts visualize referral trends.

## Security

* Passwords hashed with bcryptjs.
* JWT-based authentication.
* Protected API routes.
* CORS and security headers with Helmet.
* Input validation with Zod.

## Production Build

**Backend:**

cd backend
npm run build
npm start

**Frontend:**

cd frontend
npm run build
npm start

## Project Structure

**Backend:** `config/`, `middleware/`, `modules/`, `routes/`, `utils/`

**Frontend:** `app/`, `components/`, `hooks/`, `lib/`, `routes/`, `store/`, `types/`

## Key Features

* User registration & JWT authentication
* Unique referral codes
* Referral tracking (pending/converted)
* Credit system (10% of first purchase)
* Credit redemption during purchases
* Dashboard with analytics and charts
* Paginated referrals and purchases
* Responsive design
* Real-time referral trend charts
* Course catalog with search and filters

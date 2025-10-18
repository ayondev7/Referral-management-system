# Referral & Credit System Backend

A complete backend system for managing referrals and credits in an online course platform. Built with Node.js, Express, TypeScript, and MongoDB.

## Features

- JWT-based authentication (access + refresh tokens)
- User registration with optional referral codes
- Automatic referral tracking and conversion
- Custom simulated payment workflow
- Credit rewards system
- Dashboard with referral statistics

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Zod for validation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/referral_system
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB locally or use MongoDB Atlas

5. Run in development mode:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

**POST /api/auth/register**
- Body: `{ name, email, password, referralCode? }`
- Returns: User info + tokens

**POST /api/auth/login**
- Body: `{ email, password }`
- Returns: User info + tokens

**POST /api/auth/refresh**
- Body: `{ refreshToken }`
- Returns: New access token

**POST /api/auth/logout**
- Returns: Success message

### Purchases

**POST /api/purchases/initiate**
- Headers: `Authorization: Bearer <accessToken>`
- Body: `{ courseName, amount }`
- Returns: Purchase ID

**POST /api/purchases/pay/:purchaseId**
- Headers: `Authorization: Bearer <accessToken>`
- Body: `{ cardNumber, expiry, cvv, cardHolder }`
- Returns: Payment confirmation

**GET /api/purchases**
- Headers: `Authorization: Bearer <accessToken>`
- Returns: User's purchase history

### Referrals

**GET /api/referrals**
- Headers: `Authorization: Bearer <accessToken>`
- Returns: User's referral list

**GET /api/referrals/stats**
- Headers: `Authorization: Bearer <accessToken>`
- Returns: Referral statistics

### Dashboard

**GET /api/dashboard**
- Headers: `Authorization: Bearer <accessToken>`
- Returns: `{ totalReferredUsers, convertedUsers, totalCredits, referralLink }`

## Business Logic

### Registration Flow
1. User registers with optional referral code
2. System generates unique referral code for new user
3. If referral code provided, creates pending referral record
4. Returns JWT tokens

### Purchase Flow
1. User initiates purchase (pending status)
2. User submits payment details
3. System validates card (simulated)
4. Stores only last 4 digits + card holder
5. Updates purchase to paid
6. If first purchase + has referrer:
   - Converts referral to "converted"
   - Adds +2 credits to both referrer and referred user

### Referral Conversion
- Only triggers on first paid purchase
- Prevents double-crediting
- Updates referral status from "pending" to "converted"

## Security Features

- Passwords hashed with bcrypt
- JWT signed tokens
- No raw card numbers or CVVs stored
- CORS restricted to specific origin
- Input validation with Zod
- Centralized error handling

## Development

Console logs are fully enabled in development mode using ts-node-dev.

## Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Build command: `npm install && npm run build`
5. Start command: `npm start`

## Project Structure

```
src/
├── modules/
│   ├── user/
│   ├── referral/
│   ├── purchase/
│   └── credit/
├── middleware/
├── config/
├── utils/
└── server.ts
```

## License

ISC

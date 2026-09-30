# MERN E-Commerce Project

This project is split into a React/Vite frontend and an Express/MongoDB backend.

## 1. Folder structure

```text
mern-ecommerce-final/
├── client/                         # React + Vite frontend
│   ├── public/                     # Static assets only
│   ├── src/
│   │   ├── admin/                  # Admin dashboard/pages/components
│   │   └── user/                   # Customer pages/components
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Node + Express backend
│   ├── data/                       # Seed/import JSON; not served to browser
│   │   ├── account.json
│   │   ├── database.json
│   │   ├── order.json
│   │   └── ads.json
│   ├── models/                     # Mongoose models
│   ├── routes/                     # REST API routes
│   ├── middleware/                 # JWT/auth middleware
│   ├── importProducts.js
│   ├── importCategories.js
│   ├── importOrders.js
│   ├── importAds.js
│   ├── importAccounts.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 2. Required software

Install these on your PC:

- Node.js 20+ recommended
- npm (comes with Node.js)
- MongoDB Community Server, OR a MongoDB Atlas cluster

## 3. Backend setup

Open a terminal inside `server`:

```bash
npm install
```

Copy `.env.example` to `.env` and edit the values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mern_ecommerce
JWT_SECRET=your-long-random-secret
PORT=5000
```

If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## 4. Import the existing JSON data

Run these once after MongoDB is available:

```bash
npm run import:products
npm run import:categories
npm run import:ads
npm run import:orders
npm run import:accounts
```

These commands move the existing seed data into MongoDB. The JSON files remain only under `server/data` for reference/re-import; they are not exposed by the React app.

## 5. Start backend

```bash
npm start
```

Backend URL:

```text
http://localhost:5000
```

## 6. Frontend setup

Open a second terminal inside `client`:

```bash
npm install
npm run dev
```

Vite will print the local frontend URL, normally:

```text
http://localhost:5173
```

## 7. Login

The existing seed admin is:

```text
Email: admin@gmail.com
Password: admin123
```

Change this password for any real deployment.

Customers can create accounts through `/signup`.

## 8. Current data architecture

```text
React
  ↓
Express REST API
  ↓
MongoDB
```

Products, categories, hero slides, ads, orders and accounts are handled through the backend API. Passwords are stored as bcrypt hashes and authentication uses JWT.

## 9. Important notes

- Never commit `server/.env` to Git.
- Never put MongoDB credentials in the React `client` folder.
- Never store plaintext passwords in production.
- `localhost:5000` is currently used by the frontend for the API. For deployment, replace this with your deployed API URL (preferably through an environment variable).
- The current checkout payment method is Cash on Delivery; no online payment gateway is configured yet.

## 10. Development order

If the project is moved to another PC, use this order:

1. Install Node.js.
2. Start MongoDB / create MongoDB Atlas database.
3. Configure `server/.env`.
4. Run `npm install` in `server`.
5. Run all five import commands.
6. Run `npm start` in `server`.
7. Run `npm install` in `client`.
8. Run `npm run dev` in `client`.

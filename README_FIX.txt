IMPORTANT: MongoDB Atlas setup

1. cd server
2. npm install
3. Create server/.env:
   MONGO_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-secret
   PORT=5000
4. Run imports:
   npm run import:products
   npm run import:categories
   npm run import:ads
   npm run import:orders
   npm run import:accounts
5. Start backend:
   npm start
6. In another terminal:
   cd client
   npm install
   npm run dev

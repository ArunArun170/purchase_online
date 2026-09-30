# Client

React + Vite frontend for the MERN e-commerce project.

## Run

```bash
npm install
npm run dev
```

The frontend currently calls the backend at `https://purchase-online.onrender.com`.
Start the server before testing login, checkout, admin pages, or MongoDB-backed content.

## Authentication

Login/signup responses store a short-lived browser JWT in `localStorage` as `anon_token` and the public user object as `anon_user`.

Do not place passwords or MongoDB credentials in this folder.

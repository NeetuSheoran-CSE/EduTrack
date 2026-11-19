# EduTrack – School Management & Academic Portal
React + Vite + Tailwind frontend (`frontend/`) and Node + Express + MongoDB backend (`backend/`).

## Run the backend
```
cd backend && npm install && cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm run seed     # demo data + logins
npm run dev      # http://localhost:5000/api
```
Demo logins: admin@edutrack.in / Admin@123 · teacher@edutrack.in / Teacher@123 · student@edutrack.in / Student@123

## Run the frontend
```
cd frontend && npm install && npm run dev    # http://localhost:5173
```
The UI currently runs on built-in demo data so every screen works without the server.
`frontend/src/services/api.js` already maps to every backend route for the next step (swap Store actions for API calls).

## API (all under /api, JWT bearer token except login)
- POST /auth/login · GET /auth/me · PUT /auth/profile · PUT /auth/password
- GET/POST /students · GET/PUT/DELETE /students/:id (teachers see only assigned classes, students only themselves)
- GET/POST /attendance · GET /attendance/student/:id
- GET /fees · POST /fees/payments · GET /fees/payments · GET /fees/receipt/:id
- GET/POST /results · GET /report-card/:studentId?exam=
- GET /dashboard · GET/POST /teachers · GET/POST /classes · GET/POST /notices · PATCH /notices/:id/read, /notices/read-all

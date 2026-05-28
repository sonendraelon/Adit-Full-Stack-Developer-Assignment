# TaskMaster - Full Stack Task Management App

TaskMaster is a full-stack Task Management Web Application built with the MERN stack (MongoDB, Express, React, Node.js). It includes real JWT authentication, user-scoped task access, and a responsive dashboard for desktop and mobile.

## 🚀 Features

- **User Authentication:** Secure JWT-based authentication with password hashing via `bcrypt`.
- **User-Scoped Tasks:** Every task is linked to the logged-in user and only owner tasks are returned/modified.
- **Task Management (CRUD + Toggle):** Create, read, update, delete, and toggle task completion.
- **Pagination, Search, & Filtering:** Easily navigate through large lists of tasks.
- **Priority Support:** Tasks support `Low`, `Medium`, and `High` priority.
- **Premium UI/UX:** Built with Tailwind CSS, featuring glassmorphism, micro-animations, and smooth dark/light mode transitions.
- **State Management:** Fully integrated with Redux Toolkit for seamless frontend state synchronization.
- **Form Validation:** Using React Hook Form + Zod for robust client-side validation.
- **Dockerized:** Easy deployment and setup using Docker & Docker Compose.
- **API Documentation:** Interactive Swagger API Docs.

## 🛠 Tech Stack

**Frontend:**
- React 19 (Vite)
- TypeScript
- Tailwind CSS
- Redux Toolkit & React-Redux
- React Router
- React Hook Form + Zod
- Axios

**Backend:**
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcrypt
- Swagger (swagger-jsdoc & swagger-ui-express)

## 🐳 Running with Docker (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. The Frontend will be available at `http://localhost:3000`
4. The Backend API will be running on `http://localhost:5000`
5. The MongoDB instance runs locally on port `27017`

## 💻 Running Locally without Docker

### Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` (or just use defaults).
4. Run the development server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## 🔐 Authentication Flow

1. User registers or logs in using `/api/auth/register` or `/api/auth/login`.
2. Backend validates credentials and returns a JWT token.
3. Frontend stores token in `localStorage`.
4. Axios interceptor sends `Authorization: Bearer <token>` on protected calls.
5. Backend auth middleware verifies JWT on each protected route and injects user info.
6. Task operations are executed only for tasks owned by the authenticated user.

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Auth APIs (Public)
- `POST /auth/register` - register a new user
- `POST /auth/login` - login and receive JWT
- `POST /auth/logout` - clear auth cookie/session context
- `GET /auth/me` - get current profile (protected)

### Task APIs (Protected - JWT required)
- `GET /tasks` - get user tasks (supports `page`, `limit`, `search`, `status`)
- `POST /tasks` - create task (`title`, `description`, `priority`)
- `PUT /tasks/:id` - update task (`title`, `description`, `priority`, `status`)
- `PATCH /tasks/:id` - toggle status (`pending`/`completed`)
- `DELETE /tasks/:id` - delete task

## 📖 API Documentation (Swagger)

Once backend is running, open [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

## 📁 Folder Structure
```
.
├── backend/
│   ├── src/
│   │   ├── config/       # DB Connection
│   │   ├── controllers/  # API logic
│   │   ├── middleware/   # Auth & Error middlewares
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routes
│   │   └── index.ts      # App entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI parts
│   │   ├── pages/        # Route components
│   │   ├── services/     # Axios API configuration
│   │   ├── store/        # Redux store and slices
│   │   ├── App.tsx       # Main router & layout
│   │   └── index.css     # Global styles & Tailwind config
│   ├── Dockerfile
│   └── nginx.conf        # Nginx config for Docker
└── docker-compose.yml    # Docker orchestration
```

## 🤝 Assumptions & Notes

- **Database:** Defaults to `mongodb://localhost:27017/task-manager`. For Docker, it automatically uses the internal Docker network to connect to MongoDB.
- **Security:** In a production environment, you would store secrets (like `JWT_SECRET`) in `.env` securely. For this assignment, defaults are provided to ensure a seamless "click-and-run" experience.
- **CORS:** Backend supports both `http://localhost:3000` and `http://localhost:5173` by default (`CLIENT_URLS` override available).

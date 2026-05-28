# Task Management Web Application

A full-stack task management web application built with React and Node.js. It allows users to register, log in, and manage their tasks efficiently.

## Deployed Links
- **Frontend (Vercel):** [https://adit-full-stack-developer-assignment.vercel.app](https://adit-full-stack-developer-assignmen.vercel.app)
- **Backend (Render):** [https://task-manager-backend.onrender.com](https://adit-full-stack-developer-assignment.onrender.com/)
## Features Included (Bonus Points Covered)
- **Docker Setup:** `docker-compose.yml` and `Dockerfile` are configured for the full stack.
- **Role-based Access:** Differentiates between normal users and admins.
- **Pagination & Search:** Implemented in the backend APIs and connected to the frontend UI.
- **Unit Testing:** Basic unit tests implemented with Jest in the backend.
- **Deployment:** Deployed on Vercel and Render.
- **Dark Mode UI:** Fully supported dark and light modes.
- **Swagger API Documentation:** Available at `/api-docs` on the backend.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite, Redux Toolkit
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT authentication

## API Reference
Protected routes require a `Bearer` token in the `Authorization` header.

| Method | Endpoint           | Auth Required | Description |
| :---   | :---               | :---          | :--- |
| POST   | `/api/auth/register` | No | Register a new user |
| POST   | `/api/auth/login`    | No | Login and get JWT token |
| GET    | `/api/tasks`         | Yes | Get tasks (with pagination & search) |
| POST   | `/api/tasks`         | Yes | Create a new task |
| PUT    | `/api/tasks/:id`     | Yes | Update task details |
| PATCH  | `/api/tasks/:id`     | Yes | Toggle complete/pending status |
| DELETE | `/api/tasks/:id`     | Yes | Delete a task |

## Folder Structure
```
backend/
  src/
    config/      # DB connection
    controllers/ # Auth & Task logic
    middleware/  # JWT & Error handlers
    models/      # Mongoose schemas
    routes/      # Express routes
    __tests__/   # Unit tests
  Dockerfile
  docker-compose.yml
  package.json

frontend/
  src/
    components/  # UI components
    pages/       # Pages like Login, Dashboard
    services/    # Axios configuration
    store/       # Redux state management
  Dockerfile
  package.json
```

## Setup Instructions

**Backend:**
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Set up the `.env` file with `PORT`, `MONGO_URI`, and `JWT_SECRET`.
4. Run the server: `npm run dev`

**Frontend:**
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Set up `.env` with `VITE_API_URL` pointing to the backend.
4. Run the app: `npm run dev`

**Docker:**
Run `docker-compose up --build` from the root directory to start both the frontend and backend together.

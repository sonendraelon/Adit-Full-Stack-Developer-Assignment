# TaskMaster Pro

![TaskMaster Pro Banner](https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=2000&h=600)

> A premium, full-stack Task Management Web Application engineered with precision. Featuring a stunning liquid glassmorphism UI, robust role-based JWT authentication, and a lightning-fast React + Node.js architecture.

## 🚀 Live Deployment

- **Live Application:** [TaskMaster Pro on Vercel](https://adit-full-stack-developer-assignment.vercel.app/)

## ✨ Key Features & Evaluations Covered

- **Apple-Inspired Glassmorphism UI:** Stunning, responsive front-end leveraging advanced CSS backdrop filters and dynamic gradients for a premium feel.
- **Robust JWT Authentication:** Secure login & registration with encrypted passwords (bcrypt) and protected API routes.
- **Role-Based Access Control:** Differentiates between normal users (can only see/manage their tasks) and Admins (can view/manage all tasks).
- **Pagination & Search:** Optimized backend queries to fetch tasks with full pagination support and case-insensitive search logic.
- **Dark & Light Mode UI:** Seamless theme switching with fluid CSS transitions.
- **Docker Ready:** Complete `Dockerfile` and `docker-compose.yml` configurations provided for both frontend and backend orchestration.
- **Swagger Documentation:** API is fully documented and testable via Swagger UI.
- **Clean Architecture:** Environment variables handle all configuration—zero hardcoded localhosts. Unnecessary comments stripped for purely logic-defining code structure.

## 🛠 Tech Stack

### Frontend
- **React.js 18** with **Vite**
- **TypeScript**
- **Tailwind CSS v4** (Custom glassmorphism theme)
- **Redux Toolkit** (State Management)
- **React Hook Form** + **Zod** (Validation)
- **Axios** (API Client)

### Backend
- **Node.js** & **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** (JSON Web Tokens)
- **bcryptjs** (Password Hashing)
- **Swagger UI Express**

## 📂 Folder Structure

```text
📦 taskmaster-pro
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 config        # Database configuration
│   │   ├── 📁 controllers   # Auth & Task controller logic
│   │   ├── 📁 middleware    # JWT Auth & Error handlers
│   │   ├── 📁 models        # Mongoose Schemas
│   │   ├── 📁 routes        # API Route definitions
│   │   └── 📄 server.ts     # Express server & Swagger setup
│   ├── 📄 Dockerfile
│   └── 📄 package.json
└── 📁 frontend
    ├── 📁 src
    │   ├── 📁 assets        # Static assets
    │   ├── 📁 components    # Reusable UI components
    │   ├── 📁 pages         # View pages (Login, Dashboard, etc.)
    │   ├── 📁 services      # Axios instance setup
    │   ├── 📁 store         # Redux Toolkit slices & store
    │   ├── 📄 App.tsx       # Main router & theme provider
    │   └── 📄 index.css     # Global Tailwind & Glassmorphism styles
    ├── 📄 Dockerfile
    ├── 📄 tailwind.config.js
    └── 📄 vite.config.ts
```

## 🔗 API Reference

All protected routes require a valid JWT `Bearer` token in the `Authorization` header.

| Method   | Endpoint           | Auth Required? | Description                          |
| -------- | ------------------ | -------------- | ------------------------------------ |
| `POST`   | `/api/auth/register` | No             | Register a new user                  |
| `POST`   | `/api/auth/login`    | No             | Login and receive JWT token          |
| `GET`    | `/api/auth/me`       | Yes            | Get current user profile             |
| `GET`    | `/api/tasks`         | Yes            | Get paginated, filtered tasks        |
| `POST`   | `/api/tasks`         | Yes            | Create a new task                    |
| `PUT`    | `/api/tasks/:id`     | Yes            | Update a task (title, desc, priority)|
| `PATCH`  | `/api/tasks/:id`     | Yes            | Toggle task completion status        |
| `DELETE` | `/api/tasks/:id`     | Yes            | Delete a task                        |

*Detailed interactive documentation is available locally via Swagger at `/api-docs`.*

## ⚙️ Local Setup Instructions

**Prerequisites:** Node.js v18+, MongoDB, and (Optional) Docker.

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd <repo-name>
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/task-manager
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URLS=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend dev server:
```bash
npm run dev
```

### 4. Running via Docker Compose
To spin up both services quickly:
```bash
docker-compose up --build
```

## 🧠 Assumptions Made
- The deployment platform (Vercel/Render) handles routing the `/api` requests or injecting the correct `VITE_API_URL` environment variables.
- User email addresses must be unique.
- Passwords must be at least 6 characters long.
- Role-based access expects users with `role: "admin"` to be manually configured or seeded into the database to view all global tasks.

---
*Built to showcase clean architecture, optimized logics, and a top 1% premium user interface.*

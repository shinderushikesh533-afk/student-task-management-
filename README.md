# 📚 StudyPulse — Student Task Planner App

A modern, full-stack task management web application built for students to organize study tasks, assignments, exam preparations, deadlines, and academic priorities.

Built with the **MERN** stack:
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Lucide Icons + React Router v7
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose ODM

---

## 🚀 Features

### Core Student Task Management
- **Task Creation (`POST /api/tasks`):**
  - **Title:** Required, trimmed, validated.
  - **Description:** Optional detailed study notes or assignment criteria.
  - **Category:** `Study`, `Assignment`, `Exam`, `Personal`, `Other`.
  - **Priority Level:** `Low`, `Medium`, `High`.
  - **Due Date:** Date picker with dynamic relative calculation (`Due today`, `Due tomorrow`, `In X days`, `Overdue by X days`).
  - **Completion Status:** Interactive boolean toggle (`isCompleted`).
- **Dashboard Overview (`GET /api/tasks`):**
  - Academic workload statistics cards (Total tasks, Completed %, Pending count, Urgent/Due soon in 48h).
  - Search bar filtering tasks by title or description in real-time.
  - Category filter dropdown (`Study`, `Assignment`, `Exam`, `Personal`, `Other`).
  - Priority filter dropdown (`Low`, `Medium`, `High`).
  - Status toggle buttons (`All Tasks`, `Pending`, `Completed`).
  - Sorting options (`Date Created`, `Due Date`, `Priority Level`) with Ascending / Descending order toggle.
  - One-click status toggle directly from the card.
  - Quick action buttons (View Details, Edit, Delete).
- **Task Details View (`GET /api/tasks/:id`):**
  - Complete task view with formatted timestamps (`Created on`, `Last updated`).
  - Overdue warning banners.
  - Direct Edit, Delete, and Status Toggle actions.
- **Task Update (`PUT /api/tasks/:id`):**
  - Pre-filled edit form with instant validation.
- **Task Deletion (`DELETE /api/tasks/:id`):**
  - Accessible modal dialog for user confirmation before deletion.
- **Empty States & Feedback:**
  - Clear empty state when no tasks exist yet with a quick "+ Add Your First Task" CTA.
  - Distinct "No tasks found" state when filter/search criteria return no matches, with a "Reset all filters" button.
  - Loading spinners for API requests.
  - User-friendly error banners with retry buttons.
  - 404 Not Found page for invalid routes.

---

## 🛠 Project Architecture

```
final project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── controllers/
│   │   └── taskController.js     # Full CRUD logic, search, filter, sort
│   ├── middleware/
│   │   └── errorMiddleware.js    # Not Found & Global Error Handler (handles CastError, ValidationError)
│   ├── models/
│   │   └── Task.js               # Mongoose Task schema with validation & indexes
│   ├── routes/
│   │   └── taskRoutes.js         # Express Router endpoints
│   ├── seeder.js                 # Sample database seeder
│   ├── test-api.js               # Automated API test suite
│   ├── server.js                 # Express app initialization & server entrypoint
│   ├── .env                      # Environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js        # Centralized Fetch API client
│   │   ├── components/
│   │   │   ├── CategoryBadge.jsx # Color-coded category tags with icons
│   │   │   ├── ConfirmModal.jsx  # Delete confirmation dialog
│   │   │   ├── EmptyState.jsx    # Empty & no-results states
│   │   │   ├── FilterBar.jsx     # Search, filter pills, and sort controls
│   │   │   ├── LoadingSpinner.jsx# Animated loading indicator
│   │   │   ├── Navbar.jsx        # App header & navigation
│   │   │   ├── PriorityBadge.jsx # Color-coded priority badges (High, Medium, Low)
│   │   │   ├── StatsOverview.jsx # Workload metrics summary cards
│   │   │   ├── StatusBadge.jsx   # Completed vs Pending badge
│   │   │   └── TaskCard.jsx      # Task card component with relative dates
│   │   ├── pages/
│   │   │   ├── AddTask.jsx       # Task creation page
│   │   │   ├── Dashboard.jsx     # Main task board
│   │   │   ├── EditTask.jsx      # Task edit page
│   │   │   ├── NotFound.jsx      # 404 error page
│   │   │   └── TaskDetail.jsx    # Complete single task details page
│   │   ├── App.jsx               # React Router configuration
│   │   ├── index.css             # Tailwind CSS v4 styling
│   │   └── main.jsx
│   ├── vite.config.js            # Vite config with @tailwindcss/vite and /api proxy
│   └── package.json
│
├── package.json                  # Root runner with concurrently
└── README.md
```

---

## ⚙️ Prerequisites

1. **Node.js** (v18+ or v20+ recommended)
2. **npm** (v9+)
3. **MongoDB** installed and running locally on port `27017` (e.g. MongoDB Community Edition).

---

## 📦 Installation & Setup

1. **Install all dependencies** (root, backend, and frontend):
   ```bash
   # From the root directory:
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

2. **Environment Configuration**:
   The backend includes a pre-configured `.env` file (`backend/.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student_task_planner
   NODE_ENV=development
   ```

3. **(Optional) Seed Sample Academic Tasks**:
   Populate the database with realistic sample study tasks:
   ```bash
   npm run seed
   ```
   *(To wipe seeded tasks later: `npm run seed:destroy --prefix backend`)*

---

## 🏃 Running the Application

### Option A: Run Both Backend & Frontend Concurrently (Recommended)
From the root folder, run:
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/tasks

### Option B: Run Independently in Separate Terminals

**Terminal 1 (Backend):**
```bash
npm run server
# or: cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run client
# or: cd frontend && npm run dev
```

---

## 🧪 Testing the Backend API

An automated test suite is provided to verify all CRUD operations, parameter filters, and error handlers:

```bash
# Run backend test suite:
cd backend
npm test
```

### Test Coverage includes:
- `GET /api/tasks` (returns 200 and list of tasks)
- `GET /api/tasks?search=...` (regex search across title and description)
- `GET /api/tasks?category=...` (filter by category)
- `GET /api/tasks?priority=...` (filter by priority)
- `GET /api/tasks?status=...` (filter by completion status)
- `GET /api/tasks?sortBy=...&order=...` (sort by due date, priority, created date)
- `GET /api/tasks/:id` (fetch single task by ID)
- `GET /api/tasks/:invalidId` (validates `mongoose.isValidObjectId`, returns 400 Bad Request)
- `GET /api/tasks/:nonExistentId` (returns 404 Not Found)
- `POST /api/tasks` (validates required fields, returns 201 Created)
- `POST /api/tasks` with invalid data (returns 400 Bad Request)
- `PUT /api/tasks/:id` (updates existing task, returns 200 OK)
- `DELETE /api/tasks/:id` (deletes task, returns 200 OK)
- Re-querying deleted task returns 404 Not Found

---

## 🔌 API Reference

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks | `search`, `category`, `priority`, `status`, `sortBy`, `order` |
| `GET` | `/api/tasks/:id` | Get single task by ID | - |
| `POST` | `/api/tasks` | Create a new task | Request body with task fields |
| `PUT` | `/api/tasks/:id` | Update task by ID | Request body with fields to update |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | - |
| `GET` | `/api/health` | API health check | - |

### Example Task Payload:
```json
{
  "title": "Complete Data Structures Assignment 2",
  "description": "Implement AVL balancing algorithms and write unit tests.",
  "category": "Assignment",
  "priority": "High",
  "dueDate": "2026-10-15T23:59:59.000Z",
  "isCompleted": false
}
```

---

## 🎓 Academic Requirements Compliance Checklist

- [x] **Full-Stack MERN Architecture**: React + Vite on frontend, Express + Node.js on backend, MongoDB + Mongoose on database.
- [x] **Task Model**: title, description, category, priority, dueDate, isCompleted, createdAt, updatedAt.
- [x] **CRUD Operations**: Complete Create, Read (all & single), Update, and Delete endpoints with proper HTTP codes.
- [x] **Search & Filter**: Search by title or description; filter by category, priority, status; sort by due date, priority, date created.
- [x] **ID Validation**: `mongoose.isValidObjectId()` validation before querying.
- [x] **Error Handling Middleware**: Global error handler with 404 route handling and Mongoose CastError / ValidationError handling.
- [x] **Frontend Pages**: Dashboard, Add Task, Edit Task, Task Details, and 404 Not Found page.
- [x] **UI/UX Polish**: Responsive design, priority badges, category tags, relative due date calculations, overdue warnings, confirmation dialogs, loading states, and empty states.

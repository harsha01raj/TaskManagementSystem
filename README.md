# TaskFlow PM Frontend

React JavaScript frontend for the Task & Project Management PERN assessment. It includes authentication screens, protected workspace navigation, project CRUD, task CRUD, task assignment, dynamic status updates, search/filter controls, and dashboard statistics.

## Tech Stack

- React JavaScript
- Vite
- lucide-react icons
- Local storage mock data layer for frontend demonstration
- Ready to connect to an Express/PostgreSQL backend

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open the app at the URL printed by Vite, usually:

   ```text
   http://localhost:5173
   ```

## Environment Variables

Create `.env` from `.env.example`.

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

The frontend calls your Express backend routes through service files in `src/services`.

## Backend Routes Used

User:

```text
POST /api/user
GET  /api/user/getAllUser
POST /api/user/login
```

Project:

```text
POST   /api/project
POST   /api/project/getAllProjects
GET    /api/project/getProjectById/:id
PUT    /api/project/updateProject/:id
DELETE /api/project/deleteProjectById/:id
```

Task:

```text
POST   /api/task
POST   /api/task/getAllTasks
PUT    /api/task/updateTask/:id
DELETE /api/task/deleteTaskById/:id
```

## Frontend File Breakdown

- `src/services/apiClient.js`: shared `fetch` wrapper and auth header handling.
- `src/services/userService.js`: user register, login, and get-all-users API calls.
- `src/services/projectService.js`: project create, list/filter, get-by-id, update, and delete API calls.
- `src/services/taskService.js`: task create, list/filter, update, and delete API calls.
- `src/pages/Dashboard.jsx`: dashboard display only.
- `src/pages/ProjectsView.jsx`: project form, project list, and project filters.
- `src/pages/TasksView.jsx`: task form, task list, status update, and task filters.
- `src/components`: reusable auth, shell, navigation, filter, and stat card UI.
- `src/utils/normalizers.js`: adapts common Mongo/SQL response shapes such as `_id` or `id`.

## Backend Database Setup

For the PERN backend, create PostgreSQL tables for users, projects, and tasks. A typical setup would include:

- `users`: `id`, `name`, `email`, `password_hash`, timestamps
- `projects`: `id`, `name`, `description`, `owner_id`, `status`, `due_date`, timestamps
- `tasks`: `id`, `title`, `description`, `project_id`, `assignee_id`, `priority`, `status`, `due_date`, timestamps

Suggested backend commands once implemented:

```bash
createdb taskflow_pm
npm run migrate
npm run seed
```

## Running Frontend and Backend Locally

Frontend:

```bash
npm install
npm run dev
```

Backend, from the backend project folder:

```bash
npm install
cp .env.example .env
npm run migrate
npm run dev
```

Expected backend environment variables:

```bash
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow_pm
JWT_SECRET=jwtsecret
CORS_ORIGIN=http://localhost:5173
```

## Feature Coverage

- User registration and login UI
- Protected app shell after authentication
- Create, edit, delete, and list projects
- Create, edit, delete, assign, and update task status
- Filter and search by status, priority, and assigned user
- Dashboard cards for total projects, total tasks, completed tasks, and pending tasks
- Status overview visualization and assignment summary

## Build

```bash
npm run build
```

## Submission Checklist

- Push this frontend and the backend to a public or accessible GitHub repository.
- Include backend migration files and API setup instructions.
- Add screenshots or a short demo video showing login, dashboard, projects, tasks, and filters.

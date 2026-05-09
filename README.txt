Team Task Manager (Full-Stack)
==============================

A full-stack web application designed for team collaboration, allowing users to create projects, assign tasks, and track their progress with role-based access control.

Live Application: https://team-task-manager-production-72f7.up.railway.app/login
GitHub Repository: https://github.com/laxminivasreddy/team-task-manager

Key Features
------------
* Authentication (Signup & Login) with JWT-based security.
* Role-based Access Control (RBAC):
  - Admin: Can create projects, create tasks, and assign tasks to members.
  - Member: Can view projects and update the status of tasks assigned to them.
* Project & Team Management.
* Task Creation, Assignment, and Status Tracking (To Do, In Progress, Done).
* Interactive Dashboard: Displays task statistics, status breakdown, and overdue tasks.

Technology Stack
----------------
* Frontend: React (Vite), TypeScript, Lucide Icons, Custom CSS UI.
* Backend: Node.js, Express.js, TypeScript.
* Database & ORM: PostgreSQL, Prisma v5.
* Deployment: Railway (Nixpacks with Node.js v20 engine).

Getting Started (Local Development)
-----------------------------------
1. Clone the repository.
2. Run `npm install` in the root directory.
3. Configure the `.env` file in the backend with `DATABASE_URL` and `JWT_SECRET`.
4. Run database migrations: `cd backend && npx prisma db push`
5. Start the development server: `npm run dev`

Test Credentials
----------------
If you have seeded the database or want to test existing roles, use:
* Admin: admin@taskmanager.com / password123
* Member: member@taskmanager.com / password123

Deployment Details
------------------
This application is fully containerized and deployed using Railway. 
The backend serves the built React frontend from the `frontend/dist` directory as a unified full-stack service, communicating securely with a provisioned Railway PostgreSQL database.

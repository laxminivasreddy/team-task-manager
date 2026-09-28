# 🚀 Team Task Manager

A full-stack team collaboration and task management application that helps teams organize projects, assign tasks, track progress, and manage users through role-based access control.

<p align="center">
  <a href="https://team-task-manager-production-72f7.up.railway.app/login">
    <strong>🌐 Live Demo</strong>
  </a>
</p>

---

## ✨ Features

### 🔐 Authentication & Security

- User Signup and Login
- JWT-based authentication
- Protected routes
- Secure password handling
- Role-based access control

### 👥 Role-Based Access Control

The application supports two user roles:

| Role | Permissions |
|------|-------------|
| 👑 **Admin** | Create projects, create tasks, assign tasks, manage team workflow |
| 👤 **Member** | View projects and update the status of assigned tasks |

### 📁 Project Management

- Create and manage projects
- Organize tasks under projects
- View project-level task information
- Team-based project organization

### ✅ Task Management

- Create tasks
- Assign tasks to team members
- Track task status
- Update task progress
- Monitor overdue tasks

Task workflow:

```text
To Do  →  In Progress  →  Done

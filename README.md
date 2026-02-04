# MediQueue - Hospital Management System
# MediQueue – Hospital Queue Management System

MediQueue is a full-stack hospital queue management platform that helps reduce waiting time and improve patient experience through real-time digital token tracking.

Patients can join queues remotely, track their position, and avoid long physical waiting lines.

---

## 🚀 Features

### Patient Features
- Secure Login & Registration  
- Digital Token Generation  
- Real-time Queue Tracking  
- View Estimated Waiting Time  
- Track Queue Status from Anywhere  

### Admin / Hospital Staff Features
- Manage Departments and Counters  
- Call Next Patient  
- Monitor Live Queue  
- Generate Reports & Analytics  
- View Waiting Time Statistics  

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript  
- Vite  
- React Router  
- Framer Motion  
- CSS Styling  

### Backend
- Node.js  
- Express.js  
- PostgreSQL  
- JWT Authentication  
- REST API  

---

## 📁 Project Structure

hospital-queue-system/
│── backend/
│ ├── middleware/
│ │ └── auth.js
│ ├── routes/
│ │ ├── analytics.js
│ │ ├── counters.js
│ │ ├── departments.js
│ │ ├── tokens.js
│ │ └── routes.js
│ ├── db.js
│ ├── index.js
│── frontend/
│ ├── react-ui/
│ │ ├── src/
│ │ ├── package.json
│ │ └── vite.config.ts
│── README.md


---

## ⚙ Installation & Setup

### Prerequisites

- Node.js installed  
- PostgreSQL installed  
- Git installed  

---

## 🔹 Backend Setup

1. Navigate to backend folder

```bash
cd backend
```

2. Install Dependencies

```bash
npm install
```

3. Create a .env file in backend directory:

```ini
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

4. Start backend server

```bash
node index.js
```
Backend will run at:
```arduino
http://localhost:5000
```

## 🔹 Frontend Setup

1. Navigate to frontend UI folder

```bash
cd frontend/react-ui
```

2. Install dependencies

```bash
npm install
```

3. Start frontend

```bash
npm run dev
```
Frontend runs at:
```arduino
http://localhost:5173
```

## 🌐 Deployment Guide

## Frontend Deployment (Recommended)
Platform: Vercel

Steps:

1. Push project to GitHub
2. Import repository to Vercel
3. Set root directory:

```bash
frontend/react-ui
```

4. Build Command:

```arduino
npm run build
```

## Backend Deployment (Recommended)

Platform: Render

Steps:

1. Create account on https://render.com
2. Create new “Web Service”
3. Connect GitHub repository
4. Set root directory:

```ngnix
backend
```

5. Build Command

```ngnix
npm install
```

6. Start Command

```ngnix
node index.js
```

7. Add Environment Variables:

```ngnix
DATABASE_URL
JWT_SECRET
PORT
```

## Database Deployment

Use:

👉 Render PostgreSQL Database

Create PostgreSQL instance on Render

Copy connection string

Use it in backend .env and Render environment variables

## 🔮 Future Enhancements

Email / SMS notifications

Appointment scheduling

Multi-hospital support

Role-based access control

Mobile app version

## 👨‍💻 Author

Labanti Purty

B.Tech Computer Science

Full Stack Developer

Project: MediQueue

## 📄 License

This project is developed for educational purposes.

⭐ If you like this project, feel free to star the repository!

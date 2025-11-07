# Daily Task Manager

A complete 3-tier web application for managing daily tasks with user authentication, built with clean and beginner-friendly code.

## ✨ Features

### Authentication & Security
- ✅ User registration and login system
- ✅ Secure password storage with bcrypt hashing
- ✅ JWT (JSON Web Token) authentication
- ✅ Protected routes - users can only access their own tasks
- ✅ Automatic token validation

### Task Management
- ✅ Create new tasks with title and description
- ✅ View all tasks in a clean dashboard
- ✅ Edit existing tasks (title, description, status)
- ✅ Mark tasks as completed/pending
- ✅ Delete tasks with confirmation
- ✅ Filter tasks (All/Active/Completed)

### User Interface
- ✅ Modern, responsive design with pure CSS
- ✅ Task statistics dashboard (Total, Completed, Pending)
- ✅ Interactive task filtering
- ✅ Modal-based task editing
- ✅ Real-time UI updates
- ✅ Mobile-friendly responsive layout
- ✅ Smooth animations and transitions

### Developer Features
- ✅ Automatic database schema initialization
- ✅ Docker & Docker Compose support
- ✅ Environment-based configuration
- ✅ Well-commented beginner-friendly code
- ✅ No ORMs - pure SQL for learning
- ✅ RESTful API design

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with pg driver)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Deployment**: Docker & Docker Compose

## 📋 Prerequisites

Choose one of the following deployment methods:

### Option 1: Docker Deployment (Recommended)
- Docker
- Docker Compose

### Option 2: Manual Deployment
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker:

```bash
# 1. Clone the repository
git clone https://github.com/mayurnikam266/3-Tier-Daily-Task-Manager-.git
cd 3-Tier-Daily-Task-Manager-

# 2. Replace API_URL of login.html register.html and tasks.js files to
const API_URL = '/api'; 

# 3. Start all services with one command docker-compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:5000
```

That's it! The database will be created automatically with all tables.

### Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

See [DOCKER.md](DOCKER.md) for detailed Docker deployment guide.

## 🔧 Manual Setup Instructions

### Step 1: Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE taskmanager;
```

2. **Tables will be created automatically** when you start the backend server (similar to Django migrations).

   Optional: If you want to create tables manually, run the SQL in `backend/schema.sql`

### Step 2: Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
# Windows PowerShell
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

4. Edit `.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=taskmanager
JWT_SECRET=your_secret_key_here
PORT=5000
```

5. Start the server:
```bash
node server.js
```

You should see:
```
Connected to PostgreSQL database
Checking database schema...
✓ Users table ready
✓ Tasks table ready
✓ Indexes ready
✅ Database schema initialized successfully!

Server is running on http://localhost:5000
```

### Step 3: Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Serve the frontend files using a static file server:

**Option A: Using Python**
```bash
python -m http.server 8080
```

**Option B: Using Node.js http-server**
```bash
npx http-server -p 8080
```

**Option C: Using VS Code Live Server extension**
- Right-click on `index.html` → Open with Live Server

3. Access the application at `http://localhost:8080`

## 📖 Usage Guide

### First Time Setup
1. Open the application at `http://localhost:8080`
2. Click **"Register"** to create a new account
3. Fill in username, email, and password
4. After registration, you'll be redirected to login
5. Login with your credentials

### Managing Tasks
1. **Dashboard Overview**: View statistics (Total, Completed, Pending tasks)
2. **Add Task**: Fill in the form at the top with title and description
3. **Filter Tasks**: Click All/Active/Completed buttons to filter view
4. **Complete Task**: Click ✓ icon to mark as complete
5. **Edit Task**: Click ✏️ icon to open edit modal
6. **Delete Task**: Click 🗑️ icon to delete (with confirmation)
7. **Logout**: Click logout button in the navigation bar

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
  ```json
  Request: { "username": "john", "email": "john@example.com", "password": "pass123" }
  Response: { "message": "User registered successfully", "user": {...} }
  ```

- `POST /auth/login` - Login and receive JWT token
  ```json
  Request: { "username": "john", "password": "pass123" }
  Response: { "message": "Login successful", "token": "jwt_token", "user": {...} }
  ```

### Tasks (Requires Authentication)
- `GET /tasks` - Get all tasks for logged-in user
  ```json
  Headers: { "Authorization": "Bearer <token>" }
  Response: [ { "id": 1, "title": "Task", "description": "...", "completed": false, ... } ]
  ```

- `POST /tasks` - Create a new task
  ```json
  Headers: { "Authorization": "Bearer <token>" }
  Request: { "title": "New Task", "description": "Task description" }
  Response: { "id": 1, "title": "New Task", ... }
  ```

- `PUT /tasks/:id` - Update a task
  ```json
  Headers: { "Authorization": "Bearer <token>" }
  Request: { "title": "Updated", "description": "...", "completed": true }
  Response: { "id": 1, "title": "Updated", ... }
  ```

- `DELETE /tasks/:id` - Delete a task
  ```json
  Headers: { "Authorization": "Bearer <token>" }
  Response: { "message": "Task deleted successfully" }
  ```

## 📁 Project Structure
```
project/
├── README.md                      # Main documentation
├── DOCKER.md                      # Docker deployment guide
├── docker-compose.yml             # Docker orchestration
│
├── backend/                       # Backend API Server
│   ├── package.json              # Node.js dependencies
│   ├── server.js                 # Express server entry point
│   ├── db.js                     # PostgreSQL connection pool
│   ├── initDb.js                 # Auto schema initialization
│   ├── schema.sql                # SQL schema (reference)
│   ├── .env.example              # Environment variables template
│   ├── Dockerfile                # Backend container image
│   ├── .dockerignore             # Docker ignore file
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── tasks.js             # Task CRUD routes
│   └── middleware/
│       └── authMiddleware.js    # JWT verification middleware
│
└── frontend/                      # Frontend Web Interface
    ├── index.html                # Landing page
    ├── login.html                # Login page
    ├── register.html             # Registration page
    ├── dashboard.html            # Main dashboard
    ├── style.css                 # Complete CSS styles
    ├── tasks.js                  # Frontend logic
    ├── nginx.conf                # Nginx configuration
    ├── Dockerfile                # Frontend container image
    └── .dockerignore             # Docker ignore file
```

## 🎯 Key Features Explained

### Automatic Schema Initialization
Unlike traditional Node.js apps, this project auto-creates database tables (like Django migrations):
- Tables are created automatically when backend starts
- No manual SQL execution needed
- Uses `CREATE TABLE IF NOT EXISTS` for safe initialization

### Task Filtering & Statistics
- **Statistics Dashboard**: Real-time count of total, completed, and pending tasks
- **Filter Buttons**: Toggle between All, Active, and Completed tasks
- **Smart UI Updates**: Statistics update automatically as tasks change

### Modal-Based Editing
- Click edit icon (✏️) to open a modal dialog
- Edit title, description, and completion status
- Changes saved immediately with visual feedback

### Security Implementation
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 24-hour token expiration
- **Protected Routes**: Middleware validates tokens on every request
- **User Isolation**: SQL queries filter by user_id automatically
- **SQL Injection Protection**: Parameterized queries with pg library

## 🔒 Security Features
- ✅ Passwords hashed with bcrypt (never stored as plain text)
- ✅ JWT tokens for stateless authentication
- ✅ Authorization middleware on all protected routes
- ✅ Each user can only access their own tasks
- ✅ SQL injection prevention with parameterized queries
- ✅ CORS configured for cross-origin requests
- ✅ Environment variables for sensitive data

## 🐳 Docker Deployment

The application includes complete Docker support:
- **One command deployment**: `docker-compose up -d`
- **All services containerized**: PostgreSQL, Backend, Frontend
- **Data persistence**: PostgreSQL data stored in Docker volume
- **Health checks**: Backend waits for database to be ready
- **Production-ready**: Nginx serves frontend with optimization

See [DOCKER.md](DOCKER.md) for complete Docker documentation.

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
# Windows: Services → PostgreSQL
# Linux: sudo systemctl status postgresql

# Check .env file credentials
# Make sure DB_HOST, DB_USER, DB_PASSWORD are correct
```

### "MODULE_NOT_FOUND" error
```bash
# Install dependencies
cd backend
npm install
```

### Can't connect to database
```bash
# Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE taskmanager;"

# Or use pgAdmin to create database
```

### Frontend can't reach backend
```bash
# Make sure backend is running on port 5000
# Check browser console for CORS errors
# Verify API_URL in frontend files points to http://localhost:5000
```

### Port already in use
```bash
# Change PORT in backend/.env
# Or kill process using the port:
# Windows: netstat -ano | findstr :5000
# Linux: lsof -ti:5000 | xargs kill
```

## 📚 Learning Resources

This project is perfect for learning:
- RESTful API design
- JWT authentication
- SQL database operations (without ORMs)
- Frontend-backend communication with fetch()
- Docker containerization
- Modern CSS layouts and animations

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License
MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author
Created with ❤️ for developers learning full-stack development

## ⭐ Support
If you found this helpful, please give it a star on GitHub!

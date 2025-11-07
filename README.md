# Daily Task Manager

A simple 3-tier web application for managing daily tasks with user authentication.

## Features
- User registration and login
- Secure password storage with bcrypt
- JWT authentication
- Each user manages their own tasks
- Create, read, update, and delete tasks
- Mark tasks as completed
- Modern, clean UI with pure CSS

## Tech Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Database Setup
1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE taskmanager;
```

2. Connect to the database and create tables:
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Backend Setup
1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

4. Edit `.env` file with your PostgreSQL credentials.

5. Start the server:
```bash
node server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Open the `frontend` folder
2. Open `index.html` in your web browser, or use a simple HTTP server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

3. Access the application at `http://localhost:8080`

## Usage
1. Register a new account on the registration page
2. Login with your credentials
3. Add, edit, complete, or delete your tasks
4. Logout when done

## API Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /tasks` - Get all tasks for logged-in user
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Project Structure
```
project/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── db.js
│   ├── .env.example
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   └── middleware/
│       └── authMiddleware.js
└── frontend/
    ├── index.html
    ├── style.css
    ├── login.html
    ├── register.html
    ├── dashboard.html
    └── tasks.js
```

## Security Notes
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Each user can only access their own tasks
- SQL queries use parameterized statements to prevent SQL injection

## License
MIT

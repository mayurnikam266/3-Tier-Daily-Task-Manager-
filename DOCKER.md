# 🐳 Docker Deployment Guide

This guide explains how to deploy the Daily Task Manager application using Docker.

## Prerequisites
- Docker installed on your system
- Docker Compose installed

## Quick Start

### 1. Clone or copy the project to your server

### 2. Start the application with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

That's it! The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432

## What Docker Compose Does

The `docker-compose.yml` file creates three services:

1. **postgres** - PostgreSQL database
   - Automatically creates the `taskmanager` database
   - Data persists in Docker volume
   - Health checks ensure it's ready before backend starts

2. **backend** - Node.js API server
   - Builds from `backend/Dockerfile`
   - Automatically connects to PostgreSQL
   - Creates database tables on startup
   - Runs on port 5000

3. **frontend** - Nginx web server
   - Builds from `frontend/Dockerfile`
   - Serves static HTML/CSS/JS files
   - Runs on port 8080

## Configuration

### Change Ports
Edit `docker-compose.yml` to change exposed ports:
```yaml
services:
  frontend:
    ports:
      - "80:80"  # Change 8080 to 80 for standard HTTP
  backend:
    ports:
      - "3000:5000"  # Change 5000 to 3000
```

### Change Database Credentials
Edit the environment variables in `docker-compose.yml`:
```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: your_secure_password
  backend:
    environment:
      DB_PASSWORD: your_secure_password
      JWT_SECRET: your_random_secret_key
```

### Production Configuration
For production deployment:
1. Change all default passwords
2. Use strong JWT_SECRET
3. Enable HTTPS (use reverse proxy like Nginx/Traefik)
4. Set up proper backup for postgres_data volume

## Docker Commands

### View running containers
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop and remove everything
```bash
# Stop services
docker-compose down

# Stop and remove volumes (deletes all data!)
docker-compose down -v
```

### Rebuild after code changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Access container shell
```bash
# Backend container
docker exec -it taskmanager-backend sh

# Database container
docker exec -it taskmanager-db psql -U postgres -d taskmanager
```

## Deployment on Remote Server

### Deploy via SSH
```bash
# Copy files to server
scp -r * user@your-server:/path/to/app

# SSH into server
ssh user@your-server

# Navigate to app directory
cd /path/to/app

# Start with docker-compose
docker-compose up -d
```

### Deploy with Git
```bash
# On server
git clone <your-repo-url>
cd <repo-name>
docker-compose up -d
```

## Troubleshooting

### Backend can't connect to database
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Port already in use
```bash
# Find what's using the port
netstat -tulpn | grep :8080

# Kill the process or change port in docker-compose.yml
```

### Database data persistence
Data is stored in Docker volume `postgres_data`. To backup:
```bash
# Backup
docker exec taskmanager-db pg_dump -U postgres taskmanager > backup.sql

# Restore
docker exec -i taskmanager-db psql -U postgres taskmanager < backup.sql
```

### Reset everything
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove images
docker rmi taskmanager-backend taskmanager-frontend

# Start fresh
docker-compose up -d --build
```

## Environment Variables

The backend service uses these environment variables (set in docker-compose.yml):

- `DB_HOST` - Database hostname (postgres)
- `DB_PORT` - Database port (5432)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port (5000)
- `NODE_ENV` - Environment (production/development)

## Network Architecture

All containers are on the same Docker network (`taskmanager-network`):
- Frontend can access backend via `http://backend:5000`
- Backend can access database via `postgres:5432`
- Ports are exposed to host for external access

## Health Checks

PostgreSQL has a health check that runs every 10 seconds. Backend waits for PostgreSQL to be healthy before starting.

## Security Notes

For production:
1. **Change default passwords** in docker-compose.yml
2. **Use secrets management** (Docker Secrets, environment files)
3. **Enable HTTPS** with reverse proxy
4. **Restrict database access** (don't expose port 5432 publicly)
5. **Use Docker secrets** instead of environment variables for sensitive data
6. **Regular updates** - update base images periodically
7. **Firewall rules** - only allow necessary ports

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Image](https://hub.docker.com/_/node)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

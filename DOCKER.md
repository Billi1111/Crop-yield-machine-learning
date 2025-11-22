# Running with Docker

This guide explains how to run the Crop Yield Predictor application using Docker, without needing Python or Node.js installed locally.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

1. **Create environment file** (optional, for Gemini AI):
   ```bash
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
   ```
   Replace `your_gemini_api_key_here` with your actual Gemini API key from [Google AI Studio](https://ai.google.dev/).

2. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start in background (detached mode)
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up --build
```

### Clean up (remove containers, networks, and volumes)
```bash
docker-compose down -v
```

## Services

### Frontend (React + Vite)
- **Port**: 3000
- **Container**: `crop-yield-frontend`
- **Access**: http://localhost:3000

### Backend (Python Flask)
- **Port**: 5000
- **Container**: `crop-yield-backend`
- **Health Check**: http://localhost:5000/health
- **API Endpoint**: http://localhost:5000/predict

## Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

This file is automatically loaded by Docker Compose.

## Troubleshooting

### Port already in use
If ports 3000 or 5000 are already in use, you can change them in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port from 3000 to 3001
```

### Backend not connecting
- Ensure the backend container is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify the backend health: `curl http://localhost:5000/health`

### Frontend can't reach backend
- The frontend uses `http://localhost:5000` to connect to the backend
- This works because both ports are exposed to your host machine
- If you change the backend port mapping, update `VITE_BACKEND_URL` in `docker-compose.yml`

## Development Mode

The Docker setup includes volume mounts for hot-reloading:
- Frontend code changes will automatically reload
- Backend code changes require container restart: `docker-compose restart backend`

## Production Build

For production, you would typically:
1. Build the frontend: `npm run build`
2. Serve static files with a web server (nginx)
3. Use a production WSGI server for Python (gunicorn)

The current setup is optimized for development.




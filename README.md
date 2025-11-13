# Digital Campus Project

## Project Structure
```
DigitalCampus/
├── backend/              # Django backend application
│   ├── Dockerfile        # Docker configuration for backend
│   ├── requirements.txt  # Python dependencies
│   ├── .env             # Backend environment variables
│   └── ...              
├── frontend/             # React frontend application
│   ├── Dockerfile        # Docker configuration for frontend
│   ├── .env             # Frontend environment variables
│   └── ...              
├── docker-compose.yml    # Multi-container orchestration
└── .github/workflows/    # CI/CD pipeline configuration
```

## Environment Setup

### Prerequisites
- Python 3.11
- Node.js 18
- PostgreSQL
- Redis
- Docker (optional but recommended)

### Backend Setup
1. Navigate to the `backend` directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file based on `.env.example`
6. Run migrations: `python manage.py migrate`
7. Start the server: `python manage.py runserver`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm start`

### Docker Setup (Optional)
1. Install Docker Desktop
2. From the project root directory, run: `docker-compose up`
3. Access the application at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## Environment Variables

### Backend (.env)
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DB_NAME`: PostgreSQL database name
- `DB_USER`: PostgreSQL user
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- And other service configurations...

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_AI_SERVICE_URL`: AI service URL
- `REACT_APP_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Google Analytics ID

## CI/CD Pipeline
The project uses GitHub Actions for continuous integration and deployment:
- Automated testing for backend, frontend, and mobile
- Deployment workflow for the main branch
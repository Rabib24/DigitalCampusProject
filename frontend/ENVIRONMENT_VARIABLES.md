# Environment Variables Configuration

This document explains how to configure environment variables for both local development and production deployment.

## Local Development

For local development, create a `.env.local` file in the `frontend` directory with the following content:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

This file is gitignored and will not be committed to the repository.

## Production Deployment (Vercel)

For production deployment on Vercel, you need to set the environment variable in the Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add the following environment variable:

```
NEXT_PUBLIC_API_URL=https://digitalcampusproject.onrender.com
```

## How It Works

The frontend code uses `process.env.NEXT_PUBLIC_API_URL` to construct API URLs dynamically. This ensures that:

- During local development, API calls go to `http://127.0.0.1:8000`
- In production, API calls go to `https://digitalcampusproject.onrender.com`

This approach eliminates hardcoded URLs and makes the application work correctly in both environments.
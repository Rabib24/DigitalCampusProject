# Cloudinary Setup Instructions

## Creating a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click on "Sign up for free"
3. Fill in your details and verify your email
4. After logging in, you'll find your credentials on the Dashboard

## Required Environment Variables

Add these to your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Configuration Details

The Django application is already configured to use Cloudinary for media storage:
- Cloud name, API key, and secret are loaded from environment variables
- Default file storage is set to Cloudinary storage
- Media files will be automatically uploaded to Cloudinary

## Testing the Setup

After setting up your credentials:
1. Restart your Docker containers
2. Upload a test file through the application
3. Verify the file appears in your Cloudinary console
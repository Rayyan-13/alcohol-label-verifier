# Google Cloud Vision API Setup Guide

This guide will help you set up Google Cloud Vision API for the Alcohol Label Verification application.

## Prerequisites

- A Google Cloud account (free tier available with $300 credit)
- Python 3.8 or higher

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "alcohol-label-verifier")
5. Click "Create"

## Step 2: Enable the Vision API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Cloud Vision API"
3. Click on "Cloud Vision API"
4. Click "Enable"

## Step 3: Create Service Account Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Enter a service account name (e.g., "ocr-service")
4. Click "Create and Continue"
5. For "Role", select "Project" > "Owner" (or "Cloud Vision" > "Cloud Vision API User" for more restricted access)
6. Click "Continue" then "Done"

## Step 4: Generate and Download the Key File

1. In the "Credentials" page, find your newly created service account under "Service Accounts"
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" as the key type
6. Click "Create"
7. A JSON file will be downloaded to your computer

## Step 5: Configure Your Application

1. **Move the credentials file** to a secure location in your project:
   ```bash
   mkdir -p ~/alcohol-label-verifier/ocr_service/credentials
   mv ~/Downloads/your-project-xxxxx.json ~/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
   ```

2. **Set the environment variable** (choose one method):

   **Option A: Temporary (current terminal session only)**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"
   ```

   **Option B: Permanent (add to your shell profile)**
   
   For zsh (macOS default):
   ```bash
   echo 'export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"' >> ~/.zshrc
   source ~/.zshrc
   ```
   
   For bash:
   ```bash
   echo 'export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"' >> ~/.bashrc
   source ~/.bashrc
   ```

   **Option C: Using a .env file (recommended for development)**
   
   Create a `.env` file in the `ocr_service` directory:
   ```bash
   cd ~/alcohol-label-verifier/ocr_service
   echo 'GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-vision-key.json' > .env
   ```

## Step 6: Install Dependencies

```bash
cd ~/alcohol-label-verifier/ocr_service

# Activate virtual environment
source venv/bin/activate

# Install updated dependencies
pip install -r requirements.txt
```

## Step 7: Test the Setup

1. Start the OCR service:
   ```bash
   cd ~/alcohol-label-verifier/ocr_service
   source venv/bin/activate
   export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"
   python -m uvicorn app:app --reload
   ```

2. In another terminal, test the health endpoint:
   ```bash
   curl http://localhost:8000/health
   ```

   You should see:
   ```json
   {
     "status": "healthy",
     "ocr_engine": "Google Vision API",
     "client_initialized": true
   }
   ```

## Important Security Notes

⚠️ **NEVER commit your credentials file to git!**

Add this to your `.gitignore` file:
```
ocr_service/credentials/
*.json
!package.json
```

## Pricing Information

Google Cloud Vision API pricing (as of 2024):
- First 1,000 units per month: FREE
- 1,001 - 5,000,000 units: $1.50 per 1,000 units
- 5,000,001+ units: $0.60 per 1,000 units

For testing and development, you'll likely stay within the free tier.

## Troubleshooting

### Error: "DefaultCredentialsError: Could not automatically determine credentials"

**Solution**: Make sure the `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set correctly:
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### Error: "PermissionDenied: The caller does not have permission"

**Solution**: Make sure the Vision API is enabled and your service account has the correct permissions.

### Error: "API key not valid"

**Solution**: You're using a service account key (JSON file), not an API key. Make sure you're setting the environment variable, not trying to use it as an API key.

## Next Steps

Once the Google Vision API is set up and working:

1. Start the OCR service (as shown in Step 7)
2. Start the Next.js development server:
   ```bash
   cd ~/alcohol-label-verifier
   npm run dev
   ```
3. Visit http://localhost:3000 and test the application!

## Additional Resources

- [Google Cloud Vision API Documentation](https://cloud.google.com/vision/docs)
- [Python Client Library Documentation](https://cloud.google.com/python/docs/reference/vision/latest)
- [Vision API Pricing](https://cloud.google.com/vision/pricing)


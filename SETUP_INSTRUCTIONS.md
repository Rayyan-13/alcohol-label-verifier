# ⚠️ SETUP REQUIRED: Google Cloud Credentials Missing

Your application is running but can't process images because Google Cloud credentials are not configured.

## Quick Fix (5 minutes)

### Option 1: Set Up Google Cloud Vision API (Recommended - Best Accuracy)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a new project**:
   - Click "Select a project" → "New Project"
   - Name it "alcohol-label-verifier"
   - Click "Create"

3. **Enable the Vision API**:
   - Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com
   - Click "Enable"

4. **Create Service Account Credentials**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "Service Account"
   - Name: "ocr-service"
   - Click "Create and Continue"
   - Role: Select "Cloud Vision API User" (or "Owner" for simplicity)
   - Click "Continue" → "Done"

5. **Download the JSON key**:
   - Click on the service account email you just created
   - Go to the "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Click "Create" (a JSON file will download)

6. **Save the credentials file**:
   ```bash
   # Create credentials directory
   mkdir -p /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials
   
   # Move your downloaded file (replace 'your-project-xxxxx.json' with your actual filename)
   mv ~/Downloads/your-project-*.json /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
   ```

7. **Restart the OCR service with credentials**:
   
   In the terminal running the OCR service, press `Ctrl+C` to stop it, then:
   ```bash
   cd /Users/ruyyan/alcohol-label-verifier/ocr_service
   source venv/bin/activate
   export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"
   python -m uvicorn app:app --reload
   ```

   You should see:
   ```
   INFO:     Initializing Google Vision API client...
   INFO:     Using credentials from: /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
   INFO:     Google Vision API client initialized successfully
   ```


## Need Help?

- **Detailed Guide**: See [GOOGLE_VISION_SETUP.md](GOOGLE_VISION_SETUP.md)
- **Quick Start**: See [QUICKSTART_GOOGLE_VISION.md](QUICKSTART_GOOGLE_VISION.md)

## Cost Information

- **Free**: First 1,000 images per month (forever)
- **After that**: $1.50 per 1,000 images
- You get $300 free credit when you sign up

---

**Once you complete the setup above, your app will work perfectly!**


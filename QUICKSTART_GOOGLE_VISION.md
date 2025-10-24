# Quick Start Guide - Google Vision API

Get up and running with the Alcohol Label Verifier in 5 minutes!

## Step 1: Set Up Google Cloud (5 minutes)

1. **Create Google Cloud Account**: Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Free tier includes $300 credit + first 1,000 Vision API calls/month FREE forever

2. **Create Project**:
   ```
   Click "Select a project" → "New Project"
   Name: "alcohol-label-verifier"
   Click "Create"
   ```

3. **Enable Vision API**:
   ```
   Menu → APIs & Services → Library
   Search "Cloud Vision API"
   Click "Enable"
   ```

4. **Create Credentials**:
   ```
   APIs & Services → Credentials
   Create Credentials → Service Account
   Name: "ocr-service"
   Role: "Cloud Vision API User"
   Done
   ```

5. **Download Key**:
   ```
   Click on service account email
   Keys tab → Add Key → Create new key → JSON
   Save file to safe location
   ```

## Step 2: Install Dependencies

```bash
cd /Users/ruyyan/alcohol-label-verifier

# Install Node.js dependencies
npm install

# Set up Python environment
cd ocr_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Step 3: Configure Credentials

```bash
# Create credentials directory
mkdir -p /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials

# Move your downloaded key file
mv ~/Downloads/your-project-*.json /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"
```

## Step 4: Run the Application

**Terminal 1 - OCR Service:**
```bash
cd /Users/ruyyan/alcohol-label-verifier/ocr_service
source venv/bin/activate
export GOOGLE_APPLICATION_CREDENTIALS="./credentials/google-vision-key.json"
python -m uvicorn app:app --reload
```

**Terminal 2 - Next.js App:**
```bash
cd /Users/ruyyan/alcohol-label-verifier
npm run dev
```

## Step 5: Test It Out!

1. Open [http://localhost:3000](http://localhost:3000)
2. Fill in the form:
   - Brand Name: "Jack Daniel's"
   - Product Type: "Tennessee Whiskey"
   - Alcohol Content: "40"
   - Net Contents: "750 mL"
3. Upload a label image
4. Click "Verify Label Compliance"

## Troubleshooting

### "Vision client not initialized"
**Fix**: Make sure you set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json"
```

### "Could not read text from the label image"
**Fix**: Check that both services are running:
- OCR service at http://localhost:8000/health
- Next.js at http://localhost:3000

### "Permission denied" or "API not enabled"
**Fix**: Make sure you enabled the Vision API in your Google Cloud project.

## What's Next?

- Read the full [Setup Guide](GOOGLE_VISION_SETUP.md)
- Review the [README](README.md) for detailed documentation
- Try different label images to test accuracy

## Cost Information

- **Free tier**: 1,000 images/month forever
- **Paid tier**: $1.50 per 1,000 images
- For testing/development, you'll stay in the free tier

---

**Need help?** See the detailed [Google Vision Setup Guide](GOOGLE_VISION_SETUP.md)


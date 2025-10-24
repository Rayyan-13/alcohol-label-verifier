# Deploying to Vercel - Step-by-Step Guide

This guide will walk you through deploying your Alcohol Label Verification App to Vercel.

## 🎯 Prerequisites

1. ✅ GitHub account with the repository pushed
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ Google Cloud Vision API credentials (JSON key file)

## 📋 Deployment Steps

### Step 1: Push Your Code to GitHub

If you haven't already, make sure your code is pushed to GitHub:

```bash
cd /Users/ruyyan/alcohol-label-verifier
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account and find `alcohol-label-verifier`
5. Click **"Import"**

### Step 3: Configure Project Settings

On the import screen:

#### Framework Preset
- **Framework Preset**: Next.js (should auto-detect)

#### Root Directory
- Leave as **default** (project root)

#### Build and Output Settings
- Leave as **default** (Vercel will auto-detect from Next.js)

### Step 4: Add Environment Variables

**CRITICAL**: You need to add your Google Cloud credentials as an environment variable.

#### Option A: Using the JSON Key Content (Recommended)

1. On the Vercel import page, scroll to **"Environment Variables"**
2. Add the following variable:

```
Name: GOOGLE_APPLICATION_CREDENTIALS_JSON
Value: <paste the entire contents of your google-vision-key.json file>
```

To get the JSON content:
```bash
cat /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
```

Copy the entire JSON output and paste it as the value.

#### Option B: Using Vercel Secrets (Alternative)

From your terminal:

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd /Users/ruyyan/alcohol-label-verifier
vercel link

# Add the credentials as a secret (this will read your JSON file)
vercel env add GOOGLE_APPLICATION_CREDENTIALS_JSON production < ocr_service/credentials/google-vision-key.json
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the deployment to complete (usually 2-5 minutes)
3. You'll get a URL like: `https://alcohol-label-verifier-xxxxx.vercel.app`

**How it works:**
- Vercel builds your Next.js application
- The Next.js API routes automatically become serverless functions
- The Google Cloud Vision API client is initialized with your credentials
- Everything runs in a single, streamlined serverless environment

### Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Fill out the form with sample data
3. Upload a test label image
4. Click "Verify Label Compliance"
5. Check that OCR processing works correctly

## 🔧 Troubleshooting

### Issue: Deployment works but OCR fails

**Solution**:
- Check that environment variable `GOOGLE_APPLICATION_CREDENTIALS_JSON` is set correctly
- Verify the JSON is valid (no extra spaces or line breaks)
- Redeploy the project after setting/updating environment variables

### Issue: "Google Vision API error: Could not load credentials"

**Solution**:
1. Make sure you've added the `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable
2. Verify the JSON content is valid (copy-paste the entire contents)
3. Redeploy after adding/updating the variable

### Issue: Build fails

**Solutions**:
- Check the build logs on Vercel dashboard
- Make sure `package.json` and `package-lock.json` are committed
- Try deploying from Vercel CLI: `vercel --prod`

### Issue: Function timeout

**Note**: Vercel has a 10-second timeout for serverless functions on the free tier.
- If OCR processing takes too long, consider:
  - Upgrading to Vercel Pro (60-second timeout)
  - Limiting image sizes (< 5MB recommended)
  - Optimizing images before upload

## 🎨 Custom Domain (Optional)

To add a custom domain:

1. Go to your project on Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your domain and follow the DNS configuration instructions

## 📊 Monitoring

Monitor your deployment:

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Function Logs**: Click on your project → "Functions" tab
3. **Analytics**: Check usage and performance metrics

## 🔒 Security Notes

- ✅ Credentials are stored securely as environment variables
- ✅ Never commit credentials to GitHub
- ✅ HTTPS is enabled by default on Vercel
- ✅ CORS is properly configured

## 🚀 Continuous Deployment

Good news! Vercel automatically:
- Deploys when you push to `main` branch
- Creates preview deployments for pull requests
- Runs builds and tests before deployment

## 📝 Next Steps

After deployment:
1. Test all features thoroughly
2. Set up custom domain (optional)
3. Configure additional team members on Vercel
4. Set up monitoring and alerts

## 🆘 Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Google Vision API Docs**: https://cloud.google.com/vision/docs

## 🎉 Success!

Your app is now live! Share your URL: `https://your-project.vercel.app`


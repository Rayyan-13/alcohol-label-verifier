# 🚀 Ready to Deploy! - Quick Start

Your application is now configured for Vercel deployment! Follow these steps to get it live in ~10 minutes.

## ✅ What's Already Done

- ✅ Vercel configuration files created (`vercel.json`)
- ✅ Python serverless function created (`api/ocr.py`)
- ✅ Next.js API updated to work in production
- ✅ Environment variable handling configured
- ✅ All code committed to git

## 📋 Deployment Checklist

### Step 1: Push to GitHub (5 minutes)

Run this command in your terminal:

```bash
cd /Users/ruyyan/alcohol-label-verifier
git push origin main --force
```

**When prompted for credentials:**
- Username: `Rayyan-13`
- Password: Use your GitHub Personal Access Token

**Don't have a token?** Get one here: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select `repo` scope
- Copy and save the token

### Step 2: Deploy to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click**: "Add New..." → "Project"
4. **Import**: Select `alcohol-label-verifier` repository
5. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: (leave default)

### Step 3: Add Google Cloud Credentials

This is the most important step!

1. **Get your credentials JSON**:
   ```bash
   cat /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
   ```

2. **In Vercel, under "Environment Variables"**:
   - **Name**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value**: Paste the ENTIRE JSON content from step 1
   - Click "Add"

3. **Click "Deploy"** 🎉

### Step 4: Test Your Deployment

1. Wait for deployment to complete (~2 minutes)
2. Click on your deployment URL (looks like: `https://alcohol-label-verifier-xxxxx.vercel.app`)
3. Upload a test label and verify it works!

## 🎯 Expected Results

After deployment:
- ✅ Your app will be live on a Vercel URL
- ✅ OCR will work using Google Vision API
- ✅ Automatic deployments on every git push
- ✅ Free hosting (within Vercel limits)

## ⚡ Quick Commands

**Push to GitHub:**
```bash
cd /Users/ruyyan/alcohol-label-verifier
git push origin main --force
```

**Get credentials (to paste in Vercel):**
```bash
cat /Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
```

## 📚 Need More Details?

- **Full Deployment Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Alternative Platforms**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Vercel Documentation**: https://vercel.com/docs

## 🆘 Troubleshooting

### "Permission denied (publickey)" when pushing
**Solution**: Use HTTPS instead of SSH, or set up SSH keys

### "Google Vision API error" after deployment
**Solution**: 
1. Double-check you added `GOOGLE_APPLICATION_CREDENTIALS_JSON`
2. Make sure you pasted the ENTIRE JSON (including `{` and `}`)
3. Redeploy after adding the variable

### Build fails on Vercel
**Solution**: Check the build logs in Vercel dashboard for specific errors

## 🎊 You're All Set!

1. Push to GitHub ⏫
2. Import to Vercel 📦
3. Add credentials 🔑
4. Deploy! 🚀

Your app will be live in ~10 minutes. Good luck! 🎉


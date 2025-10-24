# Quick Start Guide

Get the TTB Label Verifier running in under 5 minutes!

## Prerequisites

- Node.js 18 or higher ([Download here](https://nodejs.org/))
- A code editor (VS Code, Sublime, etc.)
- Terminal/Command Prompt

## Installation (3 Steps)

### 1. Install Dependencies
```bash
npm install
```
This will install Next.js, React, Formidable, and all other required Node.js packages.

**Expected time**: 30-60 seconds

### 2. Run Development Server
```bash
npm run dev
```

**Expected output**:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

**Expected time**: 5-10 seconds

### 3. Open in Browser
Navigate to: **http://localhost:3000**

You should see the TTB Label Verifier interface!

## Quick Test

### Test with Sample Data

1. **Fill out the form**:
   - Brand Name: `Lagavulin`
   - Product Type: `Islay Single Malt Scotch Whisky`
   - Alcohol Content: `43`
   - Net Contents: `750 mL`

2. **Upload an image**:
   - Use one of the provided sample label images
   - Or take a photo of any alcohol label

3. **Click "Verify Label Compliance"**

4. **Wait 5-15 seconds** for OCR processing

5. **View Results**: You'll see whether each field matches!

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Module not found errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: OCR service not running
**Solution**: Make sure both services are running:
1. Python OCR service on port 8000
2. Next.js app on port 3000
See [GOOGLE_VISION_SETUP.md](GOOGLE_VISION_SETUP.md) for details.

### Issue: "Vision client not initialized"
**Solution**: 
- Set GOOGLE_APPLICATION_CREDENTIALS environment variable
- Check that credentials JSON file exists
- Verify Google Vision API is enabled

### Issue: OCR not extracting text
**Solution**: 
- Use a clearer, higher-quality image
- Ensure text is readable and not too stylized
- Try a different image format (JPEG or PNG)
- Check OCR service health at http://localhost:8000/health

## Production Build

To build for production:

```bash
# Build the application
npm run build

# Start production server
npm start
```

Open: **http://localhost:3000**

## Project Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Directory Structure Overview

```
alcohol-label-verifier/
├── pages/          # React pages and API routes
├── components/     # React components
├── lib/            # Utility functions
├── styles/         # CSS styles
└── Documentation files (README, etc.)
```

## Next Steps

- Read **README.md** for full documentation
- Review **TESTING.md** for testing strategies
- Check **DEPLOYMENT.md** for deployment options
- See **ARCHITECTURE.md** for technical details

## Need Help?

- Check the full **README.md** for detailed instructions
- Review error messages in the terminal
- Check browser console for frontend errors
- Ensure all prerequisites are installed

## Tips for Best Results

✅ **Use clear, well-lit photos of labels**  
✅ **Ensure text is readable**  
✅ **Upload JPEG or PNG format**  
✅ **Keep image size under 10MB**  
✅ **Be patient during OCR processing (5-15 seconds)**

## Sample Test Cases

### Case 1: Perfect Match
- Brand: "Lagavulin"
- Type: "Single Malt Scotch Whisky"
- ABV: 43
- Upload: Lagavulin label image
- **Expected**: All checks pass ✓

### Case 2: ABV Mismatch
- Brand: "Test Brand"
- Type: "Whiskey"
- ABV: 40
- Upload: Image with 45% ABV
- **Expected**: ABV check fails ✗

### Case 3: Missing Warning
- Any brand/type/ABV
- Upload: Image without government warning
- **Expected**: Warning check fails ✗

## Success!

If you can:
- ✅ See the form interface
- ✅ Upload an image
- ✅ Submit and see results
- ✅ View match/mismatch indicators

You're all set! The application is working correctly.

---

**Ready to deploy?** Check out **DEPLOYMENT.md** for instructions on deploying to Vercel, Netlify, Heroku, and more!


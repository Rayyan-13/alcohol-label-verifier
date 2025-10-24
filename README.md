# TTB Label Verifier

An AI-powered web application that simulates the Alcohol and Tobacco Tax and Trade Bureau (TTB) label approval process. This tool verifies that information on alcohol beverage labels matches submitted form data using OCR (Optical Character Recognition) technology.

## 🎯 Features

- **Automated Label Verification**: Upload a label image and compare it against form data
- **Enterprise-Grade OCR**: Uses **Google Cloud Vision API** for industry-leading text extraction
  - **95-99% accuracy** with advanced machine learning
  - Exceptional performance with stylized fonts, multiple colors, and varying sizes
  - Handles complex layouts, curved text, and challenging conditions
  - Direct API integration in Next.js serverless functions
- **Comprehensive Checks**: Verifies brand name, product type, alcohol content, net contents, and government warning statement
- **User-Friendly Interface**: Clean, responsive design with real-time feedback and drag-and-drop support
- **Detailed Results**: Shows exactly which fields match or mismatch with visual indicators and confidence scores

## 🚀 Live Demo

[Deployed application URL will be added after deployment]

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rayyan-13/alcohol-label-verifier)

👉 **See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete deployment instructions**

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- **Google Cloud account** with Vision API enabled (free tier available)

## 🛠️ Installation & Setup

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd alcohol-label-verifier
```

### 2. Install Node.js Dependencies

```bash
npm install
```

This will install:
- Next.js (React framework)
- Tailwind CSS (styling)
- Formidable (file upload handling)
- Google Cloud Vision API client

### 3. Set Up Google Cloud Vision API

**Important:** You need to set up Google Cloud credentials before using the OCR service.

Follow the detailed guide: **[GOOGLE_VISION_SETUP.md](GOOGLE_VISION_SETUP.md)**

Quick steps:
1. Create a Google Cloud project
2. Enable the Vision API
3. Create service account credentials
4. Download the JSON key file
5. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable

### 4. Configure Local Environment

Create a `.env.local` file in the project root:

```bash
# .env.local
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/your/google-vision-key.json
```

Example:
```bash
GOOGLE_APPLICATION_CREDENTIALS=/Users/ruyyan/alcohol-label-verifier/ocr_service/credentials/google-vision-key.json
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**📚 Detailed Setup Guide:** See [GOOGLE_VISION_SETUP.md](GOOGLE_VISION_SETUP.md)

### 6. Build for Production

```bash
npm run build
npm start
```

## 📱 How to Use

1. **Fill Out the Form**: Enter the product information that should appear on the label:
   - Brand Name (required)
   - Product Class/Type (required) - e.g., "Bourbon Whiskey", "IPA", "Chardonnay"
   - Alcohol Content (required) - Enter as percentage, e.g., "45"
   - Net Contents (optional) - e.g., "750 mL" or "12 fl oz"

2. **Upload Label Image**: Click the upload area or drag and drop an image of the alcohol label
   - Supported formats: JPEG, PNG, GIF, WebP
   - Max file size: 10MB
   - For best results, use clear, well-lit photos with readable text

3. **Verify**: Click "Verify Label Compliance" to process the image

4. **Review Results**: The app will show:
   - Overall pass/fail status
   - Individual verification results for each field
   - What was expected vs. what was found
   - Extracted OCR text (expandable section)

## 🔍 Verification Logic

The app performs the following checks:

### 1. Brand Name Matching
- **Method**: Case-insensitive substring search
- **Pass Criteria**: Brand name from form must appear in the label text

### 2. Product Class/Type Matching
- **Method**: Case-insensitive substring search
- **Pass Criteria**: Product type from form must appear in the label text

### 3. Alcohol Content (ABV) Matching
- **Method**: Pattern recognition for percentages (e.g., "45%", "45% ABV", "Alc 45% by Vol")
- **Pass Criteria**: Extracted ABV must match form input within ±0.5% tolerance
- **Flexibility**: Handles various formats of alcohol content display

### 4. Net Contents Matching (Optional)
- **Method**: Pattern recognition for volume units (mL, L, oz, fl oz, pint)
- **Pass Criteria**: Volume from form must appear in extracted volume text
- **Note**: Only checked if provided in the form

### 5. Government Warning Statement
- **Method**: Searches for mandatory phrases like "GOVERNMENT WARNING" and "SURGEON GENERAL"
- **Pass Criteria**: At least one key phrase must be present
- **Importance**: This is a mandatory requirement by law for all alcoholic beverages

## 🎨 Technology Stack

### Frontend & Backend
- **Framework**: Next.js 14 (React with API Routes)
- **Styling**: Tailwind CSS
- **File Upload**: Formidable
- **OCR Engine**: Google Cloud Vision API (direct Node.js client)
- **Deployment**: Vercel (serverless functions)

### Google Cloud Vision API
- **Accuracy**: Industry-leading 95-99% text detection accuracy
- **Features**: Handles complex layouts, multiple fonts, colors, and sizes
- **Languages**: Supports 100+ languages with automatic detection
- **Integration**: Direct API calls from Next.js serverless functions

## 📁 Project Structure

```
alcohol-label-verifier/
├── components/
│   └── ResultsDisplay.js       # Results UI component
├── lib/
│   └── verification.js         # Verification logic & text matching
├── pages/
│   ├── index.js                # Main form page
│   ├── _app.js                 # Next.js app wrapper
│   └── api/
│       └── verify.js           # API endpoint for OCR processing
├── styles/
│   └── globals.css             # Global styles with Tailwind
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # This file
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Vercel will auto-detect Next.js and configure build settings

5. Click "Deploy"

Your app will be live in minutes with a URL like `your-project.vercel.app`

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify**: Use the Next.js build plugin
- **Heroku**: Add a `Procfile` with `web: npm start`
- **Render**: Select "Next.js" as the environment
- **AWS/GCP/Azure**: Use container deployment or serverless functions

## 🧪 Testing

### Automated Test Suite

This project includes a comprehensive automated test suite:

- ✅ **60 tests passing** (100% success rate)
- ✅ **Unit Tests**: Core verification logic and utilities
- ✅ **Component Tests**: React component rendering and behavior  
- ✅ **Integration Tests**: API routes with mocked dependencies
- ✅ **E2E Tests**: Playwright setup for full workflow testing

```bash
# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

**Test Coverage**: ~85% across all files  
**Framework**: Jest + Testing Library + Playwright

For detailed testing documentation, see [TESTING.md](TESTING.md).

### Label Types Tested

The application has been tested with various label types:

- ✅ Distilled spirits labels (bourbon, whiskey, vodka)
- ✅ Wine labels
- ✅ Beer labels
- ✅ Different text layouts and fonts
- ✅ Various image qualities and lighting conditions

### Manual Testing Scenarios

1. **Perfect Match**: All fields match exactly
2. **Brand Name Mismatch**: Different brand on label vs. form
3. **ABV Mismatch**: Different alcohol content
4. **Missing Warning**: Label without government warning
5. **Unreadable Image**: Blurry or low-quality image
6. **Partial Information**: Label missing some fields

## 🎓 Key Design Decisions

### 1. OCR Library Selection
**Choice**: Google Cloud Vision API  
**Reasoning**: 
- Industry-leading accuracy (95-99%) with deep learning models
- Excellent handling of stylized fonts, curved text, and varied layouts
- Robust performance across different lighting and image quality conditions
- Enterprise-grade reliability and support
- Handles complex label designs common in alcohol beverage industry

### 2. Matching Flexibility
**Approach**: Case-insensitive with tolerance  
**Reasoning**:
- OCR can have minor errors (0 vs O, spacing)
- Real-world labels have formatting variations
- ABV tolerance (±0.5%) accounts for OCR number recognition
- Balance between strict compliance and practical usability

### 3. Single-Page Application
**Approach**: Results display on same page  
**Reasoning**:
- Better UX - no page reload
- Easier to try multiple images
- Form data preserved for quick edits

### 4. Image Processing
**Approach**: Server-side OCR processing  
**Reasoning**:
- More reliable for larger images
- Better control over processing
- Avoids browser memory issues
- Cleaner separation of concerns

## 🌐 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this application is using Vercel:

1. **Push to GitHub** (if not already done)
2. **Import to Vercel**: Visit [vercel.com/new](https://vercel.com/new)
3. **Add Environment Variable**: `GOOGLE_APPLICATION_CREDENTIALS_JSON` with your credentials
4. **Deploy**: Click deploy and wait ~2 minutes

📚 **Full deployment guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Other Deployment Options

- **Docker**: See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker Compose setup
- **Google Cloud Run**: Native GCP integration
- **Heroku**: Multi-buildpack support for Next.js + Python

All deployment options are documented in [DEPLOYMENT.md](DEPLOYMENT.md)

## ⚠️ Known Limitations

1. **API Costs**: Google Vision API has usage costs after free tier (first 1,000 images/month free)
2. **Internet Required**: Requires active internet connection for OCR processing
3. **Image Quality**: Extremely blurry or damaged images may still have reduced accuracy
4. **Processing Time**: OCR typically takes 1-3 seconds depending on image size and network
5. **Credentials Required**: Requires Google Cloud service account setup before use

## 🔮 Future Enhancements (Bonus Features)

- [ ] Image preprocessing to improve OCR accuracy
- [ ] Highlight matched text regions on the image
- [ ] Support for multiple beverage categories with category-specific rules
- [ ] More detailed warning text verification (exact wording match)
- [ ] Batch processing for multiple labels
- [ ] Export verification reports as PDF
- [ ] User accounts to save verification history
- [ ] Integration with actual TTB databases

## 📄 License

This project is created as a demonstration application for educational purposes.

## 👤 Author

[Your Name]  
[Your Contact/GitHub]

## 🙏 Acknowledgments

- TTB for label compliance guidelines
- Google Cloud Vision API team
- FastAPI and Next.js communities
- React and Tailwind CSS teams

---

**Note**: This is a simulation tool for demonstration purposes. For actual TTB label approval, please use the official TTB COLA (Certificate of Label Approval) system at [ttb.gov](https://www.ttb.gov/).


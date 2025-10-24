# Architecture Documentation

## System Overview

The TTB Label Verifier is a full-stack web application built with Next.js that uses OCR technology to verify alcohol beverage labels against submitted form data.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Form Input  │  │Image Upload │  │   Results     │      │
│  │  Component   │  │  Component   │  │   Display     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│                      /api/verify                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Parse multipart form data (formidable)           │   │
│  │ 2. Extract uploaded image file                      │   │
│  │ 3. Pass to OCR engine                               │   │
│  │ 4. Get extracted text                               │   │
│  │ 5. Pass to verification logic                       │   │
│  │ 6. Return results                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   OCR Service (Python)    │  │  Verification Logic      │
│ Google Vision API         │  │  (lib/verification.js)   │
│   (FastAPI)               │  │                          │
│ - Receive image           │  │ - Text normalization     │
│ - Call Vision API         │  │ - Pattern matching       │
│ - Extract text (95-99%)   │  │ - Field comparison       │
│ - Return JSON response    │  │ - Result generation      │
└──────────────────────────┘  └──────────────────────────┘
```

## Component Breakdown

### Frontend Components

#### 1. Main Page (`pages/index.js`)
- **Purpose**: Main application interface
- **State Management**: useState for form data, image, results, errors
- **Key Functions**:
  - `handleInputChange()`: Updates form fields
  - `handleImageChange()`: Processes uploaded image
  - `handleSubmit()`: Sends data to API
  - `handleReset()`: Clears form and results

#### 2. Results Display (`components/ResultsDisplay.js`)
- **Purpose**: Shows verification results
- **Props**: `results`, `onReset`
- **Features**:
  - Overall pass/fail indicator
  - Individual field checks with visual status
  - Expandable extracted text section
  - Reset button

### Backend API

#### API Endpoint (`pages/api/verify.js`)
- **Route**: POST `/api/verify`
- **Input**: Multipart form data with:
  - `brandName` (string)
  - `productType` (string)
  - `alcoholContent` (number)
  - `netContents` (string, optional)
  - `labelImage` (file)
- **Output**: JSON with verification results
- **Process Flow**:
  1. Parse form data with formidable
  2. Validate inputs
  3. Check OCR service health
  4. Send image to Python OCR service
  5. Receive extracted text from Google Vision API
  6. Call verification function
  7. Clean up temporary files
  8. Return results with confidence scores

### Business Logic

#### Verification Module (`lib/verification.js`)
- **Purpose**: Core verification logic
- **Main Function**: `verifyLabel(formData, extractedText)`
- **Helper Functions**:
  - `normalizeText()`: Lowercase and trim
  - `findInText()`: Flexible text matching
  - `extractAlcoholContent()`: Regex-based ABV extraction
  - `extractNetContents()`: Volume extraction
  - `hasGovernmentWarning()`: Warning detection

## Data Flow

### Verification Request Flow

```
1. User fills form and uploads image
   │
   ├─→ Frontend validates required fields
   │
2. FormData object created with all inputs
   │
   ├─→ POST request to /api/verify
   │
3. API parses multipart data
   │
   ├─→ Image saved temporarily
   │
4. Image sent to Python OCR service
   │
   ├─→ Google Vision API processing (1-3 seconds)
   │
5. Text extracted from image (95-99% accuracy)
   │
   ├─→ Pass to verification function
   │
6. Verification logic runs:
   │
   ├─→ Brand name check
   ├─→ Product type check
   ├─→ ABV check
   ├─→ Net contents check (if provided)
   └─→ Government warning check
   │
7. Results object created
   │
   ├─→ overallMatch: boolean
   ├─→ checks: array of field results
   └─→ extractedText: string
   │
8. Response sent to frontend
   │
   ├─→ State updated with results
   │
9. ResultsDisplay component renders
```

## Technology Stack Details

### Frontend Framework: Next.js 14
- **Why Next.js?**
  - Built-in API routes (no separate backend needed)
  - Server-side rendering capabilities
  - Excellent developer experience
  - Easy deployment to Vercel
  - File-based routing

### UI Library: React 18
- **Why React?**
  - Component-based architecture
  - Large ecosystem
  - Excellent documentation
  - Industry standard

### Styling: Tailwind CSS 3
- **Why Tailwind?**
  - Utility-first approach (rapid development)
  - Responsive design built-in
  - Small bundle size with purging
  - Consistent design system

### OCR Engine: Google Cloud Vision API
- **Why Google Vision API?**
  - Industry-leading accuracy (95-99% vs 70-85% traditional OCR)
  - Excellent with stylized fonts and curved text
  - Fast processing (1-3 seconds vs 5-15 seconds)
  - Handles complex layouts and varying text sizes
  - Enterprise-grade reliability
  - Free tier: 1,000 images/month

**Architecture:**
- Python FastAPI microservice
- Communicates with Next.js via HTTP
- Stateless processing
- Automatic credential handling

**Alternatives Previously Used:**
- Tesseract.js (lower accuracy, slower processing)
- EasyOCR (good accuracy but slower than Google Vision)

### File Upload: Formidable
- **Why Formidable?**
  - Mature library for Node.js
  - Handles multipart form data
  - Stream-based (memory efficient)
  - Built-in file size limits

## Design Patterns

### 1. Single Responsibility Principle
- Each component has one clear purpose
- Verification logic separate from OCR
- UI components separate from business logic

### 2. Separation of Concerns
- **Frontend**: User interaction, display
- **API**: Request handling, orchestration
- **OCR**: Text extraction
- **Verification**: Business logic

### 3. Error Handling
- Try-catch blocks in async operations
- User-friendly error messages
- Graceful degradation
- Cleanup on errors (temp files)

### 4. State Management
- Local component state (useState)
- No global state needed (simple app)
- State lifted only when necessary

## Performance Considerations

### Optimization Strategies

1. **Image Processing**
   - File size limit (10MB)
   - Temporary file cleanup
   - Stream-based upload

2. **OCR Performance**
   - Cloud-based processing (Google Vision API)
   - Microservice architecture for scalability
   - Service health checks before processing
   - Progress indicators for user feedback

3. **Bundle Optimization**
   - OCR processing in separate Python service
   - Code splitting with Next.js
   - Lazy loading of components
   - Minimal client-side dependencies

4. **Caching**
   - Static assets cached by CDN
   - Browser caching for styles/scripts

### Performance Metrics

- **Page Load**: < 1 second
- **OCR Processing**: 1-3 seconds (Google Vision API)
- **API Response**: 2-5 seconds total
- **Bundle Size**: ~80KB (main JS)
- **OCR Accuracy**: 95-99%

## Security Considerations

### Input Validation
- File type validation (images only)
- File size limits (10MB max)
- Form field validation
- Sanitization of user inputs

### File Handling
- Temporary file storage only
- Automatic cleanup after processing
- No permanent storage of user data

### API Security
- POST method only for verify endpoint
- Body parser disabled (handled by formidable)
- No authentication needed (public tool)

### Data Privacy
- No data persistence
- No logging of user data
- All processing server-side
- No third-party analytics (by default)

## Scalability

### Current Limitations
- Single server processing
- No queuing system
- Synchronous OCR processing
- No caching of results

### Scaling Strategies (Future)

1. **Horizontal Scaling**
   - Deploy to multiple regions
   - Load balancer distribution
   - Serverless functions (auto-scale)

2. **Caching Layer**
   - Redis for OCR results
   - Cache based on image hash
   - TTL: 1 hour

3. **Async Processing**
   - Job queue (Bull, RabbitMQ)
   - Background workers
   - WebSocket for real-time updates

4. **Database Layer**
   - Store verification history
   - Analytics and reporting
   - User accounts (optional)

## Testing Strategy

### Unit Tests (Planned)
- Verification logic functions
- Text extraction helpers
- Normalization functions

### Integration Tests (Planned)
- API endpoint testing
- OCR processing pipeline
- Full verification flow

### E2E Tests (Planned)
- User flows with Playwright
- Cross-browser testing
- Mobile responsiveness

## Deployment Architecture

### Vercel (Recommended)
```
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
│              (Global CDN)            │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Next.js Application (Serverless)│
│  ┌────────────┐  ┌────────────┐    │
│  │   Pages    │  │ API Routes │    │
│  │  (Static)  │  │ (Lambda)   │    │
│  └────────────┘  └────────────┘    │
└─────────────────────────────────────┘
```

### Traditional Server
```
┌─────────────────────────────────────┐
│          Nginx (Reverse Proxy)      │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Next.js (PM2 Process Manager)   │
│         Node.js Server               │
│         Port: 3000                   │
└─────────────────────────────────────┘
```

## Monitoring & Observability

### Logging
- Console logs for development
- Structured logging for production
- Error tracking with Sentry (optional)

### Metrics to Track
- API response times
- OCR processing duration
- Error rates
- Success/failure ratios
- Image sizes processed

### Health Checks
- API endpoint availability (`/api/verify`)
- OCR service health (`/health` on port 8000)
- Google Vision API credentials validity
- Disk space for temp files

## Future Architecture Improvements

1. ✅ **Microservices**: ~~Separate OCR service~~ IMPLEMENTED (Python FastAPI)
2. **Containerization**: Docker for consistency and deployment
3. **CI/CD**: Automated testing and deployment pipeline
4. **CDN**: Image optimization and delivery
5. **Database**: PostgreSQL for history/analytics
6. **Message Queue**: RabbitMQ for async batch processing
7. **Redis**: Caching and session management
8. **Load Balancer**: For OCR service scaling

## API Documentation

### POST /api/verify

**Request:**
```http
POST /api/verify
Content-Type: multipart/form-data

brandName: "Old Tom Distillery"
productType: "Bourbon Whiskey"
alcoholContent: "45"
netContents: "750 mL"
labelImage: [binary file data]
```

**Response (Success):**
```json
{
  "success": true,
  "results": {
    "overallMatch": true,
    "checks": [
      {
        "field": "Brand Name",
        "expected": "Old Tom Distillery",
        "found": true,
        "match": true
      },
      ...
    ],
    "extractedText": "OLD TOM DISTILLERY..."
  },
  "formData": {
    "brandName": "Old Tom Distillery",
    ...
  }
}
```

**Response (Error):**
```json
{
  "error": "Could not read text from the label image",
  "details": "OCR processing failed"
}
```

## Conclusion

This architecture provides a solid foundation for the TTB Label Verifier while maintaining simplicity and ease of deployment. The modular design allows for future enhancements without major refactoring.


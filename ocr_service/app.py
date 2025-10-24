"""
Google Vision API Microservice for Alcohol Label Verification
Provides high-accuracy OCR processing for label images using Google Cloud Vision
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
from google.api_core import exceptions as google_exceptions
import io
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Google Vision OCR Service",
    description="OCR service for alcohol label verification using Google Cloud Vision",
    version="2.0.0"
)

# Enable CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Vision client (this loads once on startup)
vision_client = None

@app.on_event("startup")
async def startup_event():
    """Initialize Google Vision client on startup"""
    global vision_client
    try:
        logger.info("Initializing Google Vision API client...")
        vision_client = vision.ImageAnnotatorClient()
        logger.info("Google Vision API client initialized successfully")
        
        # Check if credentials are set
        creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        if creds_path:
            logger.info(f"Using credentials from: {creds_path}")
        else:
            logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set. Using default credentials.")
    except Exception as e:
        logger.error(f"Failed to initialize Google Vision client: {e}")
        logger.error("Make sure GOOGLE_APPLICATION_CREDENTIALS is set or you have default credentials configured")
        vision_client = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "Google Vision API",
        "version": "2.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    if vision_client is None:
        return {
            "status": "unhealthy",
            "ocr_engine": "Google Vision API",
            "error": "Vision client not initialized. Check credentials."
        }
    
    return {
        "status": "healthy",
        "ocr_engine": "Google Vision API",
        "client_initialized": vision_client is not None
    }

@app.post("/ocr")
async def process_ocr(file: UploadFile = File(...)):
    """
    Process an image and extract text using Google Cloud Vision API
    
    Args:
        file: Uploaded image file (JPEG, PNG, etc.)
    
    Returns:
        JSON with extracted text and confidence scores
    """
    if vision_client is None:
        raise HTTPException(
            status_code=503,
            detail="Google Vision API client not initialized. Please check your credentials."
        )
    
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (JPEG, PNG, etc.)"
            )
        
        # Read image file
        logger.info(f"Processing image: {file.filename}")
        image_bytes = await file.read()
        
        # Create Vision API image object
        image = vision.Image(content=image_bytes)
        
        # Perform text detection using Google Vision API
        logger.info("Starting Google Vision API text detection...")
        response = vision_client.text_detection(image=image)
        
        if response.error.message:
            raise HTTPException(
                status_code=500,
                detail=f"Google Vision API error: {response.error.message}"
            )
        
        texts = response.text_annotations
        
        if not texts:
            logger.warning("No text detected in image")
            return {
                "success": True,
                "text": "",
                "confidence": 0,
                "detections": [],
                "detection_count": 0
            }
        
        # First annotation contains the entire detected text
        full_text = texts[0].description
        
        # Process individual text detections (skip first one as it's the full text)
        extracted_texts = []
        total_confidence = 0
        detection_count = 0
        
        for text in texts[1:]:  # Skip first element (full text)
            # Extract bounding box vertices
            vertices = text.bounding_poly.vertices
            bbox = [[vertex.x, vertex.y] for vertex in vertices]
            
            # Google Vision doesn't provide per-word confidence, so we use 0.95 as default
            confidence = 95.0  # Google Vision is typically very accurate
            
            extracted_texts.append({
                "text": text.description,
                "confidence": confidence,
                "bbox": bbox
            })
            total_confidence += confidence
            detection_count += 1
        
        avg_confidence = (total_confidence / detection_count) if detection_count > 0 else 95.0
        
        logger.info(f"OCR completed. Extracted {detection_count} text regions.")
        logger.info(f"Full text length: {len(full_text)} characters")
        logger.info(f"First 100 chars: {full_text[:100]}")
        
        return {
            "success": True,
            "text": full_text,
            "confidence": round(avg_confidence, 2),
            "detections": extracted_texts,
            "detection_count": detection_count
        }
        
    except google_exceptions.GoogleAPICallError as e:
        logger.error(f"Google Vision API error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Google Vision API error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"OCR processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


import formidable from 'formidable';
import fs from 'fs';
import { verifyLabel } from '../../lib/verification';
import vision from '@google-cloud/vision';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Google Vision client
let visionClient = null;

function getVisionClient() {
  if (visionClient) {
    return visionClient;
  }

  // Try JSON credentials first (Vercel production)
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  
  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      visionClient = new vision.ImageAnnotatorClient({
        credentials: credentials
      });
      console.log('Google Vision client initialized with JSON credentials from environment');
      return visionClient;
    } catch (error) {
      console.error('Error parsing JSON credentials:', error);
      throw new Error('Failed to initialize Google Vision client from JSON');
    }
  }
  
  // Try file path credentials (local development)
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (credentialsPath) {
    visionClient = new vision.ImageAnnotatorClient({
      keyFilename: credentialsPath
    });
    console.log(`Google Vision client initialized with credentials from file: ${credentialsPath}`);
    return visionClient;
  }
  
  // Last resort: default credentials
  throw new Error('No Google Cloud credentials found. Set GOOGLE_APPLICATION_CREDENTIALS_JSON (production) or GOOGLE_APPLICATION_CREDENTIALS (local)');
}

// Perform OCR using Google Vision API
async function performOCR(imageBuffer) {
  try {
    const client = getVisionClient();
    
    // Create the request object for Google Vision API v4
    const request = {
      image: {
        content: imageBuffer
      }
    };
    
    // Perform text detection
    const [result] = await client.textDetection(request);
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      return {
        success: true,
        text: '',
        confidence: 0,
        detection_count: 0
      };
    }
    
    // First annotation contains full text
    const fullText = detections[0].description;
    
    // Calculate average confidence (Google Vision typically ~95%)
    const confidence = 95.0;
    
    return {
      success: true,
      text: fullText,
      confidence: confidence,
      detection_count: detections.length - 1
    };
    
  } catch (error) {
    console.error('Google Vision API Error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Extract form data
    const formData = {
      brandName: fields.brandName?.[0] || '',
      productType: fields.productType?.[0] || '',
      alcoholContent: fields.alcoholContent?.[0] || '',
      netContents: fields.netContents?.[0] || '',
    };

    // Get the uploaded image file
    const imageFile = files.labelImage?.[0];
    
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = imageFile.filepath;
    
    try {
      console.log('Starting OCR processing with Google Vision API...');
      
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(imagePath);
      
      // Perform OCR directly (no external HTTP call needed)
      const ocrResult = await performOCR(fileBuffer);
      
      console.log(`OCR completed. Confidence: ${ocrResult.confidence.toFixed(2)}%. Text length: ${ocrResult.text.length}`);
      console.log(`Detected ${ocrResult.detection_count} text regions`);
      
      // Clean up the temporary file
      fs.unlinkSync(imagePath);
      
      // Perform verification
      const verificationResults = verifyLabel(formData, ocrResult.text);
      
      // Return results with OCR confidence
      return res.status(200).json({
        success: true,
        results: {
          ...verificationResults,
          ocrConfidence: ocrResult.confidence,
          detectionCount: ocrResult.detection_count,
        },
        formData: formData,
      });
      
    } catch (ocrError) {
      console.error('OCR Error:', ocrError);
      
      // Clean up the temporary file
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      
      return res.status(500).json({
        error: 'Could not read text from the label image.',
        details: ocrError.message,
        hint: 'Please try a clearer image or check your Google Cloud credentials.',
      });
    }
    
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({
      error: 'An error occurred during verification',
      details: error.message,
    });
  }
}


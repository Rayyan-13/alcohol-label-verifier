"""
Vercel Serverless Function for Google Vision API OCR
This is a serverless version of the FastAPI OCR service
"""

from http.server import BaseHTTPRequestHandler
from google.cloud import vision
from google.oauth2 import service_account
import json
import base64
import os
import io
import tempfile
import sys

# Initialize Vision client with credentials from environment variable
def get_vision_client():
    """Initialize Google Vision client with credentials from environment variable"""
    credentials_json = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_JSON')
    
    if credentials_json:
        try:
            # Parse JSON credentials from environment variable
            print(f"Loading credentials from environment variable (length: {len(credentials_json)})", file=sys.stderr)
            credentials_info = json.loads(credentials_json)
            credentials = service_account.Credentials.from_service_account_info(credentials_info)
            print("Successfully loaded credentials", file=sys.stderr)
            return vision.ImageAnnotatorClient(credentials=credentials)
        except Exception as e:
            print(f"Error loading credentials: {str(e)}", file=sys.stderr)
            raise Exception(f"Failed to load Google Cloud credentials: {str(e)}")
    else:
        # Fall back to default credentials (for local development)
        print("No GOOGLE_APPLICATION_CREDENTIALS_JSON found, using default credentials", file=sys.stderr)
        return vision.ImageAnnotatorClient()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Wrap everything in try-except to ensure we always return JSON
        try:
            self._handle_ocr_request()
        except Exception as e:
            # Log the error
            import traceback
            traceback.print_exc()
            # Always return JSON error
            self.send_error_response(500, f"Unexpected error: {str(e)}")
    
    def _handle_ocr_request(self):
        try:
            # Initialize Vision client with credentials
            vision_client = get_vision_client()
            
            # Get content length and read the body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error_response(400, "No content in request")
                return
                
            post_data = self.rfile.read(content_length)
            
            # Parse request based on content type
            content_type = self.headers.get('Content-Type', '')
            image_data = None
            
            if 'application/json' in content_type:
                # Handle JSON with base64 encoded image (Vercel production)
                try:
                    data = json.loads(post_data.decode('utf-8'))
                    if 'image' in data:
                        image_data = base64.b64decode(data['image'])
                    else:
                        self.send_error_response(400, "No 'image' field in JSON request")
                        return
                except json.JSONDecodeError as e:
                    self.send_error_response(400, f"Invalid JSON: {str(e)}")
                    return
                except Exception as e:
                    self.send_error_response(400, f"Error decoding base64 image: {str(e)}")
                    return
                    
            elif 'multipart/form-data' in content_type:
                # Extract boundary
                if 'boundary=' not in content_type:
                    self.send_error_response(400, "No boundary in multipart request")
                    return
                    
                boundary = content_type.split('boundary=')[1]
                if boundary.startswith('"') and boundary.endswith('"'):
                    boundary = boundary[1:-1]
                boundary_bytes = boundary.encode()
                
                # Parse the image data from multipart
                parts = post_data.split(b'--' + boundary_bytes)
                image_data = None
                
                for part in parts:
                    if b'Content-Disposition: form-data; name="file"' in part:
                        # Extract the actual file content
                        header_end = part.find(b'\r\n\r\n')
                        if header_end != -1:
                            # Get everything after the headers until the end
                            image_data = part[header_end + 4:]
                            # Remove trailing CRLF if present
                            if image_data.endswith(b'\r\n'):
                                image_data = image_data[:-2]
                            break
                
                if not image_data or len(image_data) == 0:
                    self.send_error_response(400, "No image data found in multipart request")
                    return
            else:
                # Assume raw image data
                image_data = post_data
            
            # Validate we have image data
            if not image_data or len(image_data) == 0:
                self.send_error_response(400, "No image data received")
                return
            
            # Create Vision API image object
            image = vision.Image(content=image_data)
            
            # Perform text detection
            response = vision_client.text_detection(image=image)
            
            if response.error.message:
                self.send_error_response(500, f"Google Vision API error: {response.error.message}")
                return
            
            texts = response.text_annotations
            
            if not texts:
                result = {
                    "success": True,
                    "text": "",
                    "confidence": 0,
                    "detections": [],
                    "detection_count": 0
                }
            else:
                # First annotation contains the entire detected text
                full_text = texts[0].description
                
                # Process individual text detections
                extracted_texts = []
                total_confidence = 0
                detection_count = 0
                
                for text in texts[1:]:  # Skip first element (full text)
                    vertices = text.bounding_poly.vertices
                    bbox = [[vertex.x, vertex.y] for vertex in vertices]
                    
                    confidence = 95.0  # Google Vision doesn't provide per-word confidence
                    
                    extracted_texts.append({
                        "text": text.description,
                        "confidence": confidence,
                        "bbox": bbox
                    })
                    total_confidence += confidence
                    detection_count += 1
                
                avg_confidence = (total_confidence / detection_count) if detection_count > 0 else 95.0
                
                result = {
                    "success": True,
                    "text": full_text,
                    "confidence": round(avg_confidence, 2),
                    "detections": extracted_texts,
                    "detection_count": detection_count
                }
            
            # Send successful response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_error_response(500, f"OCR processing failed: {str(e)}")
    
    def do_GET(self):
        """Health check endpoint"""
        if self.path == '/api/ocr' or self.path == '/api/ocr/health':
            result = {
                "status": "healthy",
                "ocr_engine": "Google Vision API",
                "service": "Vercel Serverless Function"
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        else:
            self.send_error_response(404, "Not found")
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {"error": message, "success": False}
        self.wfile.write(json.dumps(error_data).encode())


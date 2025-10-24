# Google Vision API OCR Service

Python FastAPI microservice providing enterprise-grade OCR using Google Cloud Vision API for the TTB Label Verifier application.

## Overview

This service acts as a bridge between the Next.js application and Google Cloud Vision API, providing high-accuracy text extraction from alcohol label images.

## Why Google Cloud Vision API?

- **95-99% accuracy** (vs 70-85% with traditional OCR)
- **Fast processing**: 1-3 seconds per image
- **Excellent with**: Stylized fonts, curved text, varying sizes
- **Enterprise reliability**: Google's infrastructure
- **Free tier**: 1,000 images/month

## Architecture

```
Next.js App → FastAPI Service → Google Vision API → Return Text
(Port 3000)   (Port 8000)        (Cloud)
```

## Requirements

- Python 3.8 or higher
- Google Cloud account with Vision API enabled
- Service account credentials (JSON file)

## Installation

### 1. Create Virtual Environment

```bash
cd ocr_service
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `fastapi==0.104.1` - Web framework
- `uvicorn[standard]==0.24.0` - ASGI server
- `google-cloud-vision==3.4.5` - Google Vision API client
- `pillow==10.1.0` - Image processing
- `python-multipart==0.0.6` - File upload handling

### 3. Set Up Google Cloud Credentials

See [GOOGLE_VISION_SETUP.md](../GOOGLE_VISION_SETUP.md) for detailed instructions.

**Quick setup:**
1. Download your service account JSON key
2. Save to `ocr_service/credentials/google-vision-key.json`
3. Set environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./credentials/google-vision-key.json"
```

## Running the Service

### Development

```bash
cd ocr_service
source venv/bin/activate
export GOOGLE_APPLICATION_CREDENTIALS="./credentials/google-vision-key.json"
python -m uvicorn app:app --reload
```

The service will start on `http://localhost:8000`

### Production

```bash
cd ocr_service
source venv/bin/activate
export GOOGLE_APPLICATION_CREDENTIALS="./credentials/google-vision-key.json"
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "ocr_engine": "Google Vision API",
  "client_initialized": true
}
```

### POST /ocr

Process an image and extract text.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "success": true,
  "text": "Full extracted text from image...",
  "confidence": 96.5,
  "detections": [
    {
      "text": "ABC",
      "confidence": 98.0,
      "bbox": [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
    }
  ],
  "detection_count": 42
}
```

**Error Response:**
```json
{
  "detail": "Google Vision API client not initialized. Please check your credentials."
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON file | Yes |
| `PORT` | Port to run service on | No (default: 8000) |

## Testing the Service

### Test Health Endpoint

```bash
curl http://localhost:8000/health
```

### Test OCR Endpoint

```bash
curl -X POST -F "file=@/path/to/image.jpg" http://localhost:8000/ocr
```

## Troubleshooting

### Error: "DefaultCredentialsError"

**Cause**: `GOOGLE_APPLICATION_CREDENTIALS` not set

**Solution**:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/credentials.json"
```

### Error: "Vision client not initialized"

**Cause**: Credentials file not found or invalid

**Solution**:
1. Check file exists at specified path
2. Verify file is valid JSON
3. Ensure service account has Vision API permissions

### Error: "API not enabled"

**Cause**: Google Vision API not enabled in your project

**Solution**:
1. Go to https://console.cloud.google.com/apis/library/vision.googleapis.com
2. Click "Enable"

### Error: "Permission denied"

**Cause**: Service account doesn't have necessary permissions

**Solution**:
1. Go to Google Cloud Console → IAM
2. Find your service account
3. Add "Cloud Vision API User" role

## Performance

- **Processing Time**: 1-3 seconds per image
- **Accuracy**: 95-99% depending on image quality
- **Concurrent Requests**: Supports multiple simultaneous requests
- **Max Image Size**: 10MB (enforced by Next.js app)

## Development

### Run with Hot Reload

```bash
python -m uvicorn app:app --reload
```

### View API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

### Using systemd (Linux)

Create `/etc/systemd/system/ocr-service.service`:

```ini
[Unit]
Description=Google Vision OCR Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/ocr_service
Environment="GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json"
ExecStart=/path/to/venv/bin/python -m uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable ocr-service
sudo systemctl start ocr-service
```

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY credentials/ credentials/

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-vision-key.json

CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t ocr-service .
docker run -p 8000:8000 ocr-service
```

## Cost Information

Google Cloud Vision API pricing:
- **Free**: First 1,000 images/month
- **Paid**: $1.50 per 1,000 images (1,001 - 5,000,000)
- **Enterprise**: $0.60 per 1,000 images (5,000,001+)

For typical development/testing, you'll stay within the free tier.

## Security

⚠️ **NEVER commit credentials to git!**

The `.gitignore` file excludes:
- `credentials/`
- `*-key.json`
- `venv/`

## Logging

The service logs important events:
- Service startup
- Credential initialization
- OCR requests (filename, processing time)
- Errors and warnings

View logs in terminal or redirect to file:
```bash
python -m uvicorn app:app --log-config logging.yaml
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Resources

- [Google Cloud Vision API Documentation](https://cloud.google.com/vision/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Client Library](https://cloud.google.com/python/docs/reference/vision/latest)

## License

See [LICENSE](../LICENSE) file.

---

**For setup help, see [GOOGLE_VISION_SETUP.md](../GOOGLE_VISION_SETUP.md)**

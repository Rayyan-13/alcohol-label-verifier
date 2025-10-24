# Deployment Guide

## ⚠️ Important: Multi-Service Architecture

This application consists of **TWO services** that must be deployed:
1. **Next.js Frontend/API** (Node.js) - Port 3000
2. **Python OCR Service** (FastAPI) - Port 8000

Both services must be running and connected for the application to work.

## Prerequisites

### For All Deployments
- Git repository (GitHub, GitLab, or Bitbucket)
- **Google Cloud account** with Vision API enabled
- **Service account credentials** (JSON key file)

### Platform-Specific
- Vercel/Netlify account (for Next.js app)
- Python hosting (Heroku, Render, Google Cloud Run, etc.)

## Quick Deploy to Vercel + Heroku (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Heroku account (free tier available)
- Google Cloud account with Vision API enabled

### Steps

#### Part 1: Deploy Python OCR Service to Heroku

1. **Push to Git Repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TTB Label Verifier"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Heroku app for OCR service**
   ```bash
   heroku create your-app-name-ocr
   ```

3. **Add Python buildpack**
   ```bash
   heroku buildpacks:set heroku/python -a your-app-name-ocr
   ```

4. **Upload Google Cloud credentials to Heroku**
   ```bash
   # Base64 encode your credentials file
   cat ocr_service/credentials/google-vision-key.json | base64
   
   # Set as environment variable (paste the base64 output)
   heroku config:set GOOGLE_CREDENTIALS_BASE64="<paste-base64-here>" -a your-app-name-ocr
   ```

5. **Create `Procfile` in ocr_service directory**
   ```
   web: cd ocr_service && python -m uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

6. **Deploy OCR service**
   ```bash
   git subtree push --prefix ocr_service heroku main
   ```

7. **Note the OCR service URL**: `https://your-app-name-ocr.herokuapp.com`

#### Part 2: Deploy Next.js App to Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

2. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `OCR_SERVICE_URL` = `https://your-app-name-ocr.herokuapp.com`

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

4. **Optional: Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Environment Variables

#### Required for Next.js App (Vercel)
| Variable | Value | Purpose |
|----------|-------|---------|
| `OCR_SERVICE_URL` | `https://your-ocr-service.herokuapp.com` | URL of Python OCR service |

#### Required for Python OCR Service (Heroku)
| Variable | Value | Purpose |
|----------|-------|---------|
| `GOOGLE_CREDENTIALS_BASE64` | Base64-encoded credentials JSON | Google Cloud Vision API credentials |

**Note**: The OCR service needs special handling for credentials. Use the base64 approach above or mount credentials as shown in Docker deployment.

## Alternative Deployment Options

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. Or use the Netlify web UI:
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install Next.js plugin from Netlify

### Deploy to Heroku

1. Create `Procfile`:
   ```
   web: npm start
   ```

2. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

4. Open app:
   ```bash
   heroku open
   ```

### Deploy to Render

1. Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: ttb-label-verifier
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
   ```

2. Connect repository in Render dashboard
3. Deploy automatically on push

### Deploy to AWS (Advanced)

#### Option 1: AWS Amplify

1. Push code to Git
2. Go to AWS Amplify Console
3. Connect repository
4. Configure build settings:
   - Build command: `npm run build`
   - Start command: `npm start`
5. Deploy

#### Option 2: EC2 + PM2

1. Launch EC2 instance
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Clone and setup:
   ```bash
   git clone <your-repo>
   cd alcohol-label-verifier
   npm install
   npm run build
   ```

4. Install PM2:
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "ttb-verifier" -- start
   pm2 save
   pm2 startup
   ```

5. Configure nginx as reverse proxy

#### Option 3: Docker Compose (Local/VPS)

1. **Create `Dockerfile` for Next.js** (in root):
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   ENV OCR_SERVICE_URL=http://ocr-service:8000
   CMD ["npm", "start"]
   ```

2. **Create `Dockerfile` for OCR service** (in ocr_service/):
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY app.py .
   COPY credentials/ credentials/
   ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-vision-key.json
   EXPOSE 8000
   CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Create `docker-compose.yml`** (in root):
   ```yaml
   version: '3.8'
   
   services:
     ocr-service:
       build:
         context: ./ocr_service
         dockerfile: Dockerfile
       ports:
         - "8000:8000"
       environment:
         - GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-vision-key.json
       volumes:
         - ./ocr_service/credentials:/app/credentials:ro
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
         interval: 30s
         timeout: 10s
         retries: 3
     
     web:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "3000:3000"
       environment:
         - OCR_SERVICE_URL=http://ocr-service:8000
       depends_on:
         - ocr-service
   ```

4. **Deploy**:
   ```bash
   docker-compose up -d
   ```

#### Option 4: AWS ECS (Multi-Container)

1. Create both Dockerfiles as shown above
2. Push both images to ECR
3. Create ECS task definition with both containers
4. Configure service discovery or use ALB for routing

### Deploy to Google Cloud Platform

#### Option 1: Cloud Run (Recommended for GCP)

**Deploy OCR Service:**
1. Create Dockerfile in `ocr_service/` (see Docker Compose section)

2. Build and deploy OCR service:
   ```bash
   cd ocr_service
   gcloud run deploy ttb-ocr-service \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-vision-key.json
   ```

3. Note the service URL: `https://ttb-ocr-service-xxx.run.app`

**Deploy Next.js App:**
1. Create Dockerfile in root (see Docker Compose section)

2. Build and deploy web app:
   ```bash
   cd ..
   gcloud run deploy ttb-verifier \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OCR_SERVICE_URL=https://ttb-ocr-service-xxx.run.app
   ```

#### Option 2: App Engine (Both Services)

**Not Recommended**: App Engine is better suited for single-service apps. Use Cloud Run instead for this multi-service architecture.

### Deploy to Azure

#### Azure Static Web Apps

1. Install Azure CLI
2. Create static web app:
   ```bash
   az staticwebapp create \
     --name ttb-verifier \
     --resource-group your-rg \
     --source <repo-url> \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --output-location ".next"
   ```

#### Azure App Service

1. Create web app:
   ```bash
   az webapp create \
     --name ttb-verifier \
     --resource-group your-rg \
     --plan your-plan \
     --runtime "NODE|18-lts"
   ```

2. Deploy code:
   ```bash
   az webapp deployment source config \
     --name ttb-verifier \
     --resource-group your-rg \
     --repo-url <your-repo> \
     --branch main
   ```

## Post-Deployment Checklist

### Both Services Running
- [ ] **OCR Service** is deployed and accessible
- [ ] **Next.js App** is deployed and accessible
- [ ] Health check passes: `curl https://your-ocr-service/health`
- [ ] Services can communicate (check network/firewall rules)

### Functionality Tests
- [ ] Application loads without errors
- [ ] All pages are accessible
- [ ] Image upload works
- [ ] **OCR processing works** (test with sample image)
- [ ] Results display correctly with confidence scores
- [ ] Mobile responsive design works

### Configuration
- [ ] SSL/HTTPS is enabled on both services
- [ ] Environment variables set correctly:
  - [ ] `OCR_SERVICE_URL` on Next.js app
  - [ ] `GOOGLE_APPLICATION_CREDENTIALS` on OCR service
- [ ] Custom domain configured (if applicable)
- [ ] CORS configured properly

### Optional
- [ ] Error logging set up (Sentry, etc.)
- [ ] Analytics added (Google Analytics, Vercel Analytics)
- [ ] Monitoring/alerts configured
- [ ] Rate limiting implemented

## Monitoring & Maintenance

### Multi-Service Monitoring

**Monitor Both Services:**
1. **Next.js App Health**
   - Check deployment logs in Vercel/platform dashboard
   - Monitor API route performance
   - Track error rates

2. **OCR Service Health**
   - Health endpoint: `GET /health`
   - Monitor response times
   - Track Google Vision API quota usage
   - Monitor service uptime

### Service Health Checks

```bash
# Check OCR service
curl https://your-ocr-service.herokuapp.com/health

# Expected response:
# {"status": "healthy", "ocr_engine": "Google Vision API", "client_initialized": true}

# Check Next.js API
curl https://your-app.vercel.app/api/verify
# Should return 405 (Method not allowed) - means it's accessible
```

### Vercel Analytics
Enable built-in analytics in Vercel dashboard for:
- Page views
- Load times
- User demographics
- API route performance

### Error Tracking (Optional)
Integrate Sentry for both services:

**For Next.js:**
```bash
npm install @sentry/nextjs
```

**For Python OCR Service:**
```bash
pip install sentry-sdk[fastapi]
```

### Performance Monitoring
- **Next.js**: Vercel Speed Insights or Google Lighthouse
- **OCR Service**: Monitor Vision API latency
- **End-to-end**: Track total request time

### Logs
- **Next.js (Vercel)**: Check deployment logs in dashboard
- **OCR Service (Heroku)**: `heroku logs --tail -a your-app-name-ocr`
- **Google Cloud Run**: `gcloud run services logs read SERVICE-NAME`
- **Docker**: `docker-compose logs -f`

## Troubleshooting Deployment Issues

### Multi-Service Issues

#### OCR Service Not Reachable

**Problem**: "Could not read text from the label image" or "OCR service is not running"

**Solution**:
1. **Check OCR service is deployed and running**
   ```bash
   curl https://your-ocr-service.herokuapp.com/health
   ```
   
2. **Verify OCR_SERVICE_URL environment variable** is set correctly on Next.js app

3. **Check CORS configuration** - Make sure OCR service allows requests from Next.js domain

4. **Check logs**:
   ```bash
   # Heroku
   heroku logs --tail -a your-app-name-ocr
   
   # Cloud Run
   gcloud run services logs read ttb-ocr-service
   ```

#### Google Vision API Credentials Error

**Problem**: "Vision client not initialized" or "DefaultCredentialsError"

**Solution**:
1. **Verify credentials are uploaded correctly**:
   - For Heroku: Check `GOOGLE_CREDENTIALS_BASE64` is set
   - For Docker: Verify credentials file is in container
   - For Cloud Run: Use service account with Vision API permissions

2. **Check Vision API is enabled** in Google Cloud Console

3. **Verify service account has correct permissions**:
   - Go to IAM in Google Cloud Console
   - Service account needs "Cloud Vision API User" role

#### Services Can't Communicate

**Problem**: Next.js app can't reach OCR service

**Solution**:
1. **Check network/firewall rules** - Services must be able to communicate
2. **Verify URL format** - Use full URL with `https://`
3. **Test connectivity**:
   ```bash
   curl -X POST -F "file=@test-image.jpg" https://your-ocr-service/ocr
   ```
4. **Check for SSL certificate issues** - Both services should use HTTPS

### Build Fails

#### Next.js Build Fails

**Problem**: `npm run build` fails

**Solution**: 
- Check Node.js version (should be 18+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `.next`, reinstall
- Check for TypeScript errors if using TypeScript

#### Python Build Fails

**Problem**: OCR service deployment fails

**Solution**:
- Check Python version (should be 3.8+)
- Verify `requirements.txt` is in ocr_service directory
- Check for dependency conflicts
- Ensure sufficient memory for building (especially numpy)

### Image Upload Not Working

**Problem**: Image upload fails in production

**Solution**:
- Check file size limits on hosting platform (10MB max)
- Verify API routes are deployed correctly
- Check serverless function timeout settings (increase if needed)
- Verify `bodyParser: false` in Next.js API config

### OCR Takes Too Long / Times Out

**Problem**: OCR processing exceeds timeout

**Solution**:
- Increase serverless function timeout (Vercel: max 60s on Pro plan)
- Ensure OCR Python service is deployed and accessible
- Check Google Vision API quota and rate limits
- Verify network connectivity between services
- Monitor OCR service health endpoint
- Consider upgrading hosting plan for better performance

### Environment Variables Not Set

**Problem**: Works locally but not in production

**Solution**:
1. **Check all environment variables are set**:
   - `OCR_SERVICE_URL` on Next.js app
   - `GOOGLE_CREDENTIALS_BASE64` (or equivalent) on OCR service

2. **Verify variable names are exact** (case-sensitive)

3. **Redeploy after setting variables**:
   ```bash
   # Vercel
   vercel --prod
   
   # Heroku
   git push heroku main
   ```

### CORS Errors

**Problem**: CORS policy blocking requests between services

**Solution**:
Update CORS configuration in `ocr_service/app.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app"],  # Add your Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Google Vision API Quota Exceeded

**Problem**: "Quota exceeded" error

**Solution**:
- Check usage in Google Cloud Console
- Upgrade to paid tier if needed
- Implement caching to reduce API calls
- Add rate limiting to prevent abuse

## Scaling Considerations

### For High Traffic

1. **Scale OCR Service**:
   - Use auto-scaling (Cloud Run, ECS)
   - Add load balancer if deploying multiple instances
   - Monitor Google Vision API quota

2. **Scale Next.js App**:
   - Vercel handles auto-scaling
   - Use CDN (included automatically on most platforms)
   - Optimize bundle size

3. **Optimize Performance**:
   - Implement caching for OCR results (Redis)
   - Use Next.js Image component for images
   - Rate limiting on API routes
   - Queue system for batch processing (Bull, RabbitMQ)

4. **Database** (optional):
   - Store verification history
   - Cache common label results
   - Analytics and reporting

### Cost Optimization

**Next.js (Vercel)**:
- **Free Tier**: 100 GB-Hrs/month (sufficient for moderate use)
- Optimize bundle size: Remove unused dependencies
- Lazy load components

**OCR Service**:
- **Heroku Free Tier**: Limited hours/month
- **Google Vision API**: First 1,000 images/month FREE
- Implement caching to reduce API calls
- Use connection pooling

**Overall**:
- Monitor usage in dashboards
- Set up billing alerts
- Optimize image sizes before OCR
- Implement rate limiting to prevent abuse

## Security Checklist

### General Security
- [ ] **HTTPS enforced** on both services
- [ ] **Security headers** set (Vercel handles automatically for Next.js)
- [ ] **CORS configured** properly on OCR service
- [ ] **Rate limiting** implemented on API endpoints
- [ ] No sensitive data in client-side code

### File Upload Security
- [ ] **File type validation** (images only)
- [ ] **File size limits** enforced (10MB max)
- [ ] **Temporary file cleanup** after processing
- [ ] **No permanent storage** of uploaded images

### Google Cloud Credentials
- [ ] ⚠️ **NEVER commit credentials** to git repository
- [ ] **Credentials stored securely**:
  - Environment variables (base64 encoded)
  - Secret management service (AWS Secrets Manager, etc.)
  - Mounted volumes (Docker/Kubernetes)
- [ ] **.gitignore** includes credentials files
- [ ] **Service account** has minimal required permissions
- [ ] **Credentials rotation** policy in place

### Service Communication
- [ ] **OCR_SERVICE_URL** uses HTTPS (not HTTP)
- [ ] **Service-to-service authentication** (optional but recommended)
- [ ] **API keys** for OCR service (optional)
- [ ] **Network isolation** if using VPC/private network

### Monitoring & Alerts
- [ ] **Failed login/access** alerts (if authentication added)
- [ ] **Unusual API usage** alerts
- [ ] **Error rate** monitoring
- [ ] **Security scanning** for vulnerabilities (Snyk, Dependabot)

## Backup & Recovery

### Code Backup
- Git repository serves as backup
- Tag releases: `git tag -a v1.0.0 -m "Release version 1.0.0"`

### Rollback Procedure
- **Vercel**: Click "Rollback" on previous deployment
- **Git-based**: Revert commit and push
- **Manual**: Redeploy previous version

## Updates & Maintenance

### Dependency Updates
```bash
npm outdated
npm update
npm audit fix
```

### Next.js Updates
```bash
npm install next@latest react@latest react-dom@latest
```

### Testing Before Deploy
```bash
npm run build
npm start
# Test thoroughly before pushing
```

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Google Cloud Vision API**: https://cloud.google.com/vision/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **TTB Guidelines**: https://www.ttb.gov/



# ☁️ Google Cloud Run Deployment Guide

## 🚀 Quick Deploy (Recommended)

### Option 1: Using Deployment Script (Easiest)

```bash
# Make script executable
chmod +x deploy-cloud-run.sh

# Run deployment script
./deploy-cloud-run.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Prompt for environment variables
3. ✅ Build and deploy to Cloud Run
4. ✅ Show your live URL

---

## 📋 Prerequisites

### 1. Install Google Cloud SDK

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Restart shell
exec -l $SHELL

# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Required Services

**MongoDB Atlas** (free tier available):
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create cluster → Get connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/fifa-wc?retryWrites=true&w=majority`

**Redis Cloud** (optional, free tier available):
- Sign up at: https://redis.com/try-free/
- Create database → Get connection string
- Format: `redis://default:password@redis-12345.cloud.redislabs.com:12345`

**OpenAI API Key**:
- Get from: https://platform.openai.com/api-keys
- Format: `sk-...`

---

## 🔧 Manual Deployment Commands

### Method 1: Direct Source Deployment (Simplest)

```bash
# Deploy directly from source
gcloud run deploy fifa-wc-assistant \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 100 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "PORT=8080" \
  --set-env-vars "MONGODB_URI=your-mongodb-uri" \
  --set-env-vars "OPENAI_API_KEY=your-openai-key" \
  --set-env-vars "JWT_SECRET=your-jwt-secret-min-32-chars" \
  --set-env-vars "DEFAULT_MODEL=gpt-4-turbo-preview"
```

### Method 2: Using Docker Build

```bash
# Get project ID
PROJECT_ID=$(gcloud config get-value project)

# Build Docker image
docker build -t gcr.io/$PROJECT_ID/fifa-wc-assistant:latest .

# Configure Docker authentication
gcloud auth configure-docker

# Push image
docker push gcr.io/$PROJECT_ID/fifa-wc-assistant:latest

# Deploy from image
gcloud run deploy fifa-wc-assistant \
  --image gcr.io/$PROJECT_ID/fifa-wc-assistant:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2
```

---

## 🔐 Environment Variables

### Required Variables

```bash
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secure-secret-min-32-characters
```

### Optional Variables

```bash
REDIS_URL=redis://...
DEFAULT_MODEL=gpt-4-turbo-preview
MAX_TOKENS=1000
TEMPERATURE=0.7
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://yourdomain.com
CLIENT_URL=https://yourdomain.com
```

### Update Environment Variables After Deployment

```bash
gcloud run services update fifa-wc-assistant \
  --region us-central1 \
  --update-env-vars "MONGODB_URI=new-value"
```

---

## 🐛 Troubleshooting

### Build Failed Error

**Problem**: `Build failed; check build logs for details`

**Solutions**:

1. **Check build logs**:
```bash
gcloud builds list --limit 5
gcloud builds log BUILD_ID
```

2. **Common fixes**:

**Fix 1: Missing dependencies**
```bash
# Ensure package.json has "start" script
"scripts": {
  "start": "node server/index.js"
}
```

**Fix 2: Docker build issues**
```bash
# Test Docker build locally
docker build -t test-build .

# If it fails, check Dockerfile syntax
```

**Fix 3: Large files**
```bash
# Add .gcloudignore to exclude unnecessary files
# Already created for you!
```

**Fix 4: Permission issues**
```bash
# Re-authenticate
gcloud auth login
gcloud auth configure-docker
```

### Container Fails to Start

**Problem**: Container starts but immediately crashes

**Solution 1: Check logs**
```bash
gcloud run services logs tail fifa-wc-assistant --region us-central1
```

**Solution 2: Verify environment variables**
```bash
gcloud run services describe fifa-wc-assistant --region us-central1
```

**Solution 3: Test locally**
```bash
# Test Docker container locally
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e MONGODB_URI=your-uri \
  -e OPENAI_API_KEY=your-key \
  -e JWT_SECRET=your-secret \
  gcr.io/YOUR_PROJECT_ID/fifa-wc-assistant:latest
```

### Database Connection Issues

**Problem**: Can't connect to MongoDB

**Solution**:
```bash
# Whitelist Cloud Run IP
# In MongoDB Atlas:
# 1. Network Access → Add IP Address
# 2. Add: 0.0.0.0/0 (allow from anywhere)
# 3. Or add specific Cloud Run IPs
```

### Port Issues

**Problem**: Application not responding

**Solution**:
```bash
# Ensure PORT environment variable is set to 8080
gcloud run services update fifa-wc-assistant \
  --region us-central1 \
  --update-env-vars "PORT=8080"

# Verify in server/index.js:
# const PORT = process.env.PORT || 5000;
```

---

## ✅ Verify Deployment

### 1. Get Service URL
```bash
gcloud run services describe fifa-wc-assistant \
  --region us-central1 \
  --format 'value(status.url)'
```

### 2. Test Health Endpoint
```bash
# Replace with your actual URL
curl https://fifa-wc-assistant-xxxxx-uc.a.run.app/health

# Expected response:
# {"status":"healthy","timestamp":"...","uptime":...}
```

### 3. Test API Endpoint
```bash
curl https://fifa-wc-assistant-xxxxx-uc.a.run.app/api

# Expected: API endpoint information
```

### 4. View Real-time Logs
```bash
gcloud run services logs tail fifa-wc-assistant --region us-central1
```

---

## 📊 Monitoring

### View Metrics
```bash
# Open Cloud Console metrics
gcloud run services describe fifa-wc-assistant \
  --region us-central1 \
  --format 'value(status.url)' | \
  xargs -I {} echo "Metrics: https://console.cloud.google.com/run/detail/us-central1/fifa-wc-assistant/metrics"
```

### Key Metrics to Monitor
- Request count
- Request latency (P50, P95, P99)
- Container instance count
- CPU utilization
- Memory utilization
- Error rate

---

## 🔄 Update Deployment

### Redeploy After Code Changes
```bash
# Simply run deploy again
gcloud run deploy fifa-wc-assistant \
  --source . \
  --region us-central1
```

### Rollback to Previous Version
```bash
# List revisions
gcloud run revisions list --service fifa-wc-assistant --region us-central1

# Rollback to specific revision
gcloud run services update-traffic fifa-wc-assistant \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

---

## 💰 Cost Optimization

### Current Configuration
- Memory: 2Gi
- CPU: 2
- Min instances: 0
- Max instances: 100

### Estimated Cost (1M requests/month)
- Request charges: ~$0.40
- CPU time: ~$2.40
- Memory: ~$0.40
- Networking: ~$1.20
- **Total: ~$4.40/month**

### Reduce Costs
```bash
# Use smaller resources for testing
gcloud run services update fifa-wc-assistant \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1
```

---

## 🔒 Security Best Practices

### 1. Use Secret Manager (Recommended)

```bash
# Store API key in Secret Manager
echo -n "your-openai-api-key" | \
  gcloud secrets create openai-api-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding openai-api-key \
  --member=serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Deploy with secrets
gcloud run deploy fifa-wc-assistant \
  --source . \
  --region us-central1 \
  --update-secrets OPENAI_API_KEY=openai-api-key:latest
```

### 2. Restrict Access (If Needed)

```bash
# Require authentication
gcloud run services update fifa-wc-assistant \
  --region us-central1 \
  --no-allow-unauthenticated
```

### 3. Enable Cloud Armor (DDoS Protection)

```bash
# Create security policy
gcloud compute security-policies create fifa-ddos-protection

# Add rate limiting
gcloud compute security-policies rules create 1000 \
  --security-policy fifa-ddos-protection \
  --expression "true" \
  --action "rate-based-ban" \
  --rate-limit-threshold-count 100 \
  --rate-limit-threshold-interval-sec 60
```

---

## 📝 Quick Reference Commands

```bash
# Deploy
gcloud run deploy fifa-wc-assistant --source . --region us-central1

# Get URL
gcloud run services describe fifa-wc-assistant --region us-central1 --format 'value(status.url)'

# View logs
gcloud run services logs tail fifa-wc-assistant --region us-central1

# Update env vars
gcloud run services update fifa-wc-assistant --region us-central1 --update-env-vars "KEY=value"

# Delete service
gcloud run services delete fifa-wc-assistant --region us-central1
```

---

## 🎯 Success Checklist

- [ ] Google Cloud SDK installed
- [ ] Project configured (`gcloud config set project`)
- [ ] APIs enabled (run, cloudbuild, containerregistry)
- [ ] MongoDB Atlas URI ready
- [ ] OpenAI API key ready
- [ ] JWT secret generated (min 32 chars)
- [ ] Deployment successful
- [ ] Health check passes
- [ ] Service URL accessible
- [ ] Logs show no errors

---

## 📞 Support

**Official Documentation**:
- Cloud Run: https://cloud.google.com/run/docs
- Troubleshooting: https://cloud.google.com/run/docs/troubleshooting

**Common Issues**:
- Build fails → Check `gcloud builds log`
- Container crashes → Check `gcloud run services logs`
- Connection issues → Verify environment variables

---

**Your FIFA WC 2026 Assistant will be live in minutes! 🚀⚽**

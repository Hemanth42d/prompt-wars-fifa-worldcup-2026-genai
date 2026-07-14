#!/bin/bash

# FIFA World Cup 2026 - Cloud Run Deployment Script
# This script deploys the GenAI Stadium Assistant to Google Cloud Run

set -e

echo "🚀 FIFA World Cup 2026 GenAI Assistant - Cloud Run Deployment"
echo "=============================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP project configured"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📦 Project: $PROJECT_ID"
echo ""

# Service name
SERVICE_NAME="fifa-wc-assistant"
REGION="us-central1"

# Prompt for environment variables
echo "🔐 Environment Variables Setup"
echo "================================"
echo ""

read -p "Enter MongoDB URI: " MONGODB_URI
read -p "Enter Redis URL (or press Enter to skip): " REDIS_URL
read -p "Enter OpenAI API Key: " OPENAI_API_KEY
read -p "Enter JWT Secret (min 32 chars): " JWT_SECRET

# Build environment variables string (NOTE: PORT is auto-set by Cloud Run, don't include it)
ENV_VARS="NODE_ENV=production"
ENV_VARS="$ENV_VARS,MONGODB_URI=$MONGODB_URI"
ENV_VARS="$ENV_VARS,OPENAI_API_KEY=$OPENAI_API_KEY"
ENV_VARS="$ENV_VARS,JWT_SECRET=$JWT_SECRET"
ENV_VARS="$ENV_VARS,DEFAULT_MODEL=gpt-4-turbo-preview"
ENV_VARS="$ENV_VARS,MAX_TOKENS=1000"
ENV_VARS="$ENV_VARS,TEMPERATURE=0.7"
ENV_VARS="$ENV_VARS,JWT_EXPIRE=7d"

if [ ! -z "$REDIS_URL" ]; then
    ENV_VARS="$ENV_VARS,REDIS_URL=$REDIS_URL"
fi

echo ""
echo "🏗️  Building and deploying to Cloud Run..."
echo ""

# Deploy to Cloud Run (PORT is automatically set by Cloud Run)
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 100 \
    --timeout 300 \
    --set-env-vars "$ENV_VARS"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format 'value(status.url)')

echo ""
echo "✅ Deployment successful!"
echo "================================"
echo "🌐 Service URL: $SERVICE_URL"
echo "🏥 Health Check: $SERVICE_URL/health"
echo "📡 API Endpoint: $SERVICE_URL/api"
echo ""
echo "📊 View logs:"
echo "gcloud run services logs tail $SERVICE_NAME --region $REGION"
echo ""
echo "🎉 Your FIFA WC 2026 Assistant is now live!"

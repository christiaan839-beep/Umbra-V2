#!/bin/bash

# UMBRA V3 - Sovereign Cloud Run Deployment Script
# ------------------------------------------------
# Ensure you are logged into gcloud before running:
# `gcloud auth login`
# `gcloud config set project [YOUR_PROJECT_ID]`

echo "🦅 Initiating UMBRA V3 Sovereign Deployment..."
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
SERVICE_NAME="umbra-sovereign-v3"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Building Docker container for infinite-execution isolation..."
gcloud builds submit --tag $IMAGE_NAME

echo "Container built. Deploying to Google Cloud Run (SOC2 Compliant cluster)..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --timeout 3600s \
  --cpu 4 \
  --memory 8Gi \
  --port 3000 \
  --set-env-vars NEXT_TELEMETRY_DISABLED=1

echo "🟢 UMBRA V3 successfully deployed to Sovereign Cloud Run architecture."
gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"

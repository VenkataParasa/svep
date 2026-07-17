#!/bin/bash
set -e

echo "=========================================="
echo " Azure Container Apps - Build & Deploy"
echo "=========================================="

RG="svep-rg"
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# 1. Dynamically find the Azure Container Registry
echo "Looking up Azure Container Registry in $RG..."
ACR_NAME=$(az acr list --resource-group $RG --query "[0].name" -o tsv)

if [ -z "$ACR_NAME" ]; then
    echo "❌ Could not find ACR in resource group $RG!"
    exit 1
fi

echo "✅ Found ACR: $ACR_NAME"
ACR_SERVER="$ACR_NAME.azurecr.io"

# 2. Build and Push NLP Service (using Cloud Build so Docker Desktop isn't required)
echo "🚀 Building and pushing NLP Service image to Azure..."
az acr build --registry $ACR_NAME --image svep-nlp:$TIMESTAMP ./nlp_service/

# 3. Build and Push Web Service
echo "🚀 Building and pushing Web App image to Azure..."
az acr build --registry $ACR_NAME --image svep-web:$TIMESTAMP ./

# 4. Force Azure Container Apps to pull the latest image and restart by using the unique timestamp tag
echo "🔄 Updating Container Apps to deploy the new images..."
az containerapp update -n svep-nlp -g $RG --image $ACR_SERVER/svep-nlp:$TIMESTAMP
az containerapp update -n svep-web -g $RG --image $ACR_SERVER/svep-web:$TIMESTAMP

echo "=========================================="
echo "🎉 Deployment complete! The new containers are live."
echo "=========================================="

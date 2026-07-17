#!/bin/bash

# Configuration
PROJECT_NAME="svep"
ACR_NAME="${PROJECT_NAME}registry"

echo "Logging in to Azure Container Registry ($ACR_NAME)..."
az acr login --name $ACR_NAME

if [ $? -ne 0 ]; then
  echo "Failed to login to ACR. Did you run 'az login' and 'terraform apply' in terraform-azure-registry?"
  exit 1
fi

ACR_URL="${ACR_NAME}.azurecr.io"

echo "Building images locally..."
docker-compose build

echo "Tagging images for ACR..."
docker tag svp-web:latest $ACR_URL/${PROJECT_NAME}-web:latest
docker tag svp-nlp:latest $ACR_URL/${PROJECT_NAME}-nlp:latest

echo "Pushing images to ACR..."
docker push $ACR_URL/${PROJECT_NAME}-web:latest
docker push $ACR_URL/${PROJECT_NAME}-nlp:latest

echo "Done! You can now run 'terraform apply' in the terraform-azure folder."

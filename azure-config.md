# Azure Container Apps Deployment Configuration

This document outlines the infrastructure and application-level configurations used to successfully deploy the SVEP platform to Azure Container Apps.

## Application Code Configurations

### 1. Next.js Standalone Mode (`next.config.ts`)
We conditionally enabled Next.js's standalone output for Azure Docker builds, while disabling it for Vercel.
```typescript
output: process.env.VERCEL ? undefined : "standalone"
```
**Why:** Azure requires the standalone trace to run in Docker. However, forcing it on Vercel breaks their native serverless function tracing.

### 2. Prisma Engine Docker Copies (`Dockerfile`)
Next.js fails to properly bundle Prisma's dynamically loaded `.node` query engine binaries when building in standalone mode. We manually bypassed this by forcing Docker to copy them into the final image:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
```

### 3. Graceful Database Fallback (`lib/live-issues.ts`)
To prevent the Azure Container App from crashing/timing out (504 Gateway Timeout) when the external OpenStates API was degraded, we parallelized the fetches and added a strict timeout.
- Used `Promise.all()` to fetch all 9 issue categories concurrently.
- Used an `AbortController` with a `3000ms` strict timeout.
- Wrapped the Prisma database fallback in a `try/catch` block to elegantly degrade without breaking the page.

---

## Azure Infrastructure Configurations

These are the configurations pulled directly from the `svep-web` Azure Container App environment:

### Container Resources & Scaling
* **Workload Profile:** Consumption (Serverless scale-to-zero model)
* **CPU:** 1.0 vCPU
* **Memory (RAM):** 2.0 Gi
* **Ephemeral Storage:** 4.0 Gi
* **Scaling (Min Replicas):** 0 (Scale to zero enabled)
* **Scaling (Max Replicas):** 10
* **Cooldown Period:** 300 seconds
* **Polling Interval:** 30 seconds

### Environment Variables
The Azure Container App was provisioned with the following runtime variables:
* `DATABASE_URL`: Your Neon Postgres Pooler connection string (`postgresql://neondb_owner:...`)
* `DIRECT_URL`: Your Neon Postgres direct connection string
* `NLP_SERVICE_URL`: Internal URL routing to your Azure NLP microservice (`https://svep-nlp...`)
* `OPENSTATES_API_KEY`: Secret key used for the live issues page

### Deployment Pipeline (`scripts/deploy-updates.sh`)
* Images are built directly in the cloud using Azure Container Registry (ACR) via `az acr build`.
* The Container Apps are then commanded to pull the latest image tagged with a unique timestamp using `az containerapp update`.

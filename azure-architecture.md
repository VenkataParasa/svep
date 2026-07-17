# Civic Data Platform - Azure Target Architecture

This document provides a high-fidelity architectural overview of the Civic Data Platform deployed on Microsoft Azure. It reflects the target state where the third-party Neon database is fully migrated natively into Azure Database for PostgreSQL.

```mermaid
architecture-beta
    group azure(cloud)[Azure Cloud]
    
    group rg(resource)[Resource Group: svep-rg] in azure
    
    group vnet(network)[Virtual Network] in rg
    
    %% Core Infrastructure Components
    service kv(key)[Azure Key Vault\n(Secrets & API Keys)] in rg
    service acr(registry)[Azure Container Registry\n(Docker Images)] in rg
    
    %% Application Environment
    group cae(cluster)[Container Apps Environment] in vnet
    service web(server)[Next.js Web App\n(svep-web)] in cae
    service nlp(server)[Python NLP Service\n(svep-nlp)] in cae
    
    %% Target State Database
    service db(database)[Azure Database for PostgreSQL\n(Flexible Server)] in vnet
    
    %% External Endpoints
    service dns(internet)[Public Internet / Users] in azure
    
    %% External Data Providers
    group external(cloud)[External Civic APIs]
    service cicero(api)[Cicero API] in external
    service google(api)[Google Civic API] in external
    service openstates(api)[OpenStates API] in external
    
    %% Connections & Flow
    dns:R --> L:web
    web:R --> L:nlp
    
    %% Web App Dependencies
    web:B --> T:db
    web:T --> B:kv
    
    %% External API Calls
    web:R --> L:cicero
    web:R --> L:google
    web:R --> L:openstates
    
    %% Managed Identity & Container Registry Flow
    acr:L --> R:web
    acr:L --> R:nlp
```

### Components Summary

1. **Azure Container Apps Environment (`svep-cae`)**: Serverless container orchestration handling dynamic scaling for both the frontend and the Python microservices.
2. **Next.js Web App (`svep-web`)**: The primary user-facing Node.js application. It securely fetches secrets via Managed Identity and communicates with external civic APIs.
3. **Python NLP Service (`svep-nlp`)**: An internal microservice used for processing plain-language text simplifications without relying on generative AI.
4. **Azure Key Vault (`svep-kv2`)**: Securely stores all sensitive environment variables (e.g., `DATABASE_URL`, `CICERO_API_KEY`). The web app fetches these strictly via Azure RBAC Managed Identity access at runtime.
5. **Azure Container Registry (`svepregistry`)**: Hosts the compiled Docker images for both `svep-web` and `svep-nlp`. The CI/CD pipelines push directly here.
6. **Azure Database for PostgreSQL (Target State)**: The target state moves the data away from the external Neon Cloud and into a native Azure Flexible Server deployed within the same Virtual Network, reducing latency and tightening security boundaries.

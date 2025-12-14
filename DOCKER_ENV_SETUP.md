# Container Apps environment variables (copy these to Azure Portal → Container App → Secrets & Environment Variables)

# ===== REQUIRED =====
PORT=8080
NODE_ENV=production

# Database (from Cosmos DB connection string)
MONGODB_URI=your-cosmos-db-connection-string

# JWT Authentication (generate strong random values and add as secrets in Container Apps)
JWT_SECRET=your-strong-random-32-char-jwt-secret
JWT_REFRESH_SECRET=your-strong-random-32-char-refresh-secret

# ===== OPTIONAL (Azure Metrics) =====
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_RESOURCE_GROUP=your-resource-group
LOG_ANALYTICS_WORKSPACE_ID=your-workspace-id
APPINSIGHTS_INSTRUMENTATION_KEY=your-insights-key

# ===== FRONTEND CORS =====
FRONTEND_URL=https://your-container-app-url.azurecontainerapps.io

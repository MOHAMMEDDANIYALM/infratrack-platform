# infratrack-platform
Cloud-native workforce and asset monitoring platform on Azure using AKS, Docker, Terraform, and CI/CD.

## Azure Cost Data (INR)
- Required env (backend): `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`
- Optional: `AZURE_USD_TO_INR` (fallback conversion rate, default `83` if Azure billing currency is USD)
- The backend calls Azure Cost Management API for the `/costs` endpoint; ensure the service principal has `Cost Management Reader` on the subscription.

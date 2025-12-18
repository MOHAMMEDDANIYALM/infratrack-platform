# Fix Azure Container App stream timeout
# The issue is likely the health probe configuration in the portal

$containerApp = "infratrack-app"
$resourceGroup = "infratrack-rg"

Write-Host "Creating health probe configuration YAML..." -ForegroundColor Cyan

# Create a YAML config with proper health probes
$yamlConfig = @"
properties:
  configuration:
    ingress:
      external: true
      targetPort: 8080
      transport: auto
      allowInsecure: false
  template:
    containers:
    - name: infratrack-app
      probes:
      - type: startup
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 3
        timeoutSeconds: 10
        failureThreshold: 10
      - type: liveness
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 30
        timeoutSeconds: 10
        failureThreshold: 3
      - type: readiness
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
        timeoutSeconds: 5
        failureThreshold: 3
"@

$yamlConfig | Out-File -FilePath "./containerapp-config.yaml" -Encoding UTF8

Write-Host "Applying configuration..." -ForegroundColor Yellow

# Apply the configuration
az containerapp update `
  --name $containerApp `
  --resource-group $resourceGroup `
  --yaml ./containerapp-config.yaml

Write-Host "`nConfiguration applied! Checking status..." -ForegroundColor Green
Start-Sleep -Seconds 10

az containerapp revision list `
  --name $containerApp `
  --resource-group $resourceGroup `
  --query "[0].{Name:name, Active:properties.active, Health:properties.healthState}" `
  --output table

Write-Host "`nChecking logs:" -ForegroundColor Cyan
az containerapp logs show --name $containerApp --resource-group $resourceGroup --tail 30

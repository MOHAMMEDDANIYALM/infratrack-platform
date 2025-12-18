# Quick Fix: Update Container App to listen on correct port
# This immediately fixes the "TargetPort 80 does not match listening port 8080" error

Write-Host "🔧 Fixing Azure Container App port configuration..." -ForegroundColor Cyan

# 1. Apply the containerapp-config.yaml
Write-Host "`n📋 Applying containerapp-config.yaml..." -ForegroundColor Yellow
az containerapp update `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --yaml containerapp-config.yaml `
  2>&1 | Write-Host

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ YAML configuration applied successfully" -ForegroundColor Green
} else {
  Write-Host "⚠️  YAML update had issues, continuing with CLI commands..." -ForegroundColor Yellow
}

# 2. Update ingress port explicitly
Write-Host "`n🔌 Updating ingress to port 8080..." -ForegroundColor Yellow
az containerapp ingress set `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --type external `
  --target-port 8080 `
  --exposed-port 443 `
  2>&1 | Write-Host

# 3. Set environment variables
Write-Host "`n🔑 Setting environment variables..." -ForegroundColor Yellow
az containerapp update `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --set-env-vars `
    PORT=8080 `
    NODE_ENV=production `
    FRONTEND_URL=https://infratrack-app.graycoast-34d22b0c.centralindia.azurecontainerapps.io `
  2>&1 | Write-Host

# 4. Show current configuration
Write-Host "`n📊 Current Container App configuration:" -ForegroundColor Cyan
az containerapp show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --query "properties.configuration.ingress" `
  2>&1 | Write-Host

Write-Host "`n✅ Container App has been updated. Check Azure Portal for new revision status." -ForegroundColor Green
Write-Host "   The app should now accept traffic on port 8080 and health probes should succeed." -ForegroundColor Gray

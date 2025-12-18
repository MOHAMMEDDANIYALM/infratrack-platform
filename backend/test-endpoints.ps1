# Test all InfraTrack backend endpoints
Write-Host "=== Testing InfraTrack Backend ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"

# Test 1: Health
Write-Host "`n[1/4] Testing /health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Costs (public endpoint)
Write-Host "`n[2/4] Testing /api/costs..." -ForegroundColor Yellow
try {
    $costs = Invoke-RestMethod -Uri "$baseUrl/api/costs" -Method Get
    Write-Host "✅ Costs returned $($costs.costs.Count) records, total: ₹$($costs.totalCost)" -ForegroundColor Green
} catch {
    Write-Host "❌ Costs failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Deployments
Write-Host "`n[3/4] Testing /api/deployments..." -ForegroundColor Yellow
try {
    $deployments = Invoke-RestMethod -Uri "$baseUrl/api/deployments" -Method Get
    Write-Host "✅ Deployments returned $($deployments.deployments.Count) records" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployments failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Servers
Write-Host "`n[4/4] Testing /api/servers..." -ForegroundColor Yellow
try {
    $servers = Invoke-RestMethod -Uri "$baseUrl/api/servers" -Method Get
    Write-Host "✅ Servers returned $($servers.Count) records" -ForegroundColor Green
} catch {
    Write-Host "❌ Servers failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Backend Tests Complete ===" -ForegroundColor Cyan

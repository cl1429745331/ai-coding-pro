# Check deployment status
Write-Host "Checking Vue Snake Game deployment status..." -ForegroundColor Cyan
Write-Host ""

# Check if container is running
$containerStatus = docker ps --filter "name=vue-snake-game" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
if ($containerStatus -match "vue-snake-game") {
    Write-Host "✅ Container Status:" -ForegroundColor Green
    Write-Host $containerStatus
    Write-Host ""
    Write-Host "🌐 Access your Vue app at: http://localhost:8080" -ForegroundColor Yellow
} else {
    Write-Host "❌ Container is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available containers:" -ForegroundColor Yellow
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

Write-Host ""
Write-Host "📋 Available commands:" -ForegroundColor Cyan
Write-Host "  .\deploy.ps1                    # Full deployment"
Write-Host "  .\deploy.ps1 -Action restart    # Restart container"
Write-Host "  .\deploy.ps1 -Action clean      # Clean up"
Write-Host "  .\deploy.ps1 -Help              # Show help"

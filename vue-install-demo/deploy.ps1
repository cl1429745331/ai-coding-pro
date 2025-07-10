# Vue Docker Deployment Script (PowerShell)
# Usage: .\deploy.ps1 [options]

param(
    [string]$Action = "full",
    [switch]$Help
)

$PROJECT_NAME = "vue-snake-game"
$IMAGE_NAME = "vue-snake-game:latest"
$CONTAINER_NAME = "vue-snake-game"
$HOST_PORT = 8080
$CONTAINER_PORT = 80

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Show-Help {
    Write-Host "Vue Docker Deployment Script (PowerShell)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\deploy.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Action build-only    Build image only, do not start container"
    Write-Host "  -Action restart       Restart existing container"
    Write-Host "  -Action clean         Clean old images and containers"
    Write-Host "  -Help                 Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy.ps1                    # Full deployment"
    Write-Host "  .\deploy.ps1 -Action build-only # Build only"
    Write-Host "  .\deploy.ps1 -Action clean      # Clean"
    Write-Host ""
}

function Test-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Docker not installed, please install Docker Desktop first"
            return $false
        }
        Write-Info "Docker installed: $dockerVersion"

        $composeVersion = docker-compose --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Docker Compose not installed, please install Docker Compose first"
            return $false
        }
        Write-Info "Docker Compose installed: $composeVersion"

        return $true
    }
    catch {
        Write-Error "Error checking Docker: $($_.Exception.Message)"
        return $false
    }
}

function Clean-Containers {
    Write-Info "Cleaning old containers and images..."

    # Stop and remove container
    docker stop $CONTAINER_NAME 2>$null
    docker rm $CONTAINER_NAME 2>$null

    # Remove images
    $images = docker images $PROJECT_NAME -q 2>$null
    if ($images) {
        docker rmi $images 2>$null
    }

    # Clean unused images
    docker image prune -f

    Write-Info "Cleanup completed"
}

function Build-Image {
    Write-Info "Starting Docker image build..."

    # Use docker build instead of docker-compose for better control
    docker build -t $IMAGE_NAME .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Image build failed"
        return $false
    }

    Write-Info "Image build completed"
    return $true
}

function Start-Container {
    Write-Info "Starting container..."

    # Use docker run instead of docker-compose for better control
    docker run -d --name $CONTAINER_NAME -p "${HOST_PORT}:${CONTAINER_PORT}" $IMAGE_NAME
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Container startup failed"
        return $false
    }

    # Wait for container to start
    Start-Sleep -Seconds 5

    # Check container status
    $containerStatus = docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}"
    if ($containerStatus -match $CONTAINER_NAME) {
        Write-Info "Container started successfully!"
        Write-Info "Access URL: http://localhost:$HOST_PORT"
        return $true
    } else {
        Write-Error "Container startup failed"
        docker logs $CONTAINER_NAME
        return $false
    }
}

function Restart-Container {
    Write-Info "Restarting container..."
    docker restart $CONTAINER_NAME
    if ($LASTEXITCODE -eq 0) {
        Write-Info "Container restart completed"
        Write-Info "Access URL: http://localhost:$HOST_PORT"
    } else {
        Write-Error "Container restart failed"
    }
}

# Main logic
if ($Help) {
    Show-Help
    exit 0
}

if (-not (Test-Docker)) {
    exit 1
}

switch ($Action.ToLower()) {
    "clean" {
        Clean-Containers
    }
    "build-only" {
        Clean-Containers
        if (-not (Build-Image)) {
            exit 1
        }
    }
    "restart" {
        Restart-Container
    }
    "full" {
        Clean-Containers
        if (-not (Build-Image)) {
            exit 1
        }
        if (-not (Start-Container)) {
            exit 1
        }
    }
    default {
        Write-Error "Unknown option: $Action"
        Show-Help
        exit 1
    }
}

Write-Info "Deployment script completed"

#!/bin/bash

# Vue Docker Deployment Script
# Usage: ./deploy.sh [options]
# Options:
#   --build-only    Build image only, do not start container
#   --restart       Restart existing container
#   --clean         Clean old images and containers

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="vue-snake-game"
IMAGE_NAME="vue-snake-game:latest"
CONTAINER_NAME="vue-snake-game"
HOST_PORT="8080"
CONTAINER_PORT="80"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker not installed, please install Docker first"
        exit 1
    fi

    log_info "Docker version: $(docker --version)"
}

# Clean old containers and images
clean_old() {
    log_info "Cleaning old containers and images..."

    # Stop and remove container
    if docker ps -a | grep -q $CONTAINER_NAME; then
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        log_info "Removed old container"
    fi

    # Remove old images
    if docker images | grep -q $PROJECT_NAME; then
        docker rmi $(docker images $PROJECT_NAME -q) || true
        log_info "Removed old images"
    fi

    # Clean unused images
    docker image prune -f
    log_info "Cleanup completed"
}

# Build image
build_image() {
    log_info "Starting Docker image build..."
    docker build -t $IMAGE_NAME .
    if [ $? -eq 0 ]; then
        log_info "Image build completed"
    else
        log_error "Image build failed"
        exit 1
    fi
}

# Start container
start_container() {
    log_info "Starting container..."
    docker run -d --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT $IMAGE_NAME

    if [ $? -eq 0 ]; then
        # Wait for container to start
        sleep 5

        # Check container status
        if docker ps | grep -q $CONTAINER_NAME; then
            log_info "Container started successfully!"
            log_info "Access URL: http://localhost:$HOST_PORT"
        else
            log_error "Container startup failed"
            docker logs $CONTAINER_NAME
            exit 1
        fi
    else
        log_error "Failed to start container"
        exit 1
    fi
}

# Restart container
restart_container() {
    log_info "Restarting container..."
    docker restart $CONTAINER_NAME
    if [ $? -eq 0 ]; then
        log_info "Container restart completed"
        log_info "Access URL: http://localhost:$HOST_PORT"
    else
        log_error "Container restart failed"
        exit 1
    fi
}

# Show help information
show_help() {
    echo "Vue Docker Deployment Script"
    echo ""
    echo "Usage:"
    echo "  ./deploy.sh [options]"
    echo ""
    echo "Options:"
    echo "  --build-only    Build image only, do not start container"
    echo "  --restart       Restart existing container"
    echo "  --clean         Clean old images and containers"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh                 # Full deployment"
    echo "  ./deploy.sh --build-only    # Build only"
    echo "  ./deploy.sh --clean         # Clean up"
    echo ""
}

# 主函数
main() {
    check_docker
    
    case "${1:-}" in
        --build-only)
            clean_old
            build_image
            ;;
        --restart)
            restart_container
            ;;
        --clean)
            clean_old
            ;;
        --help)
            show_help
            ;;
        "")
            clean_old
            build_image
            start_container
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"

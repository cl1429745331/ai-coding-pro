#!/bin/bash

# Check deployment status
# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

CONTAINER_NAME="vue-snake-game"
HOST_PORT="8080"

echo -e "${CYAN}Checking Vue Snake Game deployment status...${NC}"
echo ""

# Check if container is running
if docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q "$CONTAINER_NAME"; then
    echo -e "${GREEN}✅ Container Status:${NC}"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo -e "${YELLOW}🌐 Access your Vue app at: http://localhost:$HOST_PORT${NC}"
else
    echo -e "${RED}❌ Container is not running${NC}"
    echo ""
    echo -e "${YELLOW}Available containers:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
fi

echo ""
echo -e "${CYAN}📋 Available commands:${NC}"
echo "  ./deploy.sh                 # Full deployment"
echo "  ./deploy.sh --restart       # Restart container"
echo "  ./deploy.sh --clean         # Clean up"
echo "  ./deploy.sh --help          # Show help"

#!/bin/bash

echo "================================================"
echo "PDS E-Health System - Setup Script"
echo "================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"

echo -e "${BLUE}Starting infrastructure services...${NC}"
docker-compose up -d keycloak-db keycloak mysql redis kafka zookeeper

echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 30

echo -e "${GREEN}✓ Infrastructure services started${NC}"

echo ""
echo "================================================"
echo "Next Steps:"
echo "================================================"
echo "1. Configure Keycloak:"
echo "   - Open http://localhost:8080"
echo "   - Login with admin/admin"
echo "   - Create realm: pds-realm"
echo "   - Create client: pds-client"
echo "   - Create roles and users"
echo ""
echo "2. Start microservices:"
echo "   docker-compose up -d"
echo ""
echo "3. Start frontend:"
echo "   cd pds-frontend && npm install && npm run dev"
echo ""
echo "4. Access the application:"
echo "   http://localhost:3000"
echo "================================================"

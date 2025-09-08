# Deployment Guide

This document provides comprehensive deployment instructions for the Hydroponic System Dashboard in both development and production environments.

## Quick Start (GitHub Pages)

The dashboard is currently configured to work out-of-the-box on GitHub Pages:

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Access your dashboard at `https://yourusername.github.io/repository-name`

## Enterprise Deployment

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.9+ with FastAPI (for backend)
- PostgreSQL 13+ (for production database)

### Architecture Overview

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│   Frontend (React)  │◄──►│  Backend (FastAPI)  │◄──►│ Database (PostgreSQL)│
│   Port: 3000        │    │   Port: 8000        │    │   Port: 5432        │
│                     │    │                     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
           ▲                          ▲
           │                          │
           ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │
│   WebSocket Server  │    │   Raspberry Pi      │
│   (Socket.IO)       │    │   Devices           │
│                     │    │                     │
└─────────────────────┘    └─────────────────────┘
```

### Environment Setup

#### 1. Frontend Configuration

Create `.env` file in project root:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8001
REACT_APP_ENVIRONMENT=production
```

#### 2. Backend Configuration

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/hydroponic_db
JWT_SECRET_KEY=your-super-secret-jwt-key-here
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
```

### Docker Deployment

#### Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/hydroponic-dashboard.git
cd hydroponic-dashboard

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Database: localhost:5432
```

#### Production Environment

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Behind reverse proxy (nginx/traefik)
```

### Cloud Platform Deployment

#### AWS Deployment

```bash
# Using AWS ECS with Fargate
aws ecs create-cluster --cluster-name hydroponic-cluster

# Deploy using CloudFormation template
aws cloudformation create-stack \
  --stack-name hydroponic-stack \
  --template-body file://aws-cloudformation.yml \
  --parameters ParameterKey=Environment,ParameterValue=production
```

#### Google Cloud Platform

```bash
# Using Google Cloud Run
gcloud run deploy hydroponic-frontend \
  --image gcr.io/PROJECT-ID/hydroponic-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy hydroponic-backend \
  --image gcr.io/PROJECT-ID/hydroponic-backend \
  --platform managed \
  --region us-central1
```

#### Azure Deployment

```bash
# Using Azure Container Instances
az container create \
  --resource-group hydroponicRG \
  --name hydroponic-app \
  --image youracr.azurecr.io/hydroponic:latest \
  --cpu 2 \
  --memory 4 \
  --ports 80 443
```

### SSL/TLS Configuration

#### Let's Encrypt with Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /ws {
        proxy_pass http://websocket:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

### Monitoring and Logging

#### Prometheus Configuration

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'hydroponic-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: /metrics
    
  - job_name: 'raspberry-pi-devices'
    static_configs:
      - targets: ['device-1:9090', 'device-2:9090']
```

#### Grafana Dashboard

Import the provided `grafana-dashboard.json` for pre-configured monitoring dashboards.

### Database Migration

```bash
# Initial setup
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Production migration
docker exec -it hydroponic-backend alembic upgrade head
```

### Backup Strategy

#### Automated Database Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker exec hydroponic-db pg_dump -U postgres hydroponic_db > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Scaling Considerations

#### Horizontal Scaling

- Use load balancer (AWS ALB, GCP Load Balancer)
- Deploy multiple backend instances
- Configure Redis for session management
- Use CDN for static assets

#### Database Scaling

- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer)
- Database partitioning for large datasets

### Security Checklist

- [ ] Enable HTTPS/TLS encryption
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database encryption at rest
- [ ] VPN access for admin functions

### Troubleshooting

#### Common Issues

1. **Frontend not loading**: Check CORS configuration
2. **Database connection errors**: Verify DATABASE_URL
3. **WebSocket connection failed**: Check firewall settings
4. **High memory usage**: Monitor container resources

#### Log Analysis

```bash
# View application logs
docker logs hydroponic-backend --tail=100 -f

# Database performance
docker exec hydroponic-db psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# WebSocket connections
docker logs hydroponic-websocket | grep "connection"
```

### Performance Optimization

#### Frontend Optimization

- Enable gzip compression
- Use service worker for caching
- Optimize bundle size
- Implement lazy loading

#### Backend Optimization

- Enable database query optimization
- Use Redis for caching
- Implement API rate limiting
- Optimize Docker images

For additional support, see the [Technical Architecture](README.md#technical-architecture) section or contact the development team.
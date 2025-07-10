# FluxGen Deployment Guide

This guide covers various deployment options for FluxGen, from simple static hosting to containerized deployments.

## Prerequisites

- Node.js 18+
- npm or yarn
- n8n instance (for backend workflow)
- Together AI API key

## Build for Production

First, build the application for production:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Preview the build (optional)
npm run preview
```

The built files will be in the `dist` directory.

## Static Hosting Deployments

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Or deploy via drag & drop**
   - Go to [Netlify](https://netlify.com)
   - Drag the `dist` folder to the deploy area

4. **Configure redirects for SPA**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Or connect GitHub repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`

### GitHub Pages

1. **Create deployment workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

## Docker Deployment

### Dockerfile

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### Build and Run Docker Container

```bash
# Build the image
docker build -t fluxgen .

# Run the container
docker run -p 80:80 fluxgen

# Or run in background
docker run -d -p 80:80 --name fluxgen-app fluxgen
```

## Docker Compose with n8n

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  fluxgen:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - n8n

  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n/workflows:/home/node/.n8n/workflows
    restart: unless-stopped

  # Optional: Add a reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - fluxgen
      - n8n
    restart: unless-stopped

volumes:
  n8n_data:
```

Run with:

```bash
docker-compose up -d
```

## Cloud Platform Deployments

### AWS (Amazon Web Services)

#### S3 + CloudFront

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-fluxgen-bucket
   ```

2. **Upload build files**
   ```bash
   aws s3 sync dist/ s3://your-fluxgen-bucket --delete
   ```

3. **Configure bucket for static hosting**
   ```bash
   aws s3 website s3://your-fluxgen-bucket --index-document index.html --error-document index.html
   ```

4. **Create CloudFront distribution**
   ```json
   {
     "Origins": [{
       "DomainName": "your-fluxgen-bucket.s3.amazonaws.com",
       "Id": "S3-fluxgen",
       "S3OriginConfig": {
         "OriginAccessIdentity": ""
       }
     }],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-fluxgen",
       "ViewerProtocolPolicy": "redirect-to-https"
     }
   }
   ```

#### ECS (Elastic Container Service)

1. **Push image to ECR**
   ```bash
   # Create ECR repository
   aws ecr create-repository --repository-name fluxgen

   # Get login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

   # Tag and push image
   docker tag fluxgen:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/fluxgen:latest
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/fluxgen:latest
   ```

2. **Create ECS task definition**
   ```json
   {
     "family": "fluxgen",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [{
       "name": "fluxgen",
       "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/fluxgen:latest",
       "portMappings": [{
         "containerPort": 80,
         "protocol": "tcp"
       }]
     }]
   }
   ```

### Google Cloud Platform

#### Cloud Run

1. **Build and push to Container Registry**
   ```bash
   # Configure Docker for GCP
   gcloud auth configure-docker

   # Tag and push image
   docker tag fluxgen gcr.io/your-project-id/fluxgen
   docker push gcr.io/your-project-id/fluxgen
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy fluxgen \
     --image gcr.io/your-project-id/fluxgen \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### App Engine

Create `app.yaml`:

```yaml
runtime: nodejs18

env_variables:
  NODE_ENV: production

handlers:
  - url: /static
    static_dir: dist/static
    secure: always

  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html
    secure: always
```

Deploy:

```bash
gcloud app deploy
```

### Microsoft Azure

#### Static Web Apps

1. **Create Azure Static Web App**
   ```bash
   az staticwebapp create \
     --name fluxgen \
     --resource-group myResourceGroup \
     --source https://github.com/yourusername/fluxgen \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --output-location "dist"
   ```

2. **Configure GitHub Actions**
   Azure will automatically create a workflow file.

#### Container Instances

```bash
# Create resource group
az group create --name fluxgen-rg --location eastus

# Create container instance
az container create \
  --resource-group fluxgen-rg \
  --name fluxgen \
  --image your-registry/fluxgen:latest \
  --dns-name-label fluxgen-app \
  --ports 80
```

## Environment Configuration

### Environment Variables

Create `.env.production`:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-n8n-instance.com/webhook-test

# Application Settings
VITE_APP_TITLE=FluxGen
VITE_APP_DESCRIPTION=AI Image Generator

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_ID=your-analytics-id

# Feature Flags
VITE_ENABLE_ADMIN_DASHBOARD=true
VITE_ENABLE_DOCUMENTATION=true
```

### Build-time Configuration

Update `vite.config.ts` for production optimizations:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Your existing configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Logging

### Health Checks

Configure health check endpoints:

```bash
# Docker health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1
```

### Logging

Configure structured logging:

```javascript
// Add to your application
const logger = {
  info: (message, meta) => console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date().toISOString() })),
  error: (message, meta) => console.error(JSON.stringify({ level: 'error', message, meta, timestamp: new Date().toISOString() }))
};
```

## Performance Optimization

### CDN Configuration

Configure CDN headers:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}
```

### Compression

Enable gzip compression:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

## Troubleshooting

### Common Issues

1. **Build fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Routing issues in production**
   - Ensure your server is configured for SPA routing
   - Add `_redirects` file for Netlify
   - Configure `nginx.conf` for proper routing

3. **API connection issues**
   - Check CORS configuration
   - Verify API endpoint URLs
   - Check network connectivity

### Debugging

Enable debug mode:

```bash
# Development
npm run dev -- --debug

# Production debugging
NODE_ENV=development npm run build
```

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data
   - Use proper secret management
   - Rotate API keys regularly

2. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
   ```

3. **Rate Limiting**
   - Configure appropriate rate limits
   - Monitor for abuse
   - Implement IP blocking if needed

## Backup and Recovery

### Database Backup (n8n)

```bash
# Backup n8n data
docker exec n8n-container n8n export:workflow --all --output=/tmp/workflows.json
docker cp n8n-container:/tmp/workflows.json ./backup/

# Restore
docker cp ./backup/workflows.json n8n-container:/tmp/
docker exec n8n-container n8n import:workflow --input=/tmp/workflows.json
```

### Application Backup

```bash
# Backup configuration
tar -czf fluxgen-backup-$(date +%Y%m%d).tar.gz \
  docker-compose.yml \
  nginx.conf \
  .env.production \
  n8n/
```

---

For additional deployment support, please refer to our [GitHub Issues](https://github.com/yourusername/fluxgen/issues) or contact support@fluxgen.dev.
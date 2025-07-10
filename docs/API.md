# FluxGen API Documentation

This document provides detailed information about the FluxGen API endpoints, request/response formats, and integration guidelines.

## Base URL

```
https://your-n8n-instance.com/webhook-test
```

## Authentication

Currently, FluxGen uses IP-based rate limiting without requiring API keys. For production deployments, consider implementing proper authentication.

## Endpoints

### Generate Image

Generate AI images from text prompts with customizable parameters.

**Endpoint:** `GET /generate-image`

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | ✅ | - | Text prompt (3-1000 characters) |
| `style` | string | ❌ | `default` | Art style preset |
| `width` | number | ❌ | `1024` | Image width (256-2048, multiple of 16) |
| `height` | number | ❌ | `1024` | Image height (256-2048, multiple of 16) |
| `steps` | number | ❌ | `2` | Generation steps (1-4) |
| `n` | number | ❌ | `1` | Number of images (1-4) |
| `seed` | string | ❌ | - | Seed for reproducibility |
| `negative_prompt` | string | ❌ | - | Elements to avoid |
| `enhance` | boolean | ❌ | `false` | Enable quality enhancement |

#### Style Options

- `default` - Standard generation
- `photorealistic` - High-quality, realistic photography
- `artistic` - Creative, expressive fine art
- `cinematic` - Dramatic lighting and composition
- `fantasy` - Magical, mystical themes
- `anime` - Japanese animation style
- `vintage` - Retro, nostalgic aesthetic
- `minimalist` - Clean, simple design

#### Example Request

```bash
curl "https://your-api.com/generate-image?message=A%20beautiful%20sunset%20over%20mountains&style=photorealistic&width=1024&height=1024&steps=2&n=1&enhance=true"
```

#### Success Response

```json
{
  "success": true,
  "images": [
    {
      "url": "https://example.com/generated-image.png",
      "index": 1,
      "metadata": {
        "originalPrompt": "A beautiful sunset over mountains",
        "enhancedPrompt": "A beautiful sunset over mountains, photorealistic, high quality, detailed, 8k resolution",
        "style": "photorealistic",
        "parameters": {
          "width": 1024,
          "height": 1024,
          "steps": 2,
          "seed": "12345"
        },
        "timestamp": "2024-01-15T10:30:00Z",
        "requestId": "img_1705312200_abc123def"
      }
    }
  ],
  "totalImages": 1,
  "model": "black-forest-labs/FLUX.1-schnell-Free",
  "generationTime": 3500,
  "requestId": "img_1705312200_abc123def",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Health Check

Get system health status and service information.

**Endpoint:** `GET /health`

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": "2h 15m 30s",
  "version": "2.0.0",
  "services": {
    "rateLimiter": {
      "status": "healthy",
      "activeClients": 5
    },
    "analytics": {
      "status": "healthy",
      "totalRequests": 150,
      "recentRequests": 12
    },
    "imageGeneration": {
      "status": "healthy",
      "endpoint": "https://api.together.xyz/v1/images/generations",
      "model": "black-forest-labs/FLUX.1-schnell-Free"
    }
  },
  "features": {
    "stylePresets": ["photorealistic", "artistic", "cinematic", "fantasy", "anime", "vintage", "minimalist"],
    "supportedFormats": ["png"],
    "maxDimensions": "2048x2048",
    "maxImages": 4,
    "maxSteps": 4
  }
}
```

### Analytics

Retrieve usage analytics and statistics.

**Endpoint:** `GET /analytics`

#### Response

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "overview": {
    "totalRequests": 1250,
    "uniqueClients": 45,
    "avgRequestsPerClient": 28
  },
  "timeWindows": {
    "lastHour": 12,
    "lastDay": 89,
    "lastWeek": 456
  },
  "styleUsage": {
    "photorealistic": 45,
    "artistic": 32,
    "cinematic": 28,
    "fantasy": 25,
    "anime": 20,
    "vintage": 15,
    "minimalist": 10,
    "default": 8
  },
  "averageParameters": {
    "steps": 2.3,
    "width": 1024,
    "height": 1024
  },
  "topClients": [
    {
      "clientId": "192.168.1.100",
      "requests": 45
    },
    {
      "clientId": "10.0.0.50",
      "requests": 32
    }
  ],
  "recentRequests": [
    {
      "timestamp": "2024-01-15T10:25:00Z",
      "requestId": "img_1705312200_abc123def",
      "style": "photorealistic",
      "parameters": {
        "width": 1024,
        "height": 1024,
        "steps": 2
      }
    }
  ]
}
```

## Error Handling

All endpoints return consistent error responses with the following format:

```json
{
  "error": "Error title",
  "category": "error_category",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "requestId": "req_1705312200_xyz789",
  "retryable": false,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Categories

- `validation_error` - Invalid input parameters
- `rate_limit` - Rate limit exceeded
- `content_violation` - Content policy violation
- `server_error` - Internal server error
- `api_error` - External API error

### Rate Limiting Errors

Rate limiting errors include additional information:

```json
{
  "error": "Rate limit exceeded",
  "category": "rate_limit",
  "limitType": "minute",
  "message": "Too many requests per minute. Current: 6/5",
  "usage": {
    "minute": { "current": 6, "max": 5 },
    "hour": { "current": 25, "max": 50 },
    "day": { "current": 120, "max": 200 }
  },
  "resetTime": 1705312260000,
  "retryAfter": 45,
  "clientId": "192.168.1.100",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limits

FluxGen implements multi-tier rate limiting:

- **Per Minute:** 5 requests
- **Per Hour:** 50 requests  
- **Per Day:** 200 requests

Rate limits are applied per client IP address.

## Content Policy

FluxGen includes content filtering to prevent generation of inappropriate content. Prompts containing the following will be rejected:

- Explicit or sexual content
- Violence or gore
- Hate speech or discrimination
- Illegal activities
- Copyrighted material

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
interface FluxGenClient {
  generateImage(params: GenerationParams): Promise<GenerationResponse>;
  getHealth(): Promise<HealthStatus>;
  getAnalytics(): Promise<Analytics>;
}

const client = new FluxGenClient('https://your-api.com');

// Generate an image
const result = await client.generateImage({
  message: 'A beautiful landscape',
  style: 'photorealistic',
  width: 1024,
  height: 1024
});
```

### Python

```python
import requests

class FluxGenClient:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def generate_image(self, **params):
        response = requests.get(f"{self.base_url}/generate-image", params=params)
        return response.json()

client = FluxGenClient('https://your-api.com')
result = client.generate_image(
    message='A beautiful landscape',
    style='photorealistic',
    width=1024,
    height=1024
)
```

## Webhooks

FluxGen supports webhooks for real-time notifications:

### Image Generation Complete

```json
{
  "event": "image.generated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "requestId": "img_1705312200_abc123def",
    "images": [...],
    "generationTime": 3500
  }
}
```

### Rate Limit Warning

```json
{
  "event": "rate_limit.warning",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "clientId": "192.168.1.100",
    "limitType": "hour",
    "usage": {
      "current": 45,
      "max": 50
    }
  }
}
```

## Best Practices

1. **Implement retry logic** for rate-limited requests
2. **Cache responses** when appropriate
3. **Validate inputs** before sending requests
4. **Handle errors gracefully** with user-friendly messages
5. **Monitor usage** to stay within rate limits
6. **Use appropriate timeouts** for long-running requests

## Support

For API support and questions:

- 🐛 Issues: [GitHub Issues](https://github.com/YatharthSanghavi/fluxgen/issues)
- 📖 Documentation: [Full Documentation](/README.md)

export interface GenerationParams {
  message: string;
  style: string;
  n: number;
  width: number;
  height: number;
  steps: number;
  seed?: string;
  negative_prompt?: string;
  enhance: boolean;
}

export interface GeneratedImage {
  url: string;
  index: number;
  b64_json?: string;
  metadata: {
    originalPrompt: string;
    enhancedPrompt: string;
    style: string;
    parameters: {
      width: number;
      height: number;
      steps: number;
      seed?: string;
    };
    timestamp: string;
    requestId: string;
    revised_prompt?: string;
  };
}

export interface GenerationResponse {
  success: boolean;
  images: GeneratedImage[];
  totalImages: number;
  model: string;
  generationTime: number;
  requestId: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  category: string;
  message: string;
  code: string;
  statusCode?: number;
  requestId?: string;
  retryable?: boolean;
  limitType?: string;
  usage?: any;
  resetTime?: number;
  retryAfter?: number;
  timestamp: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: string;
  version: string;
  services: {
    rateLimiter: {
      status: string;
      activeClients: number;
    };
    analytics: {
      status: string;
      totalRequests: number;
      recentRequests: number;
    };
    imageGeneration: {
      status: string;
      endpoint: string;
      model: string;
    };
  };
  features: {
    stylePresets: string[];
    supportedFormats: string[];
    maxDimensions: string;
    maxImages: number;
    maxSteps: number;
  };
}

export interface Analytics {
  timestamp: string;
  overview: {
    totalRequests: number;
    uniqueClients: number;
    avgRequestsPerClient: number;
  };
  timeWindows: {
    lastHour: number;
    lastDay: number;
    lastWeek: number;
  };
  styleUsage: Record<string, number>;
  averageParameters: {
    steps: number;
    width: number;
    height: number;
  };
  topClients: Array<{
    clientId: string;
    requests: number;
  }>;
  recentRequests: Array<{
    timestamp: string;
    requestId: string;
    style: string;
    parameters: any;
  }>;
}
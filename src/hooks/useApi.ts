import { useState, useCallback } from 'react';
import { GenerationParams, GenerationResponse, ApiError, HealthStatus, Analytics } from '../types';

const API_BASE_URL = 'https://tasteless-ola-yatharthsanghvi-87194279.koyeb.app/webhook-test';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const generateImage = useCallback(async (params: GenerationParams): Promise<GenerationResponse> => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        message: params.message,
        style: params.style,
        n: params.n.toString(),
        width: params.width.toString(),
        height: params.height.toString(),
        steps: params.steps.toString(),
        enhance: params.enhance.toString(),
        ...(params.seed && params.seed.trim() && { seed: params.seed.trim() }),
        ...(params.negative_prompt && { negative_prompt: params.negative_prompt })
      });

      const response = await fetch(`${API_BASE_URL}/generate-image?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      // Handle binary response for images
      if (response.headers.get('content-type')?.includes('image/')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        return {
          success: true,
          images: [{
            url: imageUrl,
            index: 1,
            metadata: {
              originalPrompt: params.message,
              enhancedPrompt: params.message,
              style: params.style,
              parameters: {
                width: params.width,
                height: params.height,
                steps: params.steps,
                seed: params.seed || undefined
              },
              timestamp: new Date().toISOString(),
              requestId: `local_${Date.now()}`
            }
          }],
          totalImages: 1,
          model: 'black-forest-labs/FLUX.1-schnell-Free',
          generationTime: 0,
          requestId: `local_${Date.now()}`,
          timestamp: new Date().toISOString()
        };
      }

      const data = await response.json();
      
      if (data.error) {
        throw data;
      }

      return data;
    } catch (err: any) {
      const apiError: ApiError = {
        error: err.error || 'Generation failed',
        category: err.category || 'unknown',
        message: err.message || 'An unexpected error occurred',
        code: err.code || 'UNKNOWN_ERROR',
        statusCode: err.statusCode,
        requestId: err.requestId,
        retryable: err.retryable || false,
        limitType: err.limitType,
        usage: err.usage,
        resetTime: err.resetTime,
        retryAfter: err.retryAfter,
        timestamp: new Date().toISOString()
      };
      
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHealthStatus = useCallback(async (): Promise<HealthStatus> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Unable to fetch health status');
      const data = await response.json();
      // If backend returns an array, use the first item
      if (Array.isArray(data)) {
        return data[0];
      }
      return data;
    } catch (err) {
      throw new Error('Unable to fetch health status');
    }
  }, []);

  const getAnalytics = useCallback(async (): Promise<Analytics> => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      if (!response.ok) throw new Error('Unable to fetch analytics');
      const data = await response.json();
      // If backend returns an array, use the first item
      if (Array.isArray(data)) {
        return data[0];
      }
      return data;
    } catch (err) {
      throw new Error('Unable to fetch analytics');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    generateImage,
    getHealthStatus,
    getAnalytics,
    clearError
  };
};
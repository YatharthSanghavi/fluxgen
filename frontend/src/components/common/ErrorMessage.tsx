import React from 'react';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { ApiError } from '../../types';

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  onDismiss 
}) => {
  const getErrorIcon = () => {
    switch (error.category) {
      case 'rate_limit':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getErrorColor = () => {
    switch (error.category) {
      case 'rate_limit':
        return 'border-yellow-200 bg-yellow-50';
      case 'validation_error':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  const formatRetryTime = () => {
    if (!error.retryAfter) return null;
    
    const minutes = Math.floor(error.retryAfter / 60);
    const seconds = error.retryAfter % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorColor()}`}>
      <div className="flex items-start space-x-3">
        {getErrorIcon()}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {error.error}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {error.message}
          </p>
          
          {error.category === 'rate_limit' && error.limitType && (
            <div className="text-xs text-gray-500 mb-2">
              <p>Limit: {error.limitType}</p>
              {error.retryAfter && (
                <p>Try again in: {formatRetryTime()}</p>
              )}
            </div>
          )}
          
          {error.requestId && (
            <p className="text-xs text-gray-400 mb-2">
              Request ID: {error.requestId}
            </p>
          )}
          
          <div className="flex space-x-2">
            {error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
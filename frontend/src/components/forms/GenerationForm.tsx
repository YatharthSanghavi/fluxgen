import React, { useState, useCallback } from 'react';
import { Wand2, Settings, Sparkles, Image, ChevronDown, ChevronUp, Zap, Palette, Sliders } from 'lucide-react';
import { GenerationParams } from '../../types';
import { STYLE_PRESETS, DIMENSION_PRESETS } from '../../constants/styles';

interface GenerationFormProps {
  onSubmit: (params: GenerationParams) => void;
  loading: boolean;
}

type FormFieldValue = string | number | boolean;

export const GenerationForm: React.FC<GenerationFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<GenerationParams>({
    message: '',
    style: 'default',
    n: 1,
    width: 1024,
    height: 1024,
    steps: 2,
    seed: '',
    negative_prompt: '',
    enhance: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isPromptFocused, setIsPromptFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  const handleInputChange = useCallback((field: keyof GenerationParams, value: FormFieldValue) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDimensionChange = useCallback((dimension: 'width' | 'height', value: number) => {
    // Ensure value is a multiple of 16
    const adjustedValue = Math.round(value / 16) * 16;
    const clampedValue = Math.max(256, Math.min(2048, adjustedValue));
    setFormData(prev => ({ ...prev, [dimension]: clampedValue }));
  }, []);

  const handlePresetChange = useCallback((presetIndex: number) => {
    setSelectedPreset(presetIndex);
    const preset = DIMENSION_PRESETS[presetIndex];
    if (preset.label !== 'Custom') {
      setFormData(prev => ({ 
        ...prev, 
        width: preset.width, 
        height: preset.height 
      }));
    }
  }, []);

  const isFormValid = formData.message.length >= 3 && formData.message.length <= 1000;
  const isCustomDimensions = selectedPreset === DIMENSION_PRESETS.length - 1;

  const getPromptValidationColor = () => {
    if (formData.message.length === 0) return 'border-gray-300';
    if (formData.message.length < 3) return 'border-red-300';
    if (formData.message.length > 900) return 'border-orange-300';
    return 'border-green-300';
  };

  const getPromptValidationText = () => {
    if (formData.message.length === 0) return 'Start typing your creative vision...';
    if (formData.message.length < 3) return 'Too short - minimum 3 characters';
    if (formData.message.length > 900) return 'Almost at limit';
    return 'Looking good!';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
            <Wand2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI Image Generator</h2>
          <p className="text-gray-600">Transform your ideas into stunning visuals</p>
        </div>

        {/* Main Prompt Input */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Describe Your Vision
          </label>
          <div className="relative">
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              onFocus={() => setIsPromptFocused(true)}
              onBlur={() => setIsPromptFocused(false)}
              placeholder="A mystical forest with glowing mushrooms, ethereal light filtering through ancient trees, magical atmosphere..."
              className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none resize-none transition-all duration-200 ${getPromptValidationColor()} ${
                isPromptFocused ? 'shadow-lg scale-[1.01]' : 'shadow-md'
              }`}
              rows={4}
              minLength={3}
              maxLength={1000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.message.length}/1000
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              formData.message.length < 3 ? 'text-red-600' : 
              formData.message.length > 900 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {getPromptValidationText()}
            </span>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-4">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <Palette className="h-4 w-4 mr-2 text-purple-600" />
            Artistic Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => handleInputChange('style', style.id)}
                className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.style === style.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]'
                }`}
              >
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${style.gradient} mb-3 shadow-inner`} />
                <div className="text-sm font-semibold text-gray-900">{style.name}</div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{style.description}</div>
                {formData.style === style.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Image className="h-4 w-4 mr-2 text-green-600" />
              Number of Images
            </label>
            <div className="relative">
              <select
                value={formData.n}
                onChange={(e) => handleInputChange('n', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-200 appearance-none bg-white hover:border-gray-300"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} image{num > 1 ? 's' : ''}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Sliders className="h-4 w-4 mr-2 text-orange-600" />
              Image Dimensions
            </label>
            <div className="relative">
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-200 appearance-none bg-white hover:border-gray-300"
              >
                {DIMENSION_PRESETS.map((preset, index) => (
                  <option key={index} value={index}>{preset.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Custom Dimensions */}
        {isCustomDimensions && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Custom Dimensions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Width</label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 1024)}
                  min={256}
                  max={2048}
                  step={16}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-200"
                />
                <div className="text-xs text-gray-500">Must be multiple of 16</div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 1024)}
                  min={256}
                  max={2048}
                  step={16}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-200"
                />
                <div className="text-xs text-gray-500">Must be multiple of 16</div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Toggle */}
        <div className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center text-sm font-semibold text-gray-800">
              <Settings className="h-4 w-4 mr-2 text-gray-600" />
              Advanced Settings
            </div>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
            )}
          </button>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  Generation Steps
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', parseInt(e.target.value))}
                    min={1}
                    max={4}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Fast</span>
                    <span className="font-medium text-blue-600">
                      {formData.steps} step{formData.steps > 1 ? 's' : ''}
                    </span>
                    <span>Quality</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  Seed (Reproducibility)
                </label>
                <input
                  type="number"
                  value={formData.seed}
                  onChange={(e) => handleInputChange('seed', e.target.value)}
                  placeholder="Leave empty for random"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">
                Negative Prompt
              </label>
              <textarea
                value={formData.negative_prompt}
                onChange={(e) => handleInputChange('negative_prompt', e.target.value)}
                placeholder="Elements to avoid in the image (e.g., blurry, low quality, distorted)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none resize-none transition-all duration-200"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="enhance"
                checked={formData.enhance}
                onChange={(e) => handleInputChange('enhance', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enhance" className="flex items-center text-sm font-medium text-gray-700">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Enhance for better quality
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 transform ${
            isFormValid && !loading
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
              <span>Creating Magic...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Wand2 className="h-6 w-6 mr-3" />
              <span>Generate Images</span>
            </div>
          )}
        </button>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Your creative vision, powered by AI</p>
          <p>✨ High-quality results in seconds</p>
        </div>
      </form>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};
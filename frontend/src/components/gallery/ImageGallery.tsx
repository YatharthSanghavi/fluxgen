import React, { useState } from 'react';
import { Download, Info, X, Palette, Maximize2, ZoomIn } from 'lucide-react';
import { GeneratedImage } from '../../types';

interface ImageGalleryProps {
  images: GeneratedImage[];
  loading: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, loading }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${image.metadata.requestId}-${image.index}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    setShowInfo(false);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowInfo(false);
  };

  if (loading) {
    return (
      <div className="w-full">
        {/* Loading Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg animate-pulse w-32"></div>
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg animate-pulse w-24"></div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <div className="h-full flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto h-32 w-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <div className="relative">
            <Palette className="h-16 w-16 text-gray-400" />
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No images generated yet</h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Start creating amazing AI-generated images using the form above. Your creations will appear here in a beautiful gallery.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Gallery</h2>
          <p className="text-gray-500 mt-1">{images.length} image{images.length !== 1 ? 's' : ''} generated</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          Latest first
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {images.map((image, index) => (
          <div
            key={`${image.metadata.requestId}-${image.index}`}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
          >
            {/* Image Container */}
            <div className="aspect-square overflow-hidden relative">
              <img
                src={image.url}
                alt={`Generated image ${image.index}`}
                className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                onClick={() => handleImageClick(image)}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Floating Action Buttons */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex space-x-3">
                  <button
                    onClick={() => handleImageClick(image)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                    title="View full size"
                  >
                    <ZoomIn className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDownload(image)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                    title="Download"
                  >
                    <Download className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Style Badge */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                  <Palette className="h-3 w-3 mr-1" />
                  {image.metadata.style === 'default' ? 'Default' : 
                   image.metadata.style.charAt(0).toUpperCase() + image.metadata.style.slice(1)}
                </span>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {image.metadata.style === 'default' ? 'Default Style' : 
                     image.metadata.style.charAt(0).toUpperCase() + image.metadata.style.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {image.metadata.parameters.width} × {image.metadata.parameters.height}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(image)}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-full flex flex-col">
            {/* Top Controls */}
            <div className="flex justify-between items-center p-4 z-10 flex-shrink-0">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-3 rounded-full transition-all duration-200 backdrop-blur-sm ${
                  showInfo 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/90 hover:bg-white text-gray-700'
                }`}
                title="Toggle info"
              >
                <Info className="h-5 w-5" />
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(selectedImage)}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 text-gray-700 shadow-lg"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={closeModal}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 text-gray-700 shadow-lg"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className={`flex-1 flex items-center justify-center p-4 ${showInfo ? 'pb-0' : ''}`}>
              <img
                src={selectedImage.url}
                alt={`Generated image ${selectedImage.index}`}
                className={`max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ${
                  showInfo ? 'max-h-[50vh]' : 'max-h-full'
                }`}
              />
            </div>

            {/* Enhanced Info Panel */}
            {showInfo && (
              <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl p-6 max-h-[45vh] overflow-y-auto shadow-2xl border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Image Details
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    #{selectedImage.index}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Palette className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Style</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{selectedImage.metadata.style}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Maximize2 className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Dimensions</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedImage.metadata.parameters.width} × {selectedImage.metadata.parameters.height}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="h-4 w-4 bg-blue-500 rounded mr-2"></div>
                      <span className="text-sm font-medium text-gray-700">Steps</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{selectedImage.metadata.parameters.steps}</p>
                  </div>
                  
                  {selectedImage.metadata.parameters.seed && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="h-4 w-4 bg-green-500 rounded mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Seed</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium font-mono">{selectedImage.metadata.parameters.seed}</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Original Prompt</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 leading-relaxed">{selectedImage.metadata.originalPrompt}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Image
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sparkles, Trash2, Image as ImageIcon, Shield, Menu, X, Book } from 'lucide-react';
import { GenerationForm } from './components/forms/GenerationForm';
import { ImageGallery } from './components/gallery/ImageGallery';
import { ErrorMessage } from './components/common/ErrorMessage';
import { useApi } from './hooks/useApi';
import { GenerationParams, GeneratedImage } from './types';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Documentation } from './components/docs/Documentation';

function MainPage() {
  const { generateImage, loading, error, clearError } = useApi();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleGenerate = async (params: GenerationParams) => {
    try {
      clearError();
      const response = await generateImage(params);
      setImages(prev => [...response.images, ...prev]);
      setShowMobileForm(false); // Close mobile form after generation
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleRetry = () => {
    clearError();
  };

  const handleClearImages = () => {
    setImages([]);
    clearError();
  };

  return (
    <div className="space-y-6 lg:space-y-0 lg:flex lg:flex-row lg:gap-8">
      {/* Mobile Form Section */}
      <div className="lg:hidden">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
          <button
            onClick={() => setShowMobileForm(!showMobileForm)}
            className="w-full p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100/50 text-left hover:bg-gradient-to-r hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create Image</h2>
                  <p className="text-sm text-gray-600">Tap to generate with AI</p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${showMobileForm ? 'rotate-180' : ''}`}>
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>
          
          {showMobileForm && (
            <div className="p-6 animate-in slide-in-from-top-2 duration-300">
              {error && (
                <div className="mb-6">
                  <ErrorMessage
                    error={error}
                    onRetry={handleRetry}
                    onDismiss={clearError}
                  />
                </div>
              )}
              <GenerationForm onSubmit={handleGenerate} loading={loading} />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-96 flex-shrink-0">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-100/50 sticky top-24">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              FluxGen
            </h2>
            <p className="text-gray-600 text-sm">AI-powered image generation</p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage
                error={error}
                onRetry={handleRetry}
                onDismiss={clearError}
              />
            </div>
          )}
          <GenerationForm onSubmit={handleGenerate} loading={loading} />
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 min-h-0">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 lg:p-8 border-b border-gray-100/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ImageIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  Generated Images
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  {images.length === 0 ? 'Your creations will appear here' : `${images.length} image${images.length !== 1 ? 's' : ''} generated`}
                </p>
              </div>
              {images.length > 0 && (
                <button
                  onClick={handleClearImages}
                  className="flex items-center px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md group"
                  title="Clear all images"
                >
                  <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="p-6 lg:p-8">
            <ImageGallery images={images} loading={loading} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-lg">
              <Sparkles className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">FluxGen</span>
              <p className="text-xs lg:text-sm text-gray-600 -mt-1">AI Image Generator</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Generate
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === '/admin' 
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
            <Link
              to="/docs"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === '/docs' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Book className="h-4 w-4" />
              Docs
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                Generate
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/admin' 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
              <Link
                to="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/docs' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Book className="h-4 w-4" />
                Docs
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-100/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FluxGen</span>
          </div>
          <div className="text-gray-600 space-y-2">
            <p className="text-sm lg:text-base">
              Powered by <span className="font-semibold text-blue-600">Together AI FLUX.1 Schnell</span> • Built with <span className="font-semibold text-purple-600">React & TypeScript</span>
            </p>
            <p className="text-xs lg:text-sm text-gray-500">
              Advanced image generation with content filtering and rate limiting
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              © 2024 FluxGen. Crafted with care for creative minds.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 min-h-[80vh]">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/admin" element={
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100/50">
                <AdminDashboard />
              </div>
            } />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Palette, 
  Settings, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Zap,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Download,
  Play,
  Sparkles,
  Globe,
  Github
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CodeBlock: React.FC<{ code: string; language?: string; id: string }> = ({ code, language = 'bash', id }) => (
    <div className="relative bg-gray-900 rounded-xl p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copiedCode === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="text-sm text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const sections: DocSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <Book className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-blue-600" />
              Welcome to FluxGen
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              FluxGen is a modern, feature-rich AI image generation application built with React, TypeScript, and powered by Together AI's FLUX.1 Schnell model. Create stunning images from text prompts with advanced customization options and real-time analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/80 p-4 rounded-xl border border-blue-200">
                <div className="text-blue-600 font-semibold mb-2">🎨 Creative Freedom</div>
                <div className="text-sm text-gray-600">8+ art styles with custom parameters</div>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-purple-200">
                <div className="text-purple-600 font-semibold mb-2">🛡️ Enterprise Ready</div>
                <div className="text-sm text-gray-600">Rate limiting & content filtering</div>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-pink-200">
                <div className="text-pink-600 font-semibold mb-2">📊 Analytics</div>
                <div className="text-sm text-gray-600">Real-time monitoring & insights</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Multiple Art Styles</div>
                    <div className="text-sm text-gray-600">8+ preset styles from photorealistic to anime</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Custom Dimensions</div>
                    <div className="text-sm text-gray-600">Support up to 2048x2048 with presets</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Batch Generation</div>
                    <div className="text-sm text-gray-600">Generate up to 4 images simultaneously</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Rate Limiting</div>
                    <div className="text-sm text-gray-600">Multi-tier protection against abuse</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Content Filtering</div>
                    <div className="text-sm text-gray-600">Advanced inappropriate content detection</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Analytics Dashboard</div>
                    <div className="text-sm text-gray-600">Comprehensive usage statistics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Play className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
            <p className="text-gray-600 mb-6">Get FluxGen up and running in minutes with this step-by-step guide.</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Prerequisites</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Node.js 18 or higher</li>
              <li>• npm or yarn package manager</li>
              <li>• Together AI API key (for backend)</li>
              <li>• n8n instance (for workflow automation)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Installation Steps</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Clone the Repository</h4>
                <CodeBlock 
                  code={`git clone https://github.com/YatharthSanghavi/fluxgen.git
cd fluxgen`}
                  id="clone"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Install Dependencies</h4>
                <CodeBlock 
                  code="npm install"
                  id="install"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Configure API Endpoint</h4>
                <p className="text-sm text-gray-600 mb-2">Update the API endpoint in <code className="bg-gray-100 px-2 py-1 rounded">src/hooks/useApi.ts</code>:</p>
                <CodeBlock 
                  language="typescript"
                  code={`const API_BASE_URL = 'https://your-n8n-instance.com/webhook-test';`}
                  id="config"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Start Development Server</h4>
                <CodeBlock 
                  code="npm run dev"
                  id="dev"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">5. Open in Browser</h4>
                <p className="text-sm text-gray-600">Navigate to <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173</code></p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">🎉 You're Ready!</h4>
            <p className="text-sm text-green-700">FluxGen should now be running locally. You can start generating images right away!</p>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Features',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Overview</h2>
            <p className="text-gray-600 mb-6">Explore the powerful features that make FluxGen a comprehensive AI image generation platform.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-4">
                <Palette className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Art Styles</h3>
              </div>
              <p className="text-gray-700 mb-4">Choose from 8 carefully crafted style presets:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/60 p-2 rounded">Photorealistic</div>
                <div className="bg-white/60 p-2 rounded">Artistic</div>
                <div className="bg-white/60 p-2 rounded">Cinematic</div>
                <div className="bg-white/60 p-2 rounded">Fantasy</div>
                <div className="bg-white/60 p-2 rounded">Anime</div>
                <div className="bg-white/60 p-2 rounded">Vintage</div>
                <div className="bg-white/60 p-2 rounded">Minimalist</div>
                <div className="bg-white/60 p-2 rounded">Default</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Advanced Controls</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Custom dimensions up to 2048x2048</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Adjustable generation steps (1-4)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Seed support for reproducibility</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Negative prompts for exclusions</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Quality enhancement toggle</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Security & Safety</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Multi-tier rate limiting</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Content filtering system</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Input validation & sanitization</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Error handling & recovery</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Client IP tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Analytics & Monitoring</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Real-time usage statistics</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>System health monitoring</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Client activity tracking</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Style popularity metrics</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Historical data analysis</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200">
            <div className="flex items-center mb-4">
              <Smartphone className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Responsive Design</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium text-gray-900">Mobile</div>
                <div className="text-sm text-gray-600">Collapsible interface with touch optimization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💻</div>
                <div className="font-medium text-gray-900">Desktop</div>
                <div className="text-sm text-gray-600">Full sidebar layout with advanced controls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="font-medium text-gray-900">Large Screens</div>
                <div className="text-sm text-gray-600">Multi-column gallery with enhanced previews</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
            <p className="text-gray-600 mb-6">Complete reference for the FluxGen API endpoints and data structures.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Base URL</h4>
            <code className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">https://your-n8n-instance.com/webhook-test</code>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Endpoints</h3>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-3">GET</span>
                  <code className="text-lg font-mono">/generate-image</code>
                </div>
                <p className="text-gray-600 mb-4">Generate AI images from text prompts with customizable parameters.</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">Parameter</th>
                        <th className="text-left py-2 font-medium text-gray-700">Type</th>
                        <th className="text-left py-2 font-medium text-gray-700">Required</th>
                        <th className="text-left py-2 font-medium text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">message</td>
                        <td className="py-2">string</td>
                        <td className="py-2">✅</td>
                        <td className="py-2">Text prompt (3-1000 characters)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">style</td>
                        <td className="py-2">string</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Art style preset (default: 'default')</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">width</td>
                        <td className="py-2">number</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Image width (256-2048, default: 1024)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">height</td>
                        <td className="py-2">number</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Image height (256-2048, default: 1024)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">steps</td>
                        <td className="py-2">number</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Generation steps (1-4, default: 2)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">n</td>
                        <td className="py-2">number</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Number of images (1-4, default: 1)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">seed</td>
                        <td className="py-2">string</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Seed for reproducibility</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono">negative_prompt</td>
                        <td className="py-2">string</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Elements to avoid</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">enhance</td>
                        <td className="py-2">boolean</td>
                        <td className="py-2">❌</td>
                        <td className="py-2">Enable quality enhancement</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example Request</h4>
                <CodeBlock 
                  language="bash"
                  code={`curl "https://your-api.com/generate-image?message=A%20beautiful%20sunset&style=photorealistic&width=1024&height=1024&steps=2&n=1&enhance=true"`}
                  id="api-example"
                />
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-3">GET</span>
                  <code className="text-lg font-mono">/health</code>
                </div>
                <p className="text-gray-600 mb-4">Get system health status and service information.</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Response Example</h4>
                <CodeBlock 
                  language="json"
                  code={`{
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
      "totalRequests": 150
    }
  }
}`}
                  id="health-response"
                />
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium mr-3">GET</span>
                  <code className="text-lg font-mono">/analytics</code>
                </div>
                <p className="text-gray-600 mb-4">Retrieve usage analytics and statistics.</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Response Structure</h4>
                <CodeBlock 
                  language="json"
                  code={`{
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
    "cinematic": 28
  }
}`}
                  id="analytics-response"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Handling</h3>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-red-800 mb-2">Error Response Format</h4>
              <CodeBlock 
                language="json"
                code={`{
  "error": "Rate limit exceeded",
  "category": "rate_limit",
  "message": "Too many requests per minute. Current: 6/5",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 45,
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                id="error-response"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'configuration',
      title: 'Configuration',
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Guide</h2>
            <p className="text-gray-600 mb-6">Learn how to customize and configure FluxGen for your specific needs.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Environment Setup</h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">API Configuration</h4>
              <p className="text-gray-600 mb-3">Update the API endpoint in <code className="bg-gray-200 px-2 py-1 rounded">src/hooks/useApi.ts</code>:</p>
              <CodeBlock 
                language="typescript"
                code={`// src/hooks/useApi.ts
const API_BASE_URL = 'https://your-n8n-instance.com/webhook-test';

// For local development
const API_BASE_URL = 'http://localhost:5678/webhook-test';

// For production
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.fluxgen.com';`}
                id="api-config"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Style Presets</h4>
              <p className="text-gray-600 mb-3">Customize available styles in <code className="bg-gray-200 px-2 py-1 rounded">src/constants/styles.ts</code>:</p>
              <CodeBlock 
                language="typescript"
                code={`export const STYLE_PRESETS = [
  {
    id: 'custom-style',
    name: 'Custom Style',
    description: 'Your custom style description',
    gradient: 'from-blue-400 to-purple-600'
  },
  // Add more custom styles...
];`}
                id="style-config"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Dimension Presets</h4>
              <p className="text-gray-600 mb-3">Configure available dimension presets:</p>
              <CodeBlock 
                language="typescript"
                code={`export const DIMENSION_PRESETS = [
  { label: 'Square HD (1024x1024)', width: 1024, height: 1024 },
  { label: 'Portrait (768x1024)', width: 768, height: 1024 },
  { label: 'Landscape (1024x768)', width: 1024, height: 768 },
  { label: 'Ultra Wide (1920x1080)', width: 1920, height: 1080 },
  { label: 'Custom', width: 1024, height: 1024 }
];`}
                id="dimension-config"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend Configuration</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-800 mb-3">n8n Workflow Setup</h4>
              <p className="text-blue-700 mb-3">Import the provided n8n workflow from <code className="bg-blue-100 px-2 py-1 rounded">n8n/image.json</code>:</p>
              <ol className="list-decimal list-inside space-y-2 text-blue-700">
                <li>Open your n8n instance</li>
                <li>Go to Workflows → Import from File</li>
                <li>Select the <code className="bg-blue-100 px-2 py-1 rounded">n8n/image.json</code> file</li>
                <li>Configure your Together AI credentials</li>
                <li>Activate the workflow</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-green-800 mb-3">Together AI Setup</h4>
              <p className="text-green-700 mb-3">Configure your Together AI credentials in n8n:</p>
              <ol className="list-decimal list-inside space-y-2 text-green-700">
                <li>Get your API key from <a href="https://together.ai" className="underline">Together AI</a></li>
                <li>In n8n, go to Credentials → Add Credential</li>
                <li>Select "HTTP Header Auth"</li>
                <li>Set Header Name: <code className="bg-green-100 px-2 py-1 rounded">Authorization</code></li>
                <li>Set Header Value: <code className="bg-green-100 px-2 py-1 rounded">Bearer YOUR_API_KEY</code></li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Build Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Development Build</h4>
                <CodeBlock 
                  code="npm run dev"
                  id="dev-build"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Production Build</h4>
                <CodeBlock 
                  code={`npm run build
npm run preview`}
                  id="prod-build"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Vite Configuration</h4>
                <p className="text-sm text-gray-600 mb-2">Customize build settings in <code className="bg-gray-100 px-2 py-1 rounded">vite.config.ts</code>:</p>
                <CodeBlock 
                  language="typescript"
                  code={`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
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
});`}
                  id="vite-config"
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: <Globe className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deployment Guide</h2>
            <p className="text-gray-600 mb-6">Deploy FluxGen to various platforms with these step-by-step guides.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Netlify</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="font-medium mb-1">1. Build the project</div>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">npm run build</code>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="font-medium mb-1">2. Deploy to Netlify</div>
                  <div className="text-xs text-gray-600">Drag & drop the <code>dist</code> folder</div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="font-medium mb-1">3. Configure redirects</div>
                  <div className="text-xs text-gray-600">Add <code>_redirects</code> file for SPA routing</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Vercel</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="font-medium mb-1">1. Install Vercel CLI</div>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">npm i -g vercel</code>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="font-medium mb-1">2. Deploy</div>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">vercel --prod</code>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="font-medium mb-1">3. Configure</div>
                  <div className="text-xs text-gray-600">Set environment variables in dashboard</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Docker Deployment</h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Dockerfile</h4>
              <CodeBlock 
                language="dockerfile"
                code={`# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
                id="dockerfile"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Docker Compose</h4>
              <CodeBlock 
                language="yaml"
                code={`version: '3.8'

services:
  fluxgen:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:`}
                id="docker-compose"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Build and Run</h4>
              <CodeBlock 
                code={`# Build the image
docker build -t fluxgen .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -p 80:80 fluxgen`}
                id="docker-run"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">Production Environment</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1">
                  <code className="text-yellow-700">VITE_API_BASE_URL</code>
                  <span className="text-yellow-600">Your API endpoint</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <code className="text-yellow-700">VITE_APP_TITLE</code>
                  <span className="text-yellow-600">Application title</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <code className="text-yellow-700">VITE_ANALYTICS_ENABLED</code>
                  <span className="text-yellow-600">Enable/disable analytics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">🚀 Ready to Deploy!</h4>
            <p className="text-sm text-green-700">Choose your preferred deployment method and follow the steps above. Don't forget to configure your n8n workflow and Together AI credentials!</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
            <Book className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FluxGen Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete guide to using, configuring, and deploying FluxGen - the modern AI image generation platform
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`mr-3 ${activeSection === section.id ? 'text-blue-600' : 'text-gray-400'}`}>
                      {section.icon}
                    </div>
                    <span className="font-medium">{section.title}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="h-4 w-4 ml-auto text-blue-600" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <a
                    href="https://github.com/YatharthSanghavi/fluxgen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  <a
                    href="https://together.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Together AI
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  <a
                    href="https://n8n.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    n8n Platform
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 lg:p-12">
              {sections.find(section => section.id === activeSection)?.content}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm">
              Made with ❤️ by the FluxGen Team • 
              <a href="https://github.com/YatharthSanghavi/fluxgen" className="ml-1 text-blue-600 hover:text-blue-700">
                Contribute on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
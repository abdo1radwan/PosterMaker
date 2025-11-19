
import React, { useState, useEffect } from 'react';
import { PosterPreview } from './components/PosterPreview';
import { Editor } from './components/Editor';
import { PosterData, PosterTheme, PosterLayout, INITIAL_POSTER_DATA } from './types';
import { DEFAULT_THEME } from './themes';
import { Key, ZoomIn, ZoomOut } from 'lucide-react';

const App: React.FC = () => {
  const [posterData, setPosterData] = useState<PosterData>(INITIAL_POSTER_DATA);
  const [currentTheme, setCurrentTheme] = useState<PosterTheme>(DEFAULT_THEME);
  const [currentLayout, setCurrentLayout] = useState<PosterLayout>('classic');
  const [zoom, setZoom] = useState(0.15);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Simple responsive zoom logic on mount
  useEffect(() => {
    const updateZoom = () => {
      const container = document.getElementById('preview-container');
      if (container) {
        // Desired width fits 4800px content into available width minus padding
        const availableWidth = container.clientWidth - 60;
        const newZoom = Math.min(Math.max(availableWidth / 4800, 0.08), 0.5);
        setZoom(newZoom);
      }
    };
    
    window.addEventListener('resize', updateZoom);
    // Small delay to ensure container is rendered
    setTimeout(updateZoom, 100);
    
    // Check API key
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }

    return () => window.removeEventListener('resize', updateZoom);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
      
      {/* API Key Warning */}
      {apiKeyMissing && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-slate-900 p-8 rounded-2xl max-w-md text-center shadow-2xl border border-red-900/50">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">API Key Missing</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              The <code>API_KEY</code> environment variable is not set. 
              The AI generation features will not work. 
              Please configure your environment variables to proceed with AI features.
            </p>
            <button 
              onClick={() => setApiKeyMissing(false)} 
              className="bg-white hover:bg-gray-100 px-8 py-3 rounded-xl font-medium text-slate-900 transition-all shadow-lg hover:shadow-xl"
            >
              Continue in Manual Mode
            </button>
          </div>
        </div>
      )}

      {/* Left Editor Panel */}
      <div className="w-[400px] flex-shrink-0 h-full z-10 relative border-r border-slate-800">
        <Editor 
            data={posterData} 
            theme={currentTheme}
            layout={currentLayout}
            onDataChange={setPosterData} 
            onThemeChange={setCurrentTheme}
            onLayoutChange={setCurrentLayout}
        />
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 flex flex-col h-full relative bg-slate-950">
        {/* Toolbar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 shadow-sm z-10">
          <span className="font-semibold text-slate-300 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            Live Preview
          </span>
          <div className="flex items-center gap-4 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <ZoomOut className="w-4 h-4 text-slate-400" />
            <input 
              type="range" 
              min="0.05" 
              max="0.4" 
              step="0.01" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 accent-blue-500 cursor-pointer bg-slate-700 h-1 rounded-lg appearance-none" 
            />
            <ZoomIn className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono w-12 text-right text-slate-400">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Preview Area */}
        <div 
            id="preview-container" 
            className="flex-1 overflow-auto p-10 flex items-start justify-center relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"
        >
            {/* Wrapper for centering the scaled content */}
            <div className="shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-800 bg-white transition-transform duration-200 ease-out">
               <PosterPreview 
                 data={posterData} 
                 theme={currentTheme} 
                 layout={currentLayout}
                 scale={zoom} 
               />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;

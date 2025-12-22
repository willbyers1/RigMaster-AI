
import React, { useState } from 'react';
import { X, Lock, Key, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const { setConnected } = useStore();

  if (!isOpen) return null;

  const handleInitialize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || key.length < 20) {
      setError('Please enter a valid API key string.');
      return;
    }

    localStorage.setItem('rigmaster_api_key', key.trim());
    setConnected(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      {/* Absolute Black Backdrop */}
      <div 
        className="absolute inset-0 bg-[#000000]/95 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Cyberpunk Access Card */}
      <div className="relative w-full max-w-md bg-[#000000] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,1)] animate-in zoom-in duration-300 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-purple-600 blur-sm" />
        
        <div className="p-10 sm:p-14 space-y-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-5 bg-white/5 rounded-full border border-white/10">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-[0.5em] uppercase">
                SYSTEM ACCESS
              </h2>
              <p className="text-slate-500 font-medium text-sm">Enter Gemini API Key</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleInitialize} className="space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="password"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setError('');
                  }}
                  placeholder="Paste Your API Key"
                  className="w-full bg-[#000000] border-2 border-purple-600 rounded-2xl px-6 py-5 text-white placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-600/20 font-mono transition-all"
                  autoFocus
                />
                <Key className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600/50" />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold px-2 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-6 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] uppercase tracking-widest"
            >
              INITIALIZE SYSTEM
            </button>
          </form>

          {/* Footer Metadata */}
          <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <a 
              href="https://ai.google.dev/gemini-api/docs/api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-slate-600 hover:text-purple-400 uppercase tracking-widest transition-colors"
            >
              Get a key from Google AI Studio
            </a>
            <div className="flex items-center gap-4 text-[9px] font-black text-slate-800 uppercase tracking-widest">
              <span>SECURE ACCESS ONLY</span>
              <div className="w-1 h-1 bg-slate-900 rounded-full" />
              <span>BYOK ENABLED</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-600 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;

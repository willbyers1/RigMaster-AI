
import React, { useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink, RefreshCcw, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, hasCustomKey, checkKeyStatus } = useStore();

  useEffect(() => {
    if (isSettingsOpen) {
      checkKeyStatus();
    }
  }, [isSettingsOpen, checkKeyStatus]);

  if (!isSettingsOpen) return null;

  const handleOpenSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      await checkKeyStatus();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={() => setSettingsOpen(false)}
      ></div>
      
      <div className="relative w-full max-w-md bg-[#0A0C10] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                <Key className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-black text-white">Neural Config</h2>
            </div>
            <button 
              onClick={() => setSettingsOpen(false)} 
              className="text-slate-500 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-200">API Key Protocol</h3>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    hasCustomKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${hasCustomKey ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-amber-400'}`} />
                    {hasCustomKey ? 'Connected' : 'Offline'}
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  RigMaster requires a key from a <strong>Paid Google Cloud Project</strong> to access high-tier Gemini 3 models.
                </p>
              </div>

              <button 
                onClick={handleOpenSelectKey}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
              >
                <RefreshCcw className="w-5 h-5" />
                {hasCustomKey ? 'SWITCH PROJECT KEY' : 'INITIALIZE PROJECT'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  If you encounter "Requested entity not found" errors, ensure your project has an active billing account attached.
                </p>
              </div>

              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-300">Billing Documentation</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              Security Protocol v2.5.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

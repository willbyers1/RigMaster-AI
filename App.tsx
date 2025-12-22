
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Cpu, LayoutDashboard, Settings, Zap, ArrowRight, ShieldCheck, Key, X } from 'lucide-react';
import { RigProfile } from './types';
import SetupView from './components/SetupView';
import DashboardView from './components/DashboardView';
import ApiKeyModal from './components/ApiKeyModal';
import SettingsModal from './components/SettingsModal';
import { Footer } from './components/Footer';
import { useStore } from './store';

const LandingPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { isConnected } = useStore();

  return (
    <div className="fixed inset-0 z-[150] bg-[#020617] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-cyan-500/[0.04] rounded-full blur-[160px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-125 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl space-y-16 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-10">
          <div className="inline-flex p-8 bg-cyan-500/10 rounded-[3.5rem] border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.15)] relative group">
             <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             <Cpu className="w-24 h-24 text-cyan-400 relative z-10" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent leading-[0.9] drop-shadow-2xl">
              RIGMASTER <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-slate-400 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
              Hardware longevity and performance prediction powered by the Gemini 3 neural engine.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10">
          {!isConnected ? (
            <button 
              onClick={() => setModalOpen(true)}
              className="group relative px-14 py-8 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_30px_90px_rgba(255,255,255,0.1)] flex items-center gap-4 overflow-hidden"
            >
              <Zap className="w-8 h-8 fill-current text-purple-600" />
              CONNECT TO SYSTEM
            </button>
          ) : (
            <div className="flex flex-col items-center gap-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-black uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4" />
                NEURAL LINK ACTIVE
              </div>
              <Link 
                to="/setup"
                className="group relative px-14 py-8 bg-cyan-500 text-white rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_30px_90px_rgba(6,182,212,0.3)] flex items-center gap-4"
              >
                ACCESS RIG DASHBOARD
                <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <ApiKeyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const Navbar: React.FC = () => {
  const { isConnected, setSettingsOpen, disconnect } = useStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl group-hover:bg-cyan-500/20 transition-all relative">
          <Cpu className="w-6 h-6 text-cyan-400" />
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          )}
        </div>
        <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
          RIGMASTER <span className="text-cyan-400">AI</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em]">
          <LayoutDashboard className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link to="/setup" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em]">
          <Settings className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Rig Config</span>
        </Link>
        <div className="h-6 w-px bg-white/10" />
        <button 
          onClick={disconnect}
          className="p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-xl hover:bg-rose-500/10 transition-all text-rose-500"
          title="Disconnect Neural Link"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<RigProfile | null>(null);
  const { isConnected, isInitialized, checkConnection } = useStore();

  useEffect(() => {
    checkConnection();
    const saved = localStorage.getItem('rigmaster_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [checkConnection]);

  const handleSaveProfile = (newProfile: RigProfile) => {
    setProfile(newProfile);
    localStorage.setItem('rigmaster_profile', JSON.stringify(newProfile));
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-8">
        <div className="relative">
           <Cpu className="w-20 h-20 text-cyan-500 animate-pulse" />
           <div className="absolute inset-0 blur-3xl bg-cyan-500/30 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-slate-400 font-mono text-sm tracking-[0.4em] uppercase font-bold animate-pulse">Initializing Neural Link</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return <LandingPage />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020617] text-slate-50 pt-20 flex flex-col selection:bg-cyan-500/30">
        <Navbar />
        
        <main className="container mx-auto px-6 py-12 flex-grow">
          <Routes>
            <Route path="/" element={
              profile ? <Navigate to="/dashboard" /> : <Navigate to="/setup" />
            } />
            <Route path="/setup" element={
              <SetupView onSave={handleSaveProfile} initialProfile={profile} />
            } />
            <Route path="/dashboard" element={
              profile ? <DashboardView profile={profile} /> : <Navigate to="/setup" />
            } />
          </Routes>
        </main>

        <Footer />
        <SettingsModal />
      </div>
    </HashRouter>
  );
};

export default App;

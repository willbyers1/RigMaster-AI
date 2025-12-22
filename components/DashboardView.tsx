
import React, { useState, useEffect } from 'react';
import { Search, Activity, Wind, Thermometer, ExternalLink, Zap, AlertCircle, Info, ChevronRight, Loader2, Laptop, Monitor } from 'lucide-react';
import { RigProfile, FPSResult, MaintenanceStatus } from '../types';
import { calculateMaintenance } from '../lib/maintenance-logic';
import { geminiService } from '../services/geminiService';
import MaintenanceWizard from './MaintenanceWizard';
import { EXTERNAL_GUIDES } from '../constants';

const DashboardView: React.FC<{ profile: RigProfile }> = ({ profile }) => {
  const [gameSearch, setGameSearch] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [fpsResult, setFpsResult] = useState<FPSResult | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<'PASTE' | 'FAN'>('FAN');

  // Maintenance statuses
  const fanStatus = calculateMaintenance(profile.type, profile.purchaseDate, profile.lastFanClean, 'FAN');
  const pasteStatus = calculateMaintenance(profile.type, profile.purchaseDate, profile.lastPasteChange, 'PASTE');

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameSearch) return;
    setIsPredicting(true);
    try {
      const result = await geminiService.predictFPS(profile, gameSearch);
      setFpsResult(result);
    } catch (err) {
      alert("Neural predictor is currently calibrating. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 100) return 'text-cyan-400';
    if (fps >= 60) return 'text-emerald-400';
    if (fps >= 30) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getExternalLink = (type: 'PASTE' | 'FAN', rigType: 'LAPTOP' | 'DESKTOP') => {
    const category = EXTERNAL_GUIDES[rigType];
    return type === 'PASTE' ? category.PASTE : category.CLEANING;
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      {/* Header Stat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-[#0A0C10] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-500/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-cyan-500/10 transition-all duration-1000" />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black flex items-center gap-4">
                <Zap className="text-cyan-400 w-8 h-8" /> PERFORMANCE ENGINE
              </h2>
              <p className="text-slate-500 font-medium text-lg">Predict frame rates for any title using hardware-aware AI logic.</p>
            </div>
            
            <form onSubmit={handlePredict} className="flex gap-4 mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-6 h-6" />
                <input 
                  type="text" 
                  placeholder="Analyze Game (e.g. Starfield, Elden Ring)"
                  className="w-full bg-[#020617] border border-white/10 rounded-3xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-lg transition-all"
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                />
              </div>
              <button 
                disabled={isPredicting || !gameSearch}
                className="px-10 bg-white text-black hover:bg-slate-200 disabled:opacity-50 rounded-3xl font-black text-lg transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
              >
                {isPredicting ? <Loader2 className="animate-spin w-6 h-6" /> : 'ANALYZE'}
              </button>
            </form>

            {fpsResult && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                {[
                  { label: 'Low Settings', val: fpsResult.low },
                  { label: 'Recommended', val: fpsResult.medium },
                  { label: 'Ultra/Extreme', val: fpsResult.ultra }
                ].map(item => (
                  <div key={item.label} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 block">{item.label}</span>
                    <div className="flex items-end justify-center gap-1">
                      <span className={`text-5xl font-black tracking-tighter ${getFPSColor(item.val)}`}>{item.val}</span>
                      <span className="text-xs font-black text-slate-600 mb-2">FPS</span>
                    </div>
                  </div>
                ))}
                <div className="col-span-1 sm:col-span-3 p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10 flex items-center gap-5">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-purple-300">Bottleneck Diagnosis</h4>
                    <p className="text-slate-400 font-medium mt-1">{fpsResult.bottleneck}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rig Quick Specs Card */}
        <div className="bg-[#0A0C10] border border-white/5 p-10 rounded-[2.5rem] space-y-8 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Active Profile</h2>
            <p className="text-2xl font-black text-white">{profile.name}</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Architecture</span>
              <span className="font-bold flex items-center gap-2 text-slate-200">
                {profile.type === 'LAPTOP' ? <Laptop className="w-4 h-4 text-purple-400" /> : <Monitor className="w-4 h-4 text-cyan-400" />}
                {profile.type}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Processor</span>
              <span className="font-bold text-sm text-slate-200 truncate">{profile.cpu}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Graphics Core</span>
              <span className="font-bold text-sm text-slate-200 truncate">{profile.gpu}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Output Target</span>
              <span className="font-black text-sm text-cyan-400">{profile.resolution}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Longevity & Maintenance Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">Hardware Integrity</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[fanStatus, pasteStatus].map((status) => (
            <div key={status.type} className={`bg-[#0A0C10] border p-10 rounded-[2.5rem] relative overflow-hidden transition-all hover:border-white/10 ${status.isCritical ? 'border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.1)]' : 'border-white/5'}`}>
              {status.isCritical && (
                <div className="absolute top-8 right-8 animate-pulse">
                  <AlertCircle className="text-rose-500 w-8 h-8" />
                </div>
              )}
              
              <div className="flex items-center gap-6 mb-10">
                <div className={`p-5 rounded-3xl ${status.type === 'FAN' ? 'bg-cyan-500/10' : 'bg-orange-500/10'}`}>
                  {status.type === 'FAN' ? <Wind className="w-8 h-8 text-cyan-400" /> : <Thermometer className="w-8 h-8 text-orange-400" />}
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase tracking-tight">{status.label}</h3>
                  <p className={`text-sm font-bold mt-1 ${status.isCritical ? 'text-rose-400' : 'text-slate-500'}`}>
                    {status.daysRemaining > 0 
                      ? `${status.daysRemaining} days until service` 
                      : `Service Overdue`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency Status</span>
                  <span className={`text-xl font-black ${status.percentage < 30 ? 'text-rose-500' : 'text-cyan-400'}`}>
                    {status.percentage}%
                  </span>
                </div>
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      status.percentage < 30 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    }`} 
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => {
                    setSelectedTask(status.type);
                    setWizardOpen(true);
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest active:scale-95"
                >
                  <Info className="w-4 h-4" /> REPAIR GUIDE
                </button>
                <a 
                  href={getExternalLink(status.type, profile.type)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 bg-black border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all"
                >
                  <ExternalLink className="w-5 h-5 text-slate-500" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {wizardOpen && (
        <MaintenanceWizard 
          task={selectedTask} 
          rigType={profile.type} 
          onClose={() => setWizardOpen(false)} 
        />
      )}
    </div>
  );
};

export default DashboardView;

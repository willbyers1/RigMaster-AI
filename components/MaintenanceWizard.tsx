
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, Loader2, Wrench, ExternalLink } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { EXTERNAL_GUIDES } from '../constants';

interface MaintenanceWizardProps {
  task: 'PASTE' | 'FAN';
  rigType: string;
  onClose: () => void;
}

const MaintenanceWizard: React.FC<MaintenanceWizardProps> = ({ task, rigType, onClose }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSteps() {
      try {
        const data = await geminiService.getMaintenanceWizardSteps(task, rigType);
        setSteps(data);
      } catch (err) {
        setSteps([
          "Turn off device and unplug power.",
          "Open the chassis carefully.",
          `Identify the ${task === 'PASTE' ? 'CPU cooler' : 'fan units'}.`,
          `Perform the ${task === 'PASTE' ? 're-pasting' : 'cleaning'} task.`,
          "Close the device and test temperatures."
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadSteps();
  }, [task, rigType]);

  const progress = ((currentStep + 1) / (steps.length || 1)) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl glass rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Wrench className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold">
                {task === 'PASTE' ? 'Thermal Paste Replacement' : 'Fan Deep Cleaning'}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
              <p className="text-slate-400 animate-pulse">Consulting RigMaster AI...</p>
            </div>
          ) : (
            <div className="space-y-8 h-64 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-cyan-500">Step {currentStep + 1} of {steps.length}</span>
                <p className="text-2xl font-medium leading-tight">
                  {steps[currentStep]}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {steps.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 w-6 rounded-full transition-colors ${idx === currentStep ? 'bg-cyan-500' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {currentStep < steps.length - 1 ? (
                    <button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={onClose}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                      Complete <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">Guides vary by specific model. Always consult your manufacturer's manual.</p>
            <a 
              href={`${EXTERNAL_GUIDES.YOUTUBE_SEARCH}${rigType}+${task === 'PASTE' ? 'thermal+paste' : 'fan+cleaning'}+guide`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
            >
              Watch Video Guide <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceWizard;
